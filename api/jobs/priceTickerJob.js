var moment = require('moment-timezone');
var CronJob = require('cron').CronJob;
const API = require("../services/skypickerAPI");

const SEARCH_DATE = moment().add(5, 'days');

const ONE_WAY = true;
const TICKET_LIMIT = 10;

const departureWindow= {
    start: {
        date: SEARCH_DATE.date(),
        month: SEARCH_DATE.month(),
        year: SEARCH_DATE.year()
    },
    end:{
        date: SEARCH_DATE.date(),
        month: SEARCH_DATE.month(),
        year: SEARCH_DATE.year()
    }
};

var ticketsLAXtoJFK;
var ticketsLGAtoORD;
var ticketsSFOtoLAX;

module.exports.getPriceTickerTickets = () => {
    return {
        ticketsLAXtoJFK: ticketsLAXtoJFK,
        ticketsLGAtoORD: ticketsLGAtoORD,
        ticketsSFOtoLAX: ticketsSFOtoLAX
    }
}

module.exports.initPriceTickerJob = () => {
    new CronJob('0 0 */1 * * *', async () => { 
        ticketsLAXtoJFK = await API.radiusSearch(
            TICKET_LIMIT,
            ONE_WAY,
            'LAX',
            'JFK',
            100,
            100,
            departureWindow,
            null
          );
    
          ticketsLGAtoORD = await API.radiusSearch(
            TICKET_LIMIT,
            ONE_WAY,
            'LGA',
            'ORD',
            100,
            100,
            departureWindow,
            null
          );
    
          ticketsSFOtoLAX = await API.radiusSearch(
            TICKET_LIMIT,
            ONE_WAY,
            'SFO',
            'LAX',
            100,
            100,
            departureWindow,
            null
          );
          console.log(ticketsLAXToJFK);
          console.log("Started price ticker job");
    }, null, true, 'America/Los_Angeles', null,true);
}