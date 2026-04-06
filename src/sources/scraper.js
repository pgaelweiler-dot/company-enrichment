const axios = require("axios");

async function fetchWebsite(domain) {
  const paths = ["", "/about", "/contact"];
  let combined = "";

  await Promise.all(
    paths.map(async (path) => {
      try {
        const res = await axios.get(`https://${domain}${path}`, {
          timeout: 4000,
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        const cleaned = res.data
          .replace(/<script[^>]*>.*?<\/script>/gis, "")
          .replace(/<style[^>]*>.*?<\/style>/gis, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        combined += `PAGE ${path}:\n${cleaned.substring(0, 400)}\n\n`;
      } catch {}
    })
  );

  return combined.substring(0, 2000);
}

module.exports = { fetchWebsite };
