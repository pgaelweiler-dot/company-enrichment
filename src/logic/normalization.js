function norm(v) {
  return v ? v.toString() : "";
}

function normClass(v) {
  const allowed = ["GLOBAL", "REGIONAL", "LOCAL", "UNCLEAR"];
  const x = (v || "").toUpperCase();
  return allowed.includes(x) ? x : "UNCLEAR";
}

function normConfidence(v) {
  if (!v) return "Low";
  const x = v.toLowerCase();
  if (x.includes("high")) return "High";
  if (x.includes("medium")) return "Medium";
  return "Low";
}

module.exports = { norm, normClass, normConfidence };
