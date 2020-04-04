const me = (_, args, {}) => "Hello world!";

const login = (_, args, {}) => ({
  name: "hello, it's me!"
});

const resolvers = {
  Query: {
    me
  },
  Mutation: {
    login
  }
};

export default resolvers;
