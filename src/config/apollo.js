import { ApolloServer } from 'apollo-server-express'
import User from '@/models/User'
import schema from '@/graphql'
import loggerUtil from '@/utils/logger'

const TOKEN_HEADER_NAME = 'x-token'

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    if (!req) return null

    const token = req.get(TOKEN_HEADER_NAME)

    if (!token) {
      return null
    }

    try {
      const { id } = await User.decodeJWT(token)

      return {
        user: await User.findOne({ _id: id }),
      }
    } catch (error) {
      loggerUtil.error('HEADER TOKEN ERROR: ', error)
      return null
    }
  },
})

export default apolloServer
