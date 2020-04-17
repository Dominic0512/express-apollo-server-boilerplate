import User from "@/models/User";

const me = (_, {}) => "Hello world!";

const login = (_, { email, password }) => ({
  name: "hello, it's me!",
});

const signup = async (_, { email, password }) => {
  try {
    let newUser = new User();

    newUser.email = email;
    newUser.setPassword(password);
    newUser.save();

    return {
      name: "hello, signup success",
    };
  } catch (error) {
    throw error;
  }
};

const resolvers = {
  Query: {
    me,
  },
  Mutation: {
    signup,
    login,
  },
};

export default resolvers;
