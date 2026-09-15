import mongoose from 'mongoose';

const documentRecordSchema = new mongoose.Schema(
  {
    documentId: { type: String, required: true, unique: true },
    documentType: { type: String, enum: ['SALE_DEED', 'SURVEY_MAP', 'ENCUMBRANCE_CERTIFICATE', 'TOWN_ZONING_PLAN'], required: true },
    filename: String,
    ulpinTarget: String,
    ocrExtractedData: {
      ownerNameExtracted: String,
      surveyNoExtracted: String,
      deedNoExtracted: String,
      areaSqFtExtracted: Number,
      considerationAmount: Number
    },
    aiVerificationResult: {
      status: { type: String, enum: ['VERIFIED_MATCH', 'MISMATCH_FLAGGED', 'DUPLICATE_ENTRY', 'CONFLICT_SUSPECTED'] },
      mismatchFields: [String],
      confidenceScorePct: Number,
      conflictDetails: String
    },
    departmentSource: String
  },
  { timestamps: true }
);

export default mongoose.models.DocumentRecord || mongoose.model('DocumentRecord', documentRecordSchema);
