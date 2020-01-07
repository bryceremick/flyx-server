const apiRes = require("../helpers/apiResponse");
const livePrices = require("../jobs/priceTickerJob");

// console.log(tickets.ticketsLAXToJFK);

module.exports.priceticker = async (req, res) => {
  if (req.query["airportFrom"] == "LAX") {
    apiRes.successWithData(res, "Success", livePrices.ticketsLAXtoJFK);
  } else if (req.query["airportFrom"] == "LGA") {
    apiRes.successWithData(res, "Success", livePrices.ticketsLGAtoORD);
  } else if (req.query["airportFrom"] == "SFO") {
    apiRes.successWithData(res, "Success", livePrices.ticketsSFOtoLAX);
  } else {
    apiRes.validationError(res, "Invalid Parameters");
  }
};
