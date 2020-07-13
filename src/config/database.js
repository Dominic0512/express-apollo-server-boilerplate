import mongoose from 'mongoose'
import Models from '@/models'

const initialize = () => {
  const { NODE_ENV, MONGODB_URI, MONGODB_NAME } = process.env
  const isProduction = NODE_ENV === 'production'

  mongoose.connect(`${MONGODB_URI}/${MONGODB_NAME}`)

  if (!isProduction) {
    mongoose.set('debug', true)
  }
}

export default {
  initialize,
}
