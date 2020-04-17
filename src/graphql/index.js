import { makeExecutableSchema } from "apollo-server-express";
import deepmerge from "deepmerge";

import directives from "./directives";
import scalars from "./scalars";
import * as globalTypeDefs from "./schema.gql";

import user from "./modules/user";

const makeExecutableSchemaFromModules = ({ modules }) => {
  let typeDefs = [globalTypeDefs, ...scalars.typeDefs, ...directives.typeDefs];

  let resolvers = {
    ...scalars.resolvers,
  };

  modules.forEach((moduleItem) => {
    typeDefs = [...typeDefs, ...moduleItem.typeDefs];

    resolvers = deepmerge(resolvers, moduleItem.resolvers);
  });

  return makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives: {
      ...directives.schemaDirectives,
    },
  });
};

export default makeExecutableSchemaFromModules({
  modules: [user],
});
