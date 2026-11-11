const nodemailer = require("nodemailer");

/**
 * Creates and returns configured Nodemailer transporter with connection timeouts
 */
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const rawPass = process.env.EMAIL_PASS;

  if (!user || !rawPass) {
    const err = new Error("Email service configuration missing: EMAIL_USER or EMAIL_PASS environment variable is not defined");
    err.code = "EMAIL_CONFIG_MISSING";
    throw err;
  }

  // Google App Passwords are 16 characters often copied with spaces (e.g. "abcd efgh ijkl mnop")
  const cleanPass = rawPass.replace(/\s+/g, "");
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT) || 587;
  const isGmail = host.includes("gmail") || process.env.EMAIL_SERVICE === "gmail";

  const baseConfig = isGmail
    ? {
        service: "gmail",
        auth: {
          user,
          pass: cleanPass,
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,   // 10 seconds
        socketTimeout: 15000,     // 15 seconds
      }
    : {
        host,
        port,
        secure: process.env.EMAIL_SECURE === "true" || port === 465,
        auth: {
          user,
          pass: cleanPass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      };

  return nodemailer.createTransport(baseConfig);
};

/**
 * Sends an email using Nodemailer
 * @param {{ email: string, subject: string, message?: string, html?: string }} options
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const fromName = process.env.FROM_NAME || "Aguaa";
    const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_USER;

    const message = {
      from: `"${fromName}" <${fromEmail}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || undefined,
    };

    const info = await transporter.sendMail(message);
    return info;
  } catch (error) {
    console.error("[Email] Delivery error:", error.message);
    throw error;
  }
};

/**
 * Generates an elegant, responsive HTML email template for password reset
 * @param {{ name?: string, resetUrl: string }} params
 * @returns {string} HTML string
 */
const getPasswordResetHtml = ({ name, resetUrl }) => {
  const greetingName = name ? ` ${name}` : "";
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Aguaa</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0d0000; padding: 40px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background: linear-gradient(145deg, #1f0202 0%, #100000 100%); border: 1px solid #4a0d0d; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.85);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 34px 28px 24px; border-bottom: 1px solid #380808; background: linear-gradient(180deg, #360202 0%, #1a0101 100%);">
              <h1 style="margin: 0; color: #d4af37; font-size: 26px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">AGUAA</h1>
              <p style="margin: 6px 0 0; color: #bca16d; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;">Marriage Biodata Maker</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 34px 32px 28px;">
              <h2 style="margin: 0 0 16px; color: #ffffff; font-size: 20px; font-weight: 600;">Password Reset Request</h2>
              <p style="margin: 0 0 18px; color: #d1d5db; font-size: 15px; line-height: 1.6;">
                Hello${greetingName},
              </p>
              <p style="margin: 0 0 24px; color: #d1d5db; font-size: 15px; line-height: 1.6;">
                We received a request to reset the password for your Aguaa account. Click the button below to choose your new password:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 28px auto;">
                <tr>
                  <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #b8860b 0%, #8c5d0f 100%); box-shadow: 0 4px 16px rgba(184, 134, 11, 0.4);">
                    <a href="${resetUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 34px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; letter-spacing: 0.5px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 26px 0 8px; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                Or copy and paste this link into your web browser:
              </p>
              <p style="margin: 0 0 24px; word-break: break-all; font-size: 13px; line-height: 1.4;">
                <a href="${resetUrl}" target="_blank" rel="noopener noreferrer" style="color: #d4af37; text-decoration: underline;">
                  ${resetUrl}
                </a>
              </p>

              <!-- Expiry Alert -->
              <div style="background-color: rgba(92, 24, 24, 0.4); border-left: 3px solid #d4af37; padding: 12px 16px; border-radius: 6px; margin: 24px 0;">
                <p style="margin: 0; color: #fef3c7; font-size: 13px; line-height: 1.5;">
                  ⏱ <strong>Note:</strong> This link is valid for <strong>15 minutes</strong> and can only be used once.
                </p>
              </div>

              <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                If you did not request this change, please ignore this email. Your password will remain unchanged and your account is secure.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 22px 28px; border-top: 1px solid #290606; background-color: #0a0000;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
                © ${currentYear} Aguaa • Marriage Biodata Maker. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Escapes HTML characters to prevent HTML injection in email bodies
 */
const escapeHtml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Generates an elegant, responsive HTML email template for admin contact enquiry notifications
 * @param {{ name: string, email: string, phone?: string, subject: string, message: string, submissionTime: string, enquiryId?: string }} params
 * @returns {string} HTML string
 */
const getContactEnquiryNotificationHtml = ({
  name,
  email,
  phone,
  subject,
  message,
  submissionTime,
  enquiryId,
}) => {
  const currentYear = new Date().getFullYear();
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Not provided");
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const safeTime = escapeHtml(submissionTime);
  const safeId = enquiryId ? escapeHtml(String(enquiryId)) : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Enquiry - Aguaa</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0d0000; padding: 40px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background: linear-gradient(145deg, #1f0202 0%, #100000 100%); border: 1px solid #4a0d0d; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.85);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px 28px 22px; border-bottom: 1px solid #380808; background: linear-gradient(180deg, #360202 0%, #1a0101 100%);">
              <h1 style="margin: 0; color: #d4af37; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">AGUAA</h1>
              <p style="margin: 4px 0 0; color: #bca16d; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;">New Contact Enquiry</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px 32px 24px;">
              <h2 style="margin: 0 0 18px; color: #ffffff; font-size: 19px; font-weight: 600;">
                You received a new message from the website contact form
              </h2>
              
              <!-- Sender Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(42, 6, 6, 0.5); border: 1px solid #421010; border-radius: 10px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="6">
                      <tr>
                        <td width="30%" style="color: #bca16d; font-size: 13px; font-weight: 600;">From:</td>
                        <td style="color: #ffffff; font-size: 14px; font-weight: 600;">${safeName}</td>
                      </tr>
                      <tr>
                        <td style="color: #bca16d; font-size: 13px; font-weight: 600;">Email:</td>
                        <td style="color: #f3f4f6; font-size: 13px;">
                          <a href="mailto:${safeEmail}" style="color: #d4af37; text-decoration: none;">${safeEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #bca16d; font-size: 13px; font-weight: 600;">Phone:</td>
                        <td style="color: #f3f4f6; font-size: 13px;">${safePhone}</td>
                      </tr>
                      <tr>
                        <td style="color: #bca16d; font-size: 13px; font-weight: 600;">Subject:</td>
                        <td style="color: #fef3c7; font-size: 13px; font-weight: 600;">${safeSubject}</td>
                      </tr>
                      <tr>
                        <td style="color: #bca16d; font-size: 13px; font-weight: 600;">Submitted:</td>
                        <td style="color: #9ca3af; font-size: 12px;">${safeTime}</td>
                      </tr>
                      ${safeId ? `
                      <tr>
                        <td style="color: #bca16d; font-size: 13px; font-weight: 600;">Enquiry ID:</td>
                        <td style="color: #9ca3af; font-size: 12px; font-family: monospace;">${safeId}</td>
                      </tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Body -->
              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 8px; color: #d4af37; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message Content:</p>
                <div style="background-color: #0b0202; border: 1px solid #380808; border-left: 3px solid #d4af37; border-radius: 8px; padding: 16px 18px; color: #e5e7eb; font-size: 14px; line-height: 1.6;">
                  ${safeMessage}
                </div>
              </div>

              <!-- Quick Reply CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0 10px;">
                <tr>
                  <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #b8860b 0%, #8c5d0f 100%);">
                    <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(subject)}%20—%20Aguaa" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 28px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600;">
                      Reply via Email to ${safeName}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 18px 24px; border-top: 1px solid #290606; background-color: #0a0000;">
              <p style="margin: 0; color: #6b7280; font-size: 11px; line-height: 1.5;">
                This is an automated notification from the Aguaa Biodata website.
                <br>© ${currentYear} Aguaa • Marriage Biodata Maker.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

module.exports = sendEmail;
module.exports.sendEmail = sendEmail;
module.exports.getPasswordResetHtml = getPasswordResetHtml;
module.exports.getContactEnquiryNotificationHtml = getContactEnquiryNotificationHtml;
