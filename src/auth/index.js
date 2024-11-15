import express from "express";
import { config } from "dotenv";
import User from "./models/user.js";
import { generateOtp, createToken } from "./utils/helper.js";
import cors from "cors";
import mongoose from "mongoose";

config({
  path: "../../.env",
});

mongoose
  .connect("mongodb://root:example@mongo-auth:27017/auth?authSource=admin")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const app = express();
const PORT = process.env.AUTH_PORT || "3001";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Inside Signup");
    const available = await User.findOne({ email });
    if (available) {
      throw new Error("User already available!");
    }
    const otp = generateOtp();
    const user = await User.create({ ...req.body, otp });
    const createdUser = user.toObject();
    delete createdUser.password;
    delete createdUser.otp;
    res.status(201).send(createdUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("<h1>Auth service health ok</h1>");
});

app.get("/change", async (req, res) => {
  const user = await User.find({});
  res.status(200).send(user);
});

app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp });
    if (user) {
      const verified = otp == user.otp;
      if (verified) {
        await User.updateOne({ email }, { $set: { otpVerified: true } });
        res.status(200).send({ message: "OTP verified Successfully" });
      } else {
        throw new Error("Otp mismatched!");
      }
    } else {
      throw new Error("Email not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user.otpVerified);
    if (!user) {
      throw new Error(`User with email ${email} not found!`);
    } else if (!!user) {
      if (user.otpVerified && user.password === password) {
        const token = createToken(user._id, user.email, user.role);
        res.cookie("_token", token);
        res.status(200).send({ message: "Login successfull", token });
      } else {
        res
          .status(500)
          .send({ message: "User not verified or Password mismatched!" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
