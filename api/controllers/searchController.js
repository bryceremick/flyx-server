const API = require("../services/skypickerAPI");
const moment = require("moment-timezone");
const admin = require("firebase-admin");
const apiRes = require("../helpers/apiResponse");
var db = admin.firestore();

const TICKET_LIMIT = 100;

exports.searchFlights = async (req, res) => {
  const userInput = {
    uid: req.body.uid,
    oneWay: req.body.oneWay,
    from: req.body.from,
    to: req.body.to,
    radiusFrom: req.body.radiusFrom,
    radiusTo: req.body.radiusTo,
    departureWindow: {
      start: {
        date: moment(req.body.departureWindow.start).date(),
        month: moment(req.body.departureWindow.start).month(),
        year: moment(req.body.departureWindow.start).year()
      },
      end: {
        date: moment(req.body.departureWindow.end).date(),
        month: moment(req.body.departureWindow.end).month(),
        year: moment(req.body.departureWindow.end).year()
      }
    },
    returnDepartureWindow: {
      start: {
        date: moment(req.body.returnDepartureWindow.start).date(),
        month: moment(req.body.returnDepartureWindow.start).month(),
        year: moment(req.body.returnDepartureWindow.start).year()
      },
      end: {
        date: moment(req.body.returnDepartureWindow.end).date(),
        month: moment(req.body.returnDepartureWindow.end).month(),
        year: moment(req.body.returnDepartureWindow.end).year()
      }
    }
  };

  // create reference to user document in the firebase "users" collection
  let usersRef = db.collection("users").doc(userInput.uid);

  // find user in collection
  usersRef
    .get()
    .then(doc => {
      // if user does not exist, respond with error code
      if (!doc.exists) {
        return apiRes.error(res, "Something went wrong");
      } else {
        // else user exists, grab user data
        const USER = doc.data();
        // if user has any remaining searches or VIP, do search and respond with tickets
        if (USER.remainingSearches > 0 || USER.VIP) {
          API.radiusSearch(
            TICKET_LIMIT,
            userInput.oneWay,
            userInput.from,
            userInput.to,
            userInput.radiusFrom,
            userInput.radiusTo,
            userInput.departureWindow,
            userInput.returnDepartureWindow
          ).then(results => {
            if (USER.VIP) {
              // if VIP...
              // do NOT decrement user's remaining searches
              const payload = {
                remainingSearches: USER.remainingSearches,
                tickets: results
              };

              // send response with tickets & do not decrement remainingSearches
              return apiRes.successWithData(res, "Success", payload);
            } else {
              // if NOT VIP...

              // decrement user's remaining searches
              var decrementedSearches = USER.remainingSearches;
              decrementedSearches--;

              // Update user data in firestore
              usersRef.update({ remainingSearches: decrementedSearches });

              const payload = {
                remainingSearches: decrementedSearches,
                tickets: results
              };

              // send response with tickets and decremented searches
              return apiRes.successWithData(res, "Success", payload);
            }
          });
        } else {
          // else user does not have any remaining searches and is not VIP, do not do search
          return apiRes.unauthorizedAccess(res, "No remaining searches");
        }
      }
    })
    // any firebase error, respond with error code
    .catch(err => {
      return apiRes.error(res, "Something went wrong");
    });
};
