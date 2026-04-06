const axios = require("axios");

async function callOpenAI(prompt) {
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      timeout: 15000
    }
  );

  return res.data.choices[0].message.content;
}

module.exports = { callOpenAI };
