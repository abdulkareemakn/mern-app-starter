import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalName: { type: String, required: true, maxlength: 255 },
    mimeType: { type: String, required: true },
    sizeBytes: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isSafeInteger,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
      required: true,
    },
    confirmedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

fileSchema.index({ status: 1, createdAt: 1 });

export const File = mongoose.model("File", fileSchema);
