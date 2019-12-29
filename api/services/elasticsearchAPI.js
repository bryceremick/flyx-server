const elasticsearch = require("elasticsearch");
const utility_functions = require("../helpers/utility");

// Establish connection to elasticsearch cluster on AWS
const ES_CLIENT = new elasticsearch.Client({
  host: process.env.ES_URI,
  log: "error"
});

/********************************************************************************
 * Function to retrieve airport geohashes from elasticsearch
 * Params: airportCode (string of an individule airport, example: 'LAX')
 * Return: geohash of specified airport (encoded form of latitude/longitude)
 *********************************************************************************/
module.exports.getAirportGeohash = async function(airportCode) {
  // create query to pass into elasticsearch
  let body = {
    size: 100,
    from: 0,
    query: {
      match: {
        IATA: {
          query: airportCode,
          fuzziness: 0
        }
      }
    }
  };

  try {
    // perform query into our 'airports' cluster
    const elasticResults = await ES_CLIENT.search({
      index: "airports",
      body: body
    })
      .then(results => {
        let geoHash = results.hits.hits[0]._source.Geohash;
        return geoHash;
      })
      .catch(err => {
        console.log(err);
      });

    // return results
    return elasticResults;
  } catch (error) {
    throw new Error(error);
  }
};

/********************************************************************************
 * Function to retrieve airports within X distance of a geohash
 * Params:  - radius (number)
 *          - geoHash (geohash string that represents a latitude/longitute coordinate)
 * Return: array of airports within X distance of specified geohash
 *********************************************************************************/
module.exports.getAirportsInRadius = async function(radius, geoHash) {
  // create query to pass into elasticsearch
  let body = {
    size: 100,
    query: {
      bool: {
        must: {
          match_all: {}
        },
        filter: {
          geo_distance: {
            distance: radius + "mi",
            Geohash: geoHash
          }
        }
      }
    }
  };

  try {
    const elasticResults = await ES_CLIENT.search({
      index: "airports",
      body: body
      //type: ''
    })
      .then(results => {
        return results.hits.hits;
      })
      .catch(err => {
        console.log(err);
      });

    // return array of airports within X radius of geohash
    return elasticResults;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.autocomplete = async function(q) {
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
    const elasticResults = await ES_CLIENT.search({
      index: "airports",
      body: body
      // type: 'characters_list'
    }).then(results => {
      var combinedResults = [];
      // Concat all arrays
      combinedResults = combinedResults.concat(
        results.suggest.Code[0].options,
        results.suggest.Name[0].options,
        results.suggest.City[0].options
      );

      // remove duplicates
      var uniqueResults = utility_functions.getUnique(combinedResults, "_id");
      return uniqueResults;
    });
    return elasticResults;
  } catch (error) {
    throw new Error(error);
  }
};
