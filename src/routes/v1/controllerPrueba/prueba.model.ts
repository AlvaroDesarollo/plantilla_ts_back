import joi from 'joi'

export const pruebaSchema = joi
  .object()
  .keys({
    connectionData: joi
      .object()
      .keys({
        database: joi
          .string()
          .optional()
          .allow(''),
        host: joi
          .string()
          .optional()
          .allow(''),
        password: joi
          .string()
          .optional()
          .allow(''),
        type: joi
          .string()
          .optional()
          .allow(''),
        user: joi
          .string()
          .optional()
          .allow(''),
      })
      .optional(),
    query: joi.string().required(),
  })
  .required()
