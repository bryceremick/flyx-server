const apiRes = require("../helpers/apiResponse");
const tickets = require("../jobs/priceTickerJob").getPriceTickerTickets;

console.log(tickets.ticketsLAXToJFK);

module.exports.priceticker = async (req, res) => {
  if (req.query["airportFrom"] == "LAX") {
    apiRes.successWithData(res, "Success", tickets.ticketsLAXToJFK);
  } else if (req.query["airportFrom"] == "LGA") {
    apiRes.successWithData(res, "Success", tickets.ticketsLGAToORD);
  } else if (req.query["airportFrom"] == "SFO") {
    apiRes.successWithData(res, "Success", tickets.ticketsSFOToLAX);
  } else {
    apiRes.validationError(res, "Invalid Parameters");
  }
};
