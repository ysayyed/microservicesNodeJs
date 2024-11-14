import express from "express";
import { config } from "dotenv";
import httpProxy from "http-proxy";
const proxy = httpProxy.createProxyServer();
config({
  path: "../../.env",
});

const app = express();
const PORT = process.env.GATEWAY_PORT || "3000";
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h1>Gateway health ok</h1>");
});

app.use("/api/auth", (req, res) => {
  proxy.web(req, res, { target: process.env.AUTH_URL }, (err) => {
    console.error(`Error forwarding request to Auth service: ${err.message}`);
    res.status(500).send("Internal Server Error");
  });
});

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
