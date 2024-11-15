import { Router } from "express";
import User from "./models/user.js";
import { createToken, generateOtp } from "./utils/helper.js";

export const router = Router();

router.post("/signup", async (req, res) => {
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

router.post("/verify-otp", async (req, res) => {
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`User with email ${email} not found!`);
    } else if (!!user) {
      if (user?.otpVerified && user?.password === password) {
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

router.get("/get-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new Error("User not found!");
    }
    const foundUser = user.toObject();
    delete foundUser.password;
    res.status(200).send(foundUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});
