const mongoose = require('mongoose');

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
      religion: String,
      caste: String,
      gotra: String,
      zodiac: String,
      complexion: String,
      motherTongue: String,
    },
    educationInfo: {
      highestQualification: { type: String, required: true },
      college: String,
      passingYear: String,
      additionalQualification: String,
      occupation: String,
      employer: String,
      annualIncome: String,
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
        },
      ],
    },
    preferences: {
      bio: String,
      partnerExpectations: String,
      preferredLocation: String,
      hobbies: String,
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

module.exports = mongoose.model('Biodata', biodataSchema);
