// const User = require("../models/user");
const admin = require("firebase-admin");
const apiRes = require("../helpers/apiResponse");
const createUser = require("../models/user");
var db = admin.firestore();

exports.verify = (req, res) => {
  var uid = req.body.uid;
  var email = req.body.email;

  let usersRef = db.collection("users").doc(uid);

  // search for specified user in DB
  usersRef
    .get()
    .then(doc => {
      // if user does not exist, create user in DB
      if (!doc.exists) {
        let user = createUser(uid, email);
        usersRef.set(user);

        console.log("Created user in DB");
        const payload = {
          newUser: true,
          remainingSearches: user.remainingSearches,
          VIP: user.VIP,
          beta: user.beta
        };
        console.log(payload);
        return apiRes.successWithData(res, "New User", payload);
      } else {
        // if user does exist, respond with user
        console.log("User already exists");

        const payload = {
          newUser: false,
          remainingSearches: doc.data().remainingSearches,
          VIP: doc.data().VIP,
          beta: doc.data().beta
        };
        console.log(doc.data());
        console.log(payload);
        return apiRes.successWithData(res, "User already exists", payload);
      }
    })
    .catch(err => {
      console.log("Error getting document", err);
      return apiRes.error(res, "Something went wrong");
    });
};
