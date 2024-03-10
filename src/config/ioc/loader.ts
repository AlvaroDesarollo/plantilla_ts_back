import { buildProviderModule, container } from './inversify.config'

/* REST Controllers */
import '../../routes/v1/controllerPrueba/prueba.controller'

/* Services */
import '@services/loggerService/loggerLog4js'

container.load(buildProviderModule())
