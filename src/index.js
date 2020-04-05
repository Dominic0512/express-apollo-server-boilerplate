import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import errorhandler from "errorhandler";
import methodOverride from "method-override";
import dotenv from "dotenv";

import database from "./config/database";
import apolloServer from "./config/apollo";
import rootRouter from "./routes";
import logMiddleware from "./middlewares/logMiddleware";
import loggerUtil from "./utils/logger";

dotenv.config();

const { NODE_ENV, PORT } = process.env;

const isProduction = NODE_ENV === "production";

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

database.initialize();

app.use(rootRouter);
apolloServer.applyMiddleware({ app, path: "/graphql" });

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

const server = app.listen(PORT || 8080, function() {
  console.log("Listening on port " + server.address().port);
});
