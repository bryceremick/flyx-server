const AUTH = require('../services/firebaseConnection').getFirebaseAuth;
const apiRes = require("../helpers/apiResponse");

// authorization middleware that verifies a JWT using google AUTH
module.exports = async (req, res, next) => {
  try {
    const ID_TOKEN = req.header('authorization');
    await AUTH()
      .verifyIdToken(ID_TOKEN)
      .then(decodedToken => {
        req.body.uid = decodedToken.uid;
        req.body.email = decodedToken.email;
        return next();
      });
  } catch (e) {
    console.log(e);
    return apiRes.validationError(res, "Invalid Credentials/Auth Error")
  }
}