const skypicker = require("skypicker");
const utility_functions = require("../helpers/utility");

module.exports.oneWaySearch = async function(
  departureAirportCodes,
  arrivalAirportCodes,
  departureWindow,
  ticketLimit
) {
  try {
    const results = await skypicker.searchFlights({
      departureIdentifier: departureAirportCodes.toString(),
      arrivalIdentifier: arrivalAirportCodes.toString(),
      departureDateTimeRange: {
        days: {
          start: utility_functions.formatDate({
            date: departureWindow.start.date.toString(),
            month: departureWindow.start.month.toString(),
            year: departureWindow.start.year.toString()
          }),
          end: utility_functions.formatDate({
            date: departureWindow.end.date.toString(),
            month: departureWindow.end.month.toString(),
            year: departureWindow.end.year.toString()
          })
        }
      },
      partner: "picky",
      currencyCode: "USD",
      directFlightsOnly: false,
      limit: ticketLimit
    });
    return results;
  } catch (error) {
    console.log(error);
  }
};

module.exports.roundTripSearch = async function(
  departureAirportCodes,
  arrivalAirportCodes,
  departureWindow,
  returnDepartureWindow,
  ticketLimit
) {
  try {
    const results = await skypicker.searchFlights({
      departureIdentifier: departureAirportCodes.toString(),
      arrivalIdentifier: arrivalAirportCodes.toString(),
      departureDateTimeRange: {
        days: {
          start: utility_functions.formatDate({
            date: departureWindow.start.date.toString(),
            month: departureWindow.start.month.toString(),
            year: departureWindow.start.year.toString()
          }),
          end: utility_functions.formatDate({
            date: departureWindow.end.date.toString(),
            month: departureWindow.end.month.toString(),
            year: departureWindow.end.year.toString()
          })
        }
      },
      returnDepartureDateTimeRange: {
        days: {
          start: utility_functions.formatDate({
            date: returnDepartureWindow.start.date.toString(),
            month: returnDepartureWindow.start.month.toString(),
            year: returnDepartureWindow.start.year.toString()
          }),
          end: utility_functions.formatDate({
            date: returnDepartureWindow.end.date.toString(),
            month: returnDepartureWindow.end.month.toString(),
            year: returnDepartureWindow.end.year.toString()
          })
        }
      },
      partner: "picky",
      currencyCode: "USD",
      directFlightsOnly: false,
      // maximumStopOverCount: 1,
      limit: ticketLimit
    });
    return results;
  } catch (error) {
    console.log(error);
  }
};

module.exports.radiusSearch = async function(
  TICKET_LIMIT,
  oneWay,
  from,
  to,
  radiusFrom,
  radiusTo,
  departureWindow,
  returnDepartureWindow
) {
  return await new Promise((resolve, reject) => {
    elasticsearch.getAirportGeohash(from).then(fromGeohash =>
      elasticsearch.getAirportGeohash(to).then(toGeohash =>
        elasticsearch
          .getAirportsInRadius(radiusFrom, fromGeohash)
          .then(departureAirports =>
            elasticsearch
              .getAirportsInRadius(radiusTo, toGeohash)
              .then(arrivalAirports => {
                let departureAirportCodes = utility_functions.onlyAirportCodes(
                  departureAirports
                );
                let arrivalAirportCodes = utility_functions.onlyAirportCodes(
                  arrivalAirports
                );

                // console.log(departureAirportCodes);
                // console.log(arrivalAirportCodes);

                if (oneWay == true) {
                  module.exports
                    .oneWaySearch(
                      departureAirportCodes,
                      arrivalAirportCodes,
                      departureWindow,
                      TICKET_LIMIT
                    )
                    .then(results => {
                      resolve(results);
                    });
                } else {
                  module.exports
                    .roundTripSearch(
                      departureAirportCodes,
                      arrivalAirportCodes,
                      departureWindow,
                      returnDepartureWindow,
                      TICKET_LIMIT
                    )
                    .then(results => {
                      resolve(results);
                    });
                }
              })
          )
      )
    );
  });
};
