const logLevels = ['ERROR', 'WARN', 'WARNING', 'INFO', 'DEBUG'];

const getCaller = callerOffset => {
  const err = new Error();
  const stack = err.stack.split('\n');
  if (stack && stack.length < callerOffset + 1) {
    return;
  }
  const callerRegex = /.*\((?<caller>.*)\)/u;
  const res = stack[callerOffset].trim().match(callerRegex);
  if(res && res.length >= 2) {
    return res[1];
  }
};

const defaultOptions = {
  callerOffset: 4,
  stringifyOutput: true,
  logPrinter: console.log,
  currentTimeGenerator: () => new Date(),
  callerFuncIdentifier: getCaller
};

module.exports = (serviceName, logLevel = 'INFO', opts = {}) => {
  /* eslint no-param-reassign: ["off"]*/
  logLevel = (typeof logLevel === 'string') ? logLevel.toUpperCase() : '';
  if (logLevels.indexOf(logLevel) < 0) {
    const error = `Invalid log level '${logLevel}'`;
    throw new Error(error);
  }

  const {
    currentTimeGenerator,
    callerFuncIdentifier,
    stringifyOutput,
    logPrinter,
    callerOffset
  } = {...defaultOptions, ...opts};

  const log = (msg, level) => {
    let data = {
      level,
      serviceName,
      time: currentTimeGenerator(),
      caller: callerFuncIdentifier(callerOffset),
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

  const build = (state = {}) => {
    const logLine = {
      debug: msg => debug({...state, ...{msg}}),
      info: msg => info({...state, ...{msg}}),
      warning: msg => warning({...state, ...{msg}}),
      error: msg => error({...state, ...{msg}}),
    };

    const withField = (k, v) => {
      state[k] = v;
      return logLine;
    };

    const withError = err => {
      withField("error", err.toString())
      withField('stack', err.stack)
      return logLine
    }

    logLine.withField = withField;
    logLine.withError = withError;
    return logLine;
  };

  return {
    build,
    debug,
    info,
    warning,
    warn: warning,
    error,
  };
};
