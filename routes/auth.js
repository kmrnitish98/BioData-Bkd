const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");
const crypto = require("crypto");
const User = require("../models/User");
const { sendEmail, getPasswordResetHtml } = require("../utils/sendEmail");

const router = express.Router();

const getZodError = (parseResult) =>
  parseResult.error?.issues?.[0]?.message ||
  parseResult.error?.errors?.[0]?.message ||
  "Invalid input";

const normalizeMobile = (input) => {
  if (!input || typeof input !== "string") return "";
  let digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 5 : 50, // 5 in production, 50 in dev/test
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .transform((val) => val.trim()),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: "Invalid email address" }
    ),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

const loginSchema = z
  .object({
    email: z.string().optional(),
    mobile: z.string().optional(),
    identifier: z.string().optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine(
    (data) =>
      Boolean(
        (data.email && data.email.trim()) ||
          (data.mobile && data.mobile.trim()) ||
          (data.identifier && data.identifier.trim())
      ),
    {
      message: "Email or mobile number is required",
      path: ["email"],
    }
  );

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 5 : 50,
  message: {
    message: "Too many password reset requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 10 : 100,
  message: {
    message: "Too many reset attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters"),
});

const generateToken = (id, role) => {
  console.log("[Auth] Generating JWT token with role:", role);
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: getZodError(parsed) });
    }
    const { name, mobile, email, password } = parsed.data;

    // Validate Indian mobile number format (10 digits starting 6-9)
    const cleanMobile = normalizeMobile(mobile);
    if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({ message: "Please provide a valid 10-digit mobile number" });
    }

    // Duplicate mobile number check
    const existingMobile = await User.findOne({ mobile: cleanMobile });
    if (existingMobile) {
      return res
        .status(409)
        .json({ message: "This mobile number is already registered" });
    }

    // Duplicate email check
    const cleanEmail = email.trim().toLowerCase();
    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res
        .status(409)
        .json({ message: "This email is already registered" });
    }

    const userData = {
      name,
      mobile: cleanMobile,
      email: cleanEmail,
      password,
    };

    const user = await User.create(userData);

    const token = generateToken(user._id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        avatar: user.avatar,
        role: user.role,
      },
    });
    console.log("[Auth] Hybrid Signup OK — user id:", user._id, "mobile:", cleanMobile, "hasEmail:", Boolean(cleanEmail));
  } catch (err) {
    console.error("[Auth] signup error:", err.message);
    if (err.code === 11000) {
      if (err.keyPattern?.mobile) {
        return res.status(409).json({ message: "This mobile number is already registered" });
      }
      if (err.keyPattern?.email) {
        return res.status(409).json({ message: "This email is already registered" });
      }
    }
    res.status(500).json({ message: "Server error during registration" });
  }
});

// POST /api/auth/login
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: getZodError(parsed) });
    }
    const { password } = parsed.data;
    const rawIdentifier = (parsed.data.identifier || parsed.data.email || parsed.data.mobile || "").trim();

    const isEmail = rawIdentifier.includes("@");
    let user;
    if (isEmail) {
      user = await User.findOne({ email: rawIdentifier.toLowerCase() }).select("+password");
    } else {
      const norm = normalizeMobile(rawIdentifier);
      user = await User.findOne({ mobile: norm || rawIdentifier }).select("+password");
    }

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        avatar: user.avatar,
        role: user.role,
      },
    });
    console.log("[Auth] Login response sent for user role:", user.role);
  } catch (err) {
    console.error("[Auth] login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

// POST /api/auth/google
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      console.warn("[Auth] /google called with no token");
      return res.status(400).json({ message: "No Google token provided" });
    }

    // Verify the access_token with Google
    let googleData;
    try {
      const { data } = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 8000,
        },
      );
      googleData = data;
    } catch (googleErr) {
      const status = googleErr.response?.status;
      const msg =
        googleErr.response?.data?.error_description || googleErr.message;
      console.error(`[Auth] Google userinfo failed: ${status} — ${msg}`);
      return res
        .status(401)
        .json({ message: "Invalid Google token. Please sign in again." });
    }

    const { sub: googleId, email, name, picture: avatar } = googleData;
    if (!email) {
      console.error(
        "[Auth] Google profile has no email:",
        JSON.stringify(googleData),
      );
      return res
        .status(400)
        .json({ message: "Google account has no email address." });
    }

    let user = await User.findOne({ email });
    if (user) {
      if (user.isDisabled) {
        return res
          .status(403)
          .json({ message: "Your account has been disabled. Please contact support." });
      }
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      user = await User.create({ name, email, googleId, avatar, emailVerified: true });
    }

    const jwtToken = generateToken(user._id, user.role);
    const isProd = process.env.NODE_ENV === "production";
    console.log(
      `[Auth] Google login OK — user:${user._id} NODE_ENV:${process.env.NODE_ENV} secure:${isProd} sameSite:${isProd ? "none" : "lax"}`,
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        avatar: user.avatar,
        role: user.role,
      },
    });
    console.log("[Auth] Google login response sent for user role:", user.role);
  } catch (err) {
    console.error("[Auth] Google login unexpected error:", err.message);
    res.status(500).json({ message: "Google login failed. Please try again." });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0), // Immediately expired
  });
  res.json({ message: "Logged out successfully" });
});

