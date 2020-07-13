import loggerUtil from '@/utils/logger'

const { NODE_ENV } = process.env

const notFoundError = (req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
}

const serverError = (err, req, res, next) => {
  if (NODE_ENV !== 'production') {
    loggerUtil.error(err.stack)
  }
  res.status(err.status || 500)

  res.json({
    errors: {
      message: err.message,
      error: err,
    },
  })
}

export { notFoundError, serverError }
