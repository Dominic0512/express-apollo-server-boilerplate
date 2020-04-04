import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import errorhandler from "errorhandler";
import mongoose from "mongoose";
import methodOverride from "method-override";

import rootRouter from "./routes";
import logMiddleware from "./middlewares/logMiddleware";
import loggerUtil from "./utils/logger";

const isProduction = process.env.NODE_ENV === "production";

const app = express();

app.use(cors());

app.use(logMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "i-appter-local",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  app.use(errorhandler());
}

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect("mongodb://localhost/i-appter-local");
  mongoose.set("debug", true);
}

app.use(rootRouter);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

if (!isProduction) {
  app.use((err, req, res, next) => {
    loggerUtil.error(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

const server = app.listen(process.env.PORT || 8080, function() {
  console.log("Listening on port " + server.address().port);
});
