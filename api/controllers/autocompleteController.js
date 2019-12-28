const apiRes = require("../helpers/apiResponse");
const elasticsearch = require("../services/elasticConnection");

exports.autocomplete = async (req, res) => {
  let q = req.query["q"];

  let body = {
    suggest: {
      Code: {
        text: q,
        completion: {
          field: "IATA_Completion"
        }
      },
      Name: {
        text: q,
        completion: {
          field: "Name"
        }
      },
      City: {
        text: q,
        completion: {
          field: "City"
        }
      }
    }
  }; //body end

  try {
    const elasticResults = await elasticsearch.client
      .search({
        index: "airports",
        body: body
        // type: 'characters_list'
      })
      .then(results => {
        var combinedResults = [];
        // Concat all arrays
        combinedResults = combinedResults.concat(
          results.suggest.Code[0].options,
          results.suggest.Name[0].options,
          results.suggest.City[0].options
        );

        // remove duplicates
        var uniqueResults = getUnique(combinedResults, "_id");

        return uniqueResults;
      });

    return apiRes.successWithData(res, "Success", elasticResults);
  } catch (error) {
    return apiRes.error(res, "Something went wrong");
  }
};

getUnique = function(arr, comp) {
  const unique = arr
    .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e])
    .map(e => arr[e]);

  return unique;
};
