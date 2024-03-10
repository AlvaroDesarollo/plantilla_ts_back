// eslint-disable-next-line
require('module-alias/register');

// tslint:disable-next-line: no-var-requires
import dotenv = require('dotenv')

// tslint:disable-next-line: no-var-requires
import 'reflect-metadata'

import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import * as bodyParser from 'body-parser'

import { TYPES } from '@config/ioc/types'
import { Log4jsLogger } from '@services/loggerService/loggerLog4js'
import { InversifyExpressServer } from 'inversify-express-utils'
import { container } from '@config/ioc/inversify.config'
import { ConfigService } from '@config/vars/configService'
import { IConfig } from '@config/vars'
import '@config/ioc/loader'



if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const config = new ConfigService()
const configErr = config.load()
if (configErr) throw new Error(configErr)

const httpPort = config.getVars().server.port
const httpRootPath = config.getVars().server.rootPath
const logger = new Log4jsLogger(config)

container.bind<IConfig>(TYPES.IConfig).toConstantValue(config)
const server = new InversifyExpressServer(container, null, {
  rootPath: httpRootPath,
})

logger.debug('Api iniciando...')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
server.setConfig((configServer: any) => {
  configServer.use(morgan(':method :url :status - :response-time ms'))
  configServer.use(bodyParser.json())
  configServer.use(helmet())
  configServer.use(cors())
})
const app = server.build()
app.listen(httpPort, () => {
  logger.debug(
    `Servidor iniciado:  http://localhost:${httpPort}${httpRootPath}`
  )
})
exports = app
