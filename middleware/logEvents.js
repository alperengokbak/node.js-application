import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const getCurrentDirname = () => {
  const __filename = fileURLToPath(import.meta.url);
  return dirname(__filename);
};

const __dirname = getCurrentDirname();
const fsPromises = fs.promises;

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(join(__dirname, "..", "logs", logName), logItem);
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};

export { logger, logEvents };
