/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject } from 'inversify'
import { provide } from 'inversify-binding-decorators'
import { configure, Logger } from 'log4js'

import { IConfig } from '@config/vars'

import { TYPES } from '@config/ioc/types'
import { ILogger } from '.'

export interface ILogLine {
  time: string
  level: string
  message: string
}

@provide(TYPES.ILogger)
export class Log4jsLogger implements ILogger {

  public defaultLogger: Logger
  
  private level: string
  
  private config: IConfig

  constructor(@inject(TYPES.IConfig) config: IConfig) {
    this.config = config
    this.level = this.config.getVars().logger.level
    const logConfig = configure({
      appenders: {
        console: { type: 'console' },
      },
      categories: {
        default: { appenders: ['console'], level: this.level },
        express: { appenders: ['console'], level: this.level },
      },
    })
    this.defaultLogger = logConfig.getLogger('default')
  }

  public log = (message: any, ...args: any[]) => {
    this.defaultLogger.trace(message, ...args)
  }

  public debug = (message: any, ...args: any[]) => {
    this.defaultLogger.debug(message, ...args)
  }

  public info = (message: any, ...args: any[]) => {
    this.defaultLogger.info(message, ...args)
  }

  public warn = (message: any, ...args: any[]) => {
    this.defaultLogger.warn(message, ...args)
  }

  public error = (message: any, ...args: any[]) => {
    this.defaultLogger.error(message, ...args)
  }

  public fatal = (message: any, ...args: any[]) => {
    this.defaultLogger.fatal(message, ...args)
  }
}
