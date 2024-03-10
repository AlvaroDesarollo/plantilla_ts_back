/* eslint-disable @typescript-eslint/no-explicit-any */
import joi from 'joi'

import { IConfig } from '.'

export class ConfigService implements IConfig {
  private vars: any

  constructor() {
    this.vars = undefined
  }

  public getVars = (): any => this.vars

  public load = () => {
    const envVarsSchema = joi
      .object({
        LOGGER_LEVEL: joi
          .string()
          .valid('error', 'warn', 'info', 'verbose', 'debug', 'silly')
          .default('info'),
        NODE_ENV: joi
          .string()
          .valid('development', 'testing', 'production')
          .required(),
        PORT: joi.number().default(8080),
        ROOT_PATH: joi.string().required(),
      })
      .unknown()
      .required()

    const { error, value: envVars } = envVarsSchema.validate(process.env)
    if (error) {
      this.vars = undefined
      return `Config validation error: ${error.message}`
    }
    this.vars = {
      back: {},
      env: envVars.NODE_ENV,
      isDev: envVars.NODE_ENV === 'development',
      isProd: envVars.NODE_ENV === 'production',
      isTest: envVars.NODE_ENV === 'testing',
      logger: {
        level: envVars.LOGGER_LEVEL,
      },
      server: {
        port: Number(envVars.PORT),
        rootPath: envVars.ROOT_PATH,
      },
    }
    return null
  }
}
