import * as express from 'express'
import { inject } from 'inversify'
import {
  controller,
  httpPost,
  interfaces,
  next,
  request,
  response,
} from 'inversify-express-utils'

import { IResponse } from '@models/response.model'
import { ILogger } from '@services/loggerService'

import { TYPES } from '@config/ioc/types'
import { pruebaSchema } from './prueba.model'

@controller('/base-datos')
export class VentasController implements interfaces.Controller {
  private logger: ILogger

  constructor(
    @inject(TYPES.ILogger)
      logger: ILogger
  ) {
    this.logger = logger
  }

  @httpPost('/consulta')
  public async selectDB(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() nextFunc: express.NextFunction
  ) {
    const payload = req.body
    this.logger.debug('Payload', payload)
    const validationResult = pruebaSchema.validate(payload)

    if (validationResult.error) {
      this.logger.error(
        `POST /v1/base-datos/consulta - Formato de request invalido:`,
        validationResult.error
      )
      const resError: IResponse = { data: null, errors: ['invalid_request'] }
      res.status(422).json(resError)
      nextFunc()
      return
    }
    try {
      const results = { data: {}, error: '' }
      const httpResponse: IResponse = {
        data: results.data,
        errors: [results.error],
      }
      res.json(httpResponse)
      nextFunc()
    } catch (err) {
      this.logger.error(
        `Post /v1/ventas/consulta - Error: ${JSON.stringify(err)}`
      )
      const resError: IResponse = {
        data: null,
        errors: ['internal_server_error'],
      }
      res.status(500).json(resError)
      nextFunc()
    }
  }
}
