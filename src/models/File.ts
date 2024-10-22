import { Schema, model } from "mongoose";

const fileSchema = new Schema({
  fileId: { type: Schema.Types.ObjectId, required: true },
  source: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
  uploadAt: { type: Date, default: Date.now },
});

export const File = model("File", fileSchema);
