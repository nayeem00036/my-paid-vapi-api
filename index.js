const express = require("express");
const { paymentMiddleware } = require("@x402/express");
const {
  x402ResourceServer,
  HTTPFacilitatorClient
} = require("@x402/core/server");
const {
  registerExactEvmScheme
} = require("@x402/evm/exact/server");

const app = express();
app.use(express.json());

const payTo = "0x78ef6EF893bCa46c096f529f41005c416587A279";

const facilitator = new HTTPFacilitatorClient({
  url: "https://facilitator.payai.network"
});

const server = new x402ResourceServer(facilitator);
registerExactEvmScheme(server);

app.use(paymentMiddleware({
  "GET /api/hello": {
    accepts: [{
      scheme: "exact",
      price: "$0.001",
      network: "eip155:8453",
      payTo
    }],
    description: "My VAPI Hello API",
    mimeType: "application/json"
  }
}, server));

app.get("/", (req, res) => {
  res.json({ name: "My VAPI API", status: "online" });
});

app.get("/api/hello", (req, res) => {
  res.json({
    success: true,
    message: "Hello from my own paid API!"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running on port " + PORT));