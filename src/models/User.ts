import { Schema, model } from "mongoose";

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  location: { type: Array, default: [] },
});

export const User = model("User", userSchema);
