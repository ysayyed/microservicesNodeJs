import express from "express";
import { config } from "dotenv";
import httpProxy from "http-proxy";
const proxy = httpProxy.createProxyServer({
  proxyTimeout: 30000,
});
config({
  path: "../../.env",
});

const app = express();
const PORT = process.env.GATEWAY_PORT || "3000";

app.get("/", (req, res) => {
  res.status(200).send("<h1>Gateway health ok</h1>");
});

app.use("/api/auth", (req, res) => {
  proxy.web(
    req,
    res,
    { target: process.env.AUTH_URL, changeOrigin: true },
    (err) => {
      console.error(`Error forwarding request to Auth service: ${err.message}`);
      res.status(500).send("Internal Server Error");
    }
  );
});

// Add this middleware to log the request received by the proxy
proxy.on("proxyReq", function (proxyReq, req, res, options) {
  console.log(
    `Received request to ${options.target.href}: ${req.method} ${req.url}`
  );
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
