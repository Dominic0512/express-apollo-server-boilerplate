import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import methodOverride from "method-override";
import dotenv from "dotenv";

import database from "./config/database";
import apolloServer from "./config/apollo";
import rootRouter from "./routes";

import loggerMiddleware from "./middleWares/logger";
import { notFoundError, serverError } from "./middleWares/errorHandle";
import sessionMiddleWare from "./middleWares/session";

dotenv.config();

const { PORT } = process.env;

const app = express();

database.initialize();

app.use(cors());

app.use(loggerMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + "/public"));
app.use(sessionMiddleWare);

app.use(rootRouter);
apolloServer.applyMiddleware({ app, path: "/graphql" });

app.use(notFoundError);
app.use(serverError);

const server = app.listen(PORT || 8080, function () {
  console.log("Listening on port " + server.address().port);
});