// GET /api/auth/me
router.get("/me", require("../middleware/auth").protect, (req, res) => {
  const u = req.user;
  res.json({
    user: {
      id: u._id,
      name: u.name,
      email: u.email,
      mobile: u.mobile,
      avatar: u.avatar,
      role: u.role,
    },
  });
  console.log("[Auth] /me endpoint returning user with role:", u.role);
});

// ── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  try {
    if (req.body.mobile && !req.body.email) {
      return res.status(400).json({
        message: "Password recovery via mobile number is not supported yet. For accounts without an email address, please contact support for assistance.",
      });
    }

    const parseResult = forgotPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg =
        parseResult.error.issues?.[0]?.message ||
        parseResult.error.errors?.[0]?.message ||
        "Please provide a valid email address";
      return res.status(400).json({ message: errorMsg });
    }

    const email = req.body.email.toLowerCase().trim();
    const user = await User.findOne({ email });

    // Anti-account-enumeration: Always return 200 with the exact same message
    // even if the email does not exist in the database.
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate cryptographically secure random reset token (SHA-256 stored in DB)
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Construct reset URL using configured client domain
    const clientBaseUrl = (
      process.env.CLIENT_URL ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173"
    ).replace(/\/$/, "");
    const resetUrl = `${clientBaseUrl}/reset-password?token=${resetToken}`;

    const textMessage = `Hello ${user.name},\n\nYou requested a password reset for your Aguaa account. Please click the link below to choose a new password (valid for 15 minutes):\n\n${resetUrl}\n\nIf you did not request this, please ignore this email. Your password will remain secure.`;
    const htmlMessage = getPasswordResetHtml({ name: user.name, resetUrl });

    try {
      await sendEmail({
        email: user.email,
        subject: "Aguaa - Password Reset Request",
        message: textMessage,
        html: htmlMessage,
      });

      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (emailErr) {
      console.error("[Auth] Failed to send password reset email:", emailErr.message);
      // Clean up token on email failure so user can retry cleanly
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message: "Failed to send password reset email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("[Auth] forgot-password error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/auth/reset-password ───────────────────────────────────────────
router.post("/reset-password", resetPasswordLimiter, async (req, res) => {
  try {
    const parseResult = resetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg =
        parseResult.error.issues?.[0]?.message ||
        parseResult.error.errors?.[0]?.message ||
        "Invalid input";
      return res.status(400).json({ message: errorMsg });
    }

    const { token, password } = parseResult.data;

    // Hash the token received from the URL query to match stored SHA-256 hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching token that has not expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Password reset link is invalid or has expired. Please request a new one.",
      });
    }

    // Set new password (pre-save hook will hash with bcrypt)
    user.password = password;
    // Single-use: invalidate reset token immediately
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now sign in with your new password.",
    });
  } catch (err) {
    console.error("[Auth] reset-password error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/auth/verify-email ─────────────────────────────────────────────
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Verification link is invalid or has expired.",
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (err) {
    console.error("[Auth] verify-email error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/auth/resend-verification ──────────────────────────────────────
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a verification email has been sent.",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "This email is already verified." });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const clientBaseUrl = (
      process.env.CLIENT_URL ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173"
    ).replace(/\/$/, "");
    const verifyUrl = `${clientBaseUrl}/verify-email?token=${verificationToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Aguaa - Verify your email",
        message: `Hello ${user.name},\n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}\n\nIf you did not request this, please ignore this email.`,
        html: `<p>Hello ${user.name},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">Verify Email</a></p>`,
      });
    } catch (mailErr) {
      console.warn("[Auth] Failed to send verification email:", mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a verification email has been sent.",
    });
  } catch (err) {
    console.error("[Auth] resend-verification error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
