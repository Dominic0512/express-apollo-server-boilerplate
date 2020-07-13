import typeDef from './schema.gql'
import {
  SchemaDirectiveVisitor,
  AuthenticationError,
} from 'apollo-server-express'

import { defaultFieldResolver } from 'graphql'

class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (...args) => {
      const context = args[2]

      if (!context || !context.user) {
        throw new AuthenticationError('Not allowed')
      }

      return resolve.apply(this, args)
    }
  }
}

export default {
  typeDef,
  directive: IsAuthenticatedDirective,
}
