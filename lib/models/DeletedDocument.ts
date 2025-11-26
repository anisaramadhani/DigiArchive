import mongoose from 'mongoose';

const deletedDocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Lainnya',
    },
    imageData: {
      type: String,
      default: '',
    },
    deletedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      // Dokumen akan dihapus 30 hari setelah soft delete
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      index: { expireAfterSeconds: 0 }, // TTL index
    },
  },
  { timestamps: true }
);

export default mongoose.models.DeletedDocument || mongoose.model('DeletedDocument', deletedDocumentSchema);
