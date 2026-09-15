import mongoose from 'mongoose';

const parcelSchema = new mongoose.Schema(
  {
    ulpin: { type: String, required: true, unique: true, index: true },
    surveyNo: { type: String, required: true },
    district: { type: String, required: true },
    taluk: { type: String, required: true },
    village: { type: String, required: true },
    coordinates: [[Number]],
    center: [Number],
    areaSqFt: Number,
    areaAcres: Number,
    zoning: String,
    zoningCode: String,
    circleRatePerSqFt: Number,
    marketValue: Number,
    propertyTaxAnnual: Number,
    owner: {
      name: String,
      aadhaarMasked: String,
      possessionDate: String,
      mutationStatus: String,
      titleType: String,
      deedNo: String
    },
    financial: {
      isEncumbered: Boolean,
      lienLockActive: Boolean,
      bankLien: String,
      loanAmount: Number,
      lienId: String,
      courtDispute: Boolean,
      taxPendingDues: Number
    },
    aiSurveillance: {
      encroachmentDetected: Boolean,
      severity: String,
      detectedViolation: String,
      riskScore: Number,
      historicalBuildingAreaPct: Number,
      currentBuildingAreaPct: Number,
      lastSatelliteScan: String
    }
  },
  { timestamps: true }
);

export default mongoose.models.Parcel || mongoose.model('Parcel', parcelSchema);
