import { ApolloServer } from "apollo-server-express";
import schema from "../graphql/index";

const apolloServer = new ApolloServer({
  schema,
  playground: true,
  introspection: true
});

export default apolloServer;
