import { ApolloServer } from "apollo-server-express";
import schema from "../graphql/index";

const apolloServer = new ApolloServer({
  schema
});

export default apolloServer;
