import express from "express";
import { config } from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { router } from "./routes.js";

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

app.get("/", (req, res) => {
  res.status(200).send("<h1>Auth service health ok</h1>");
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
