const me = async (_, args, {}) => "Hello world!";

const login = async (_, args, {}) => ({
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
