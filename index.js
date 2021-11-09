module.exports = (serviceName, logLevel = 'INFO', opts = {}) => {

  const logLevels = ['ERROR', 'WARN', 'WARNING', 'INFO', 'DEBUG'];
  if (logLevels.indexOf(logLevel) < 0) {
    throw new Error(`Invalid log level ${logLevel}, allowed values are ${logLevels.join(',')}`);
  }

  if (typeof opts.callerOffset === 'undefined') {
    opts.callerOffset = 4;
  }

  if (typeof opts.stringify === 'undefined') {
    opts.stringify = true;
  }

  if (typeof opts.logPrinter == 'undefined') {
    opts.logPrinter = console.log;
  }

  const getCaller = () => {
    const err = new Error();
    const stack = err.stack.split('\n');
    if (stack.length < opts.callerOffset + 1) {
      return;
    }
    const callerRegex = /.*\((?<caller>.*)\)/u;
    const res = stack[4].trim().match(callerRegex);
    if(res.length >= 2) {
      return res[1];
    }
  };

  const log = msg => {
    let data = {};
    if (typeof msg === 'string') {
      data.msg = msg;
    }

    if (typeof msg === 'object') {
      data = {...msg};
    }
    data.serviceName = serviceName;
    data.caller = getCaller();
    data.time = new Date();
    if (opts.stringify) {
      return opts.logPrinter(JSON.stringify(data));
    }
    opts.logPrinter(data);
  };

  const debug = msg => {
    if (['ERROR', 'WARN', 'WARNING', 'INFO', 'DEBUG'].indexOf(logLevel) >= 0) {
      log(msg);
    }
  };

  const info = msg => {
    if (['ERROR', 'WARN', 'INFO'].indexOf(logLevel) >= 0) {
      log(msg);
    }
  };

  const warning = msg => {
    if (['ERROR', 'WARN', 'WARNING'].indexOf(logLevel) >= 0) {
      log(msg);
    }
  };

  const error = msg => {
    if (['ERROR'].indexOf(logLevel) >= 0) {
      log(msg);
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
