import mongoose from "mongoose";

const RawInputSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: false },
    text: { type: String, required: true },
    file_type: { type: String, default: "text/plain" },
    file_name: { type: String, default: null },
    source: { type: String, enum: ["manual", "file_upload", "third_party"], default: "manual" },
    metadata: { type: Object, default: {} },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.RawInput || mongoose.model("RawInput", RawInputSchema);
