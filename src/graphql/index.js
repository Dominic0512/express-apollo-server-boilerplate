import { makeExecutableSchema } from "graphql-tools";
import * as typeDefs from "./schema.gql";

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!"
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
