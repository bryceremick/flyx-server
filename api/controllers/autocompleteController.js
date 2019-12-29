const apiRes = require("../helpers/apiResponse");
const elasticsearch = require("../services/elasticsearchAPI");

exports.autocomplete = async (req, res) => {
  let q = req.query["q"];

  try {
    const results = await elasticsearch.autocomplete(q);
    return apiRes.successWithData(res, "success", results);
  } catch (error) {
    return apiRes.error(res, "Something went wrong");
  }
};
