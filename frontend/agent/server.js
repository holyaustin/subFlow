import express from "express";
import { buildAndSign } from "./agent-sign-tx.js"; // from earlier code
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Simple auth: set a secret and check header HMAC in production
const SECRET = process.env.AGENT_SECRET || "dev-secret";

app.post("/sign", async (req, res) => {
  try {
    const { secret, subscriptionId } = req.body;
    if (secret !== SECRET) return res.status(403).send({ error: "forbidden" });
    if (!subscriptionId) return res.status(400).send({ error: "subscriptionId required" });

    const { rlpBytes, coinbaseBytes, signedHex } = await buildAndSign(subscriptionId);
    res.send({
      rlpBase64: Buffer.from(rlpBytes).toString("base64"),
      coinbaseBase64: Buffer.from(coinbaseBytes).toString("base64"),
      signedHex,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message || String(err) });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Agent listening on ${port}`));
