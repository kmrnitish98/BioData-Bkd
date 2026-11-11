const mongoose = require('mongoose');
const crypto = require('crypto');

const biodataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
    shortId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    templateId: {
      type: String,
      default: 'default',
    },
    photoURL: {
      type: String,
      default: '',
    },
    photoPublicId: {
      type: String,
      default: '',
    },
    photos: {
      type: [{
        url: String,
        publicId: String
      }],
      default: [],
    },
    personalInfo: {
      fullName: { type: String, required: true, trim: true },
      dob: String,
      height: String,
      weight: String,
      maritalStatus: String,
      city: String,
      state: String,
      religion: String,
      caste: String,
      gotra: String,
      zodiac: String,
      complexion: String,
      motherTongue: String,
      languagesKnown: [String],
    },
    educationInfo: {
      highestQualification: { type: String, required: true },
      college: String,
      passingYear: String,
      additionalQualification: String,
      occupation: String,
      employer: String,
      annualIncome: String,
      careerDescription: String,
    },
    familyInfo: {
      fatherName: String,
      fatherOccupation: String,
      motherName: String,
      motherOccupation: String,
      nativePlace: String,
      familyType: String,
      familyStatus: String,
      siblings: [
        {
          name: String,
          role: String,
          married: Boolean,
        },
      ],
      brothersCount: Number,
      sistersCount: Number,
      marriedSiblings: Number,
      familyValues: [String],
      familyDescription: String,
    },
    preferences: {
      bio: String,
      aboutMe: String,
      partnerExpectations: String,
      preferredLocation: String,
      preferredEducation: [String],
      preferredProfession: [String],
      preferredCity: [String],
      hobbies: [String],
      contactName: { type: String, required: true },
      contactPhone: { type: String, required: true },
      contactEmail: String,
    },
  },
  { timestamps: true }
);

// Compound indexes for the two queries used in the app
biodataSchema.index({ userId: 1, createdAt: -1 });
biodataSchema.index({ isPublic: 1, createdAt: -1 });

// Text index for search functionality
biodataSchema.index({
  'personalInfo.fullName': 'text',
  'personalInfo.city': 'text',
  'personalInfo.religion': 'text',
  'personalInfo.caste': 'text',
  'educationInfo.highestQualification': 'text',
  'educationInfo.occupation': 'text',
});

// Pre-save hook: generate guaranteed unique shortId with collision verification
biodataSchema.pre('save', async function (next) {
  if (this.shortId) return next();

  // Primary preference: first 8 hex characters of document _id
  let candidate = this._id ? this._id.toString().substring(0, 8).toLowerCase() : null;
  if (candidate) {
    const existing = await this.constructor.findOne({ shortId: candidate, _id: { $ne: this._id } });
    if (!existing) {
      this.shortId = candidate;
      return next();
    }
  }

  // If collision detected (e.g. multiple profiles in same second), generate a unique 8-character hex string
  let isUnique = false;
  while (!isUnique) {
    candidate = crypto.randomBytes(4).toString('hex').toLowerCase();
    const existing = await this.constructor.findOne({ shortId: candidate });
    if (!existing) {
      isUnique = true;
      this.shortId = candidate;
    }
  }
  next();
});

module.exports = mongoose.model('Biodata', biodataSchema);
