// const User = require("../models/user");
const admin = require("firebase-admin");
const apiRes = require("../helpers/apiResponse");
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
        usersRef.set({
          uid: uid,
          email: email,
          accessTier: 0,
          remainingSearches: 25,
          totalSearches: 0,
          VIP: false,
          beta: true,
          });    

          console.log('Created user in DB');
          const payload = {
            newUser: true,
            remainingSearches: 25,
            VIP: false,
            beta: true,
          }
          console.log(payload);
          return apiRes.successWithData(res, "New User", payload);

      }else{
        // if user does exist, respond with user
        console.log('User already exists');

        const payload = {
          newUser: false,
          remainingSearches: doc.data().remainingSearches,
          VIP: doc.data().VIP,
          beta: doc.data().beta,
        }
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


