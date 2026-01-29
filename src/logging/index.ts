import { CompositeLogger } from "./CompositeLogger";
import { FileLogger } from "./FileLogger";
import { GoogleSheetLogger } from "./GoogleSheetLogger";

export const logger = new CompositeLogger([
  new FileLogger("logs.json"),
  new GoogleSheetLogger()
]);