import { DevLoggerService } from "./dev-logger.service";
import { ProdLoggerService } from "./prod-logger.service";
import type { Logger } from "../../models/logger.models";

export function loggerFactory(isDevMode: boolean): Logger {
  return isDevMode ? new DevLoggerService() : new ProdLoggerService();
}
