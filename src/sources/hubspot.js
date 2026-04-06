const axios = require("axios");

async function updateCompany(companyId, properties) {
  await axios.patch(
    `https://api.hubapi.com/crm/v3/objects/companies/${companyId}`,
    { properties },
    {
      headers: {
        Authorization: `Bearer ${process.env.Private_App_Token}`
      }
    }
  );
}

module.exports = { updateCompany };
