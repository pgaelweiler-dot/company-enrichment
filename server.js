require("dotenv").config();
const express = require("express");
const { enrichCompany } = require("./logic/enrichment");

const app = express();
app.use(express.json());

app.post("/enrich-company", async (req, res) => {
  try {
    const { companyId, name, domain } = req.body;

    console.log("Incoming:", companyId, name, domain);

    const result = await enrichCompany({ companyId, name, domain });

    res.json({ success: true, result });

  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
