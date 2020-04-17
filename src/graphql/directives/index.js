import auth from "./auth";

export default {
  typeDefs: [auth.typeDef],
  schemaDirectives: {
    isAuthenticated: auth.directive,
  },
};
