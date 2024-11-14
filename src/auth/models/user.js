import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: null,
    },
    age: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
    },
    otp: {
      type: Number,
      default: null,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
    username: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    addresses: {
      type: [],
      default: [],
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);
