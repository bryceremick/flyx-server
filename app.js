require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const initFirebase = require("./api/services/firebaseConnection").initFirebaseAuth;
initFirebase();

// mongoose.connect(process.env.MONGODB, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

// const usersRouter = require("./api/routes/users");


// import routes
const indexRouter = require('./api/routes/index');
const notFoundRouter = require('./api/routes/notFound');
const autocompleteRouter = require('./api/routes/autocomplete');
const searchFlightsRouter = require('./api/routes/searchFlights');
const userRouter = require('./api/routes/user');

const app = express();

// Utility middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));

// app.use("/api/users", usersRouter);

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/autocomplete', autocompleteRouter);
app.use('/search', searchFlightsRouter);


app.use('*', notFoundRouter);

app.listen(process.env.PORT);

module.exports = app
