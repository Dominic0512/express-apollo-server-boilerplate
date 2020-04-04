import { makeExecutableSchema } from "apollo-server-express";
import deepmerge from "deepmerge";

import directives from "./directives";
import scalars from "./scalars";
import * as globalTypeDefs from "./schema.gql";

import user from "./modules/user";

const makeExecutableSchemaFromModules = ({ modules }) => {
  let typeDefs = [globalTypeDefs, ...scalars.typeDefs, ...directives.typeDefs];

  let resolvers = {
    ...scalars.resolvers
  };

  modules.forEach(module => {
    typeDefs = [...typeDefs, ...module.typeDefs];

    resolvers = deepmerge(resolvers, module.resolvers);
  });

  return makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives: {
      ...directives.schemaDirectives
    }
  });
};

export default makeExecutableSchemaFromModules({
  modules: [user]
});
