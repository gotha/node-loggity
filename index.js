const logLevels = ['ERROR', 'WARN', 'WARNING', 'INFO', 'DEBUG'];

module.exports = (serviceName, logLevel = 'INFO', {
  logPrinter,
  callerOffset,
  stringifyOutput,
} = {
  logPrinter: console.log,
  stringifyOutput: true,
  callerOffset: 4,
}) => {

  if (logLevels.indexOf(logLevel) < 0) {
    throw new Error(`Invalid log level ${logLevel}, allowed values are ${logLevels.join(',')}`);
  }
  const getCaller = () => {
    const err = new Error();
    const stack = err.stack.split('\n');
    if (stack.length < callerOffset + 1) {
      return;
    }
    const callerRegex = /.*\((?<caller>.*)\)/u;
    const res = stack[4].trim().match(callerRegex);
    if(res.length >= 2) {
      return res[1];
    }
  };

  const log = (msg, level) => {
    let data = {
      level,
      serviceName,
      time: new Date(),
      caller: getCaller(),
    };

    if (typeof msg === 'string') {
      data.msg = msg;
    }
    if (typeof msg === 'object') {
      data = {...data, ...msg};
    }


    let logLine = data;
    if (stringifyOutput) {
      logLine = JSON.stringify(data);
    }
    logPrinter(logLine);
  };

  const debug = msg => {
    if (['DEBUG'].indexOf(logLevel) >= 0) {
      log(msg, 'debug');
    }
  };

  const info = msg => {
    if (['DEBUG', 'INFO'].indexOf(logLevel) >= 0) {
      log(msg, 'info');
    }
  };

  const warning = msg => {
    if (['DEBUG', 'INFO', 'WARN', 'WARNING'].indexOf(logLevel) >= 0) {
      log(msg, 'warning');
    }
  };

  const error = msg => {
    if (['DEBUG', 'INFO', 'WARN', 'WARNING', 'ERROR'].indexOf(logLevel) >= 0) {
      log(msg, 'error');
    }
  };


  const logger = {
    debug,
    info,
    warning,
    warn: warning,
    error,
  };

  return logger;

};
