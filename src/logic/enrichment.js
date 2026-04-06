const { fetchWebsite } = require("../services/scraper");
const { callOpenAI } = require("../services/openai");
const { updateCompany } = require("../services/hubspot");
const { norm, normClass, normConfidence } = require("./normalization");

function isMismatch(name, domain) {
  if (!name || !domain) return false;
  const n = name.toLowerCase().replace(/[^a-z]/g, "");
  return !domain.toLowerCase().includes(n);
}

function extractJSON(text) {
  const cleaned = text.replace(/```/g, "");
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  return JSON.parse(cleaned.substring(start, end + 1));
}

async function enrichCompany({ companyId, name, domain }) {
  const mismatch = isMismatch(name, domain);

  const websiteContent = domain
    ? await fetchWebsite(domain)
    : "";

  const prompt = `
You are a corporate intelligence analyst.

Priority:
1. Domain content
2. Official sources
3. General inference

If uncertain → return UNCLEAR.

INPUT:
Name: ${name}
Domain: ${domain}

DATA:
${websiteContent}

Return JSON array:
Record ID
Canonical Company Group Name
Classification
Group HQ Country
Confidence Level
`;

  const response = await callOpenAI(prompt);
  const parsed = extractJSON(response)[0] || {};

  const result = {
    canonical: norm(parsed["Canonical Company Group Name"]),
    classification: normClass(parsed["Classification"]),
    confidence: normConfidence(parsed["Confidence Level"]),
    country: norm(parsed["Group HQ Country"])
  };

  await updateCompany(companyId, {
    n4f_canonical_name: result.canonical,
    n4f_classification: result.classification,
    n4f_confidence: result.confidence,
    n4f_hq_country: result.country
  });

  return result;
}

module.exports = { enrichCompany };
