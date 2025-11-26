import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    client_name: String,
    contact_person: String,
    project_title: String,
    description: String,
    raw_input_id: mongoose.Schema.Types.ObjectId,
    start_date: Date,
    end_date: Date,
    duration_hours: Number,
    hourly_rate: Number,
    total_charge: Number,
    address: String,
    client_profile: String,
    team: [String],
    communication_platforms: [String],
    tags: [String],
    source: {
      type: String,
      enum: ["manual", "file_upload", "third_party"],
    },
    source_metadata: Object,
    status: {
      type: String,
      enum: ["draft", "confirmed", "duplicate_pending", "archived"],
      default: "draft",
    },

    created_by: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    duplicate_of: mongoose.Schema.Types.ObjectId,
    attachments: [{ file_id: mongoose.Schema.Types.ObjectId, name: String }],
    metadata: Object,
    location: String,
    currency: String,
    billable: Boolean,
    external_refs: [String],

    techstack_used: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Client ||
  mongoose.model("Client", ClientSchema);
