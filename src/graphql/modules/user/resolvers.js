import { AuthenticationError } from 'apollo-server-express'
import User from '@/models/User'

const _validateAccountInfo = (email, password) => {
  if (!email) {
    throw new AuthenticationError('Email can not be blank.')
  }

  if (!password) {
    throw new AuthenticationError('Password can not be blank.')
  }
}

const me = (_, {}, context) => {
  return context.user
}

const login = async (_, { email, password }) => {
  try {
    _validateAccountInfo(email, password)

    const user = await User.findOne({
      email,
    })

    if (!user) throw new AuthenticationError('User is not existed')

    if (user.validPassword(password)) {
      throw new AuthenticationError('Incorrect password')
    }

    return {
      user: user.login(),
    }
  } catch (error) {
    throw error
  }
}

const signup = async (_, { email, password }) => {
  try {
    _validateAccountInfo(email, password)

    const isExisted = await User.findOne({ email })

    if (!!isExisted) throw new AuthenticationError('Email is existed')

    let newUser = new User()

    newUser.email = email
    newUser.setPassword(password)

    const createdUser = await newUser.save()

    return {
      user: createdUser.profile(),
    }
  } catch (error) {
    throw error
  }
}

const resolvers = {
  Query: {
    me,
  },
  Mutation: {
    signup,
    login,
  },
}

export default resolvers
