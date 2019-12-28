// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, "Secret");
//     req.userData = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({
//       message: "Auth failed"
//     });
//   }
// };

const AUTH = require('../services/firebaseConnection').getFirebaseAuth;
const apiRes = require("../helpers/apiResponse");

module.exports = async (req, res, next) => {
  try {
    // console.log(req.headers)
    const ID_TOKEN = req.header('authorization');
    // console.log(ID_TOKEN);
    await AUTH()
      .verifyIdToken(ID_TOKEN)
      .then(decodedToken => {
        res.locals.uid = decodedToken.uid;
        res.locals.email = decodedToken.email;
        // return next();
        next();
      });
      // .catch(error => {
      //   return res.send({ error: error.code });
      // });
  } catch (e) {
    // return res.status(422).send({ error: true, code: -1, message: 'Invalid AUTH Parameters' });
    return apiRes.validationError(res, "Invalid Credentials/Auth Error")
  }
}