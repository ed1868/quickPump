require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const ensureLogin    = require('connect-ensure-login');


const session    = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash      = require('connect-flash');

mongoose 
  .connect('mongodb://localhost/quickPumpServer', { useNewUrlParser: true })
  .then((x) => {
    let dbName = "QUICK PUMP";
    console.log(`Connected to Mongo! Database name: "${dbName}"  ; BACKEND SERVER HAS STARTED`);

    

  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// default value for title local
app.locals.title = "Quick Pump Under Construction ";

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


//HBS HELPERS
hbs.registerHelper('ifUndefined', (value, options) => {
  if (arguments.length < 2) { throw new Error('Handlebars Helper ifUndefined needs 1 parameter'); }
  if (typeof value !== undefined) {
    return options.inverse(this);
  }
  return options.fn(this);
});

hbs.registerHelper('tern', (value, options) => {
  return !value ? '' : 'checked'; 
});

hbs.registerHelper('ifitsMe', (value, value1, options) => {
  return value == value1 ? new hbs.SafeString(`<a href="/place/delete/opinionDelete/{{this._id}}/{{this.idPlace}}"><button type="button" id="deleteOpinion">Delete</button></a>`) : '';
});


app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(flash());
require('./passport')(app);

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


//ROUTES SET UP 
const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/auth", auth);

const workouts = require("./routes/workouts");

app.use("/workouts", workouts);

const schedule = require("./routes/schedule");

app.use("schedule", schedule);

const cart = require("./routes/cart");

app.use('cart', cart);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
