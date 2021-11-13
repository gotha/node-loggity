/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const sinon = require('sinon');
const logger = require('./../index.js');

describe('Logger', () => {

  describe('constructor', () => {
    it('should throw error if the loglevel is unknown', () => {
      expect(() => {
        logger('service', 'UNKNOWN');
      }).to.throw('Invalid log level \'UNKNOWN\'');
    });

    it('should accept lowercase logLevel', () => {
      const log = logger('service', 'info');
      expect(log).to.be.a('object');
    });
  });

  describe('debug', () => {
    it('should print log message when loglevel is set to DEBUG', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'DEBUG', { logPrinter});

      log.debug('test');
      expect(logPrinter.calledOnce).to.be.true;
    });

    it('should not print log message when loglevel is not DEBUG', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'INFO', { logPrinter });

      log.debug('test');
      expect(logPrinter.calledOnce).to.be.false;
    });
  });

  describe('info', () => {
    it('should print log log when loglevel is set to INFO', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'INFO', { logPrinter});

      log.info('test');
      expect(logPrinter.calledOnce).to.be.true;
    });

    it('should print log message when loglevel is set to DEBUG', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'DEBUG', { logPrinter});

      log.info('test');
      expect(logPrinter.calledOnce).to.be.true;
    });

    it('should not print log message when loglevel is set to WARN', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'WARN', { logPrinter });

      log.info('test');
      expect(logPrinter.calledOnce).to.be.false;
    });
  });


  describe('warning', () => {
    it('should print log message when loglevel is set to WARN', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'WARN', { logPrinter});

      log.warning('test');
      expect(logPrinter.calledOnce).to.be.true;
    });

    it('should print log message when loglevel is set to DEBUG', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'DEBUG', { logPrinter});

      log.warning('test');
      expect(logPrinter.calledOnce).to.be.true;
    });

    it('should print log message when loglevel is set to INFO', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'INFO', { logPrinter});

      log.warning('test');
      expect(logPrinter.calledOnce).to.be.true;
    });

    it('should not print log message when loglevel is set to ERROR', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'ERROR', { logPrinter });

      log.warning('test');
      expect(logPrinter.calledOnce).to.be.false;
    });
  });

  describe('error', () => {
    it('should print log message when loglevel is set to DEBUG', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'DEBUG', { logPrinter});

      log.error('test');
      expect(logPrinter.calledOnce).to.be.true;
    });

    it('should print log message when loglevel is set to INFO', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'INFO', { logPrinter});

      log.error('test');
      expect(logPrinter.calledOnce).to.be.true;
    });

    it('should print log message when loglevel is set to WARN', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'WARN', { logPrinter});

      log.error('test');
      expect(logPrinter.calledOnce).to.be.true;
    });

    it('should print log message when loglevel is set to ERROR', () => {
      const logPrinter = sinon.spy();
      const log = logger('testService', 'ERROR', { logPrinter});

      log.error('test');
      expect(logPrinter.calledOnce).to.be.true;
    });
  });

  describe('generate log output', () => {
    it('should contain msg field if parameter is string', () => {
      let loggerCalled = false;
      const currentDate = new Date();
      const log = logger('testService', 'DEBUG', {
        currentTimeGenerator: () => currentDate,
        callerFuncIdentifier: () => 'testFile.js:31',
        logPrinter: data => {
          loggerCalled = true;
          expect(data).to.be.equal(JSON.stringify({
            level: 'info',
            serviceName: 'testService',
            time: currentDate,
            caller: 'testFile.js:31',
            msg: 'test',
          }));
        },
      });

      log.info('test');
      expect(loggerCalled).to.be.true;
    });

    it('should convert object to log properties when parameter is object', () => {
      let loggerCalled = false;
      const currentDate = new Date();
      const log = logger('testService', 'DEBUG', {
        currentTimeGenerator: () => currentDate,
        callerFuncIdentifier: () => 'testFile.js:31',
        logPrinter: data => {
          loggerCalled = true;
          expect(data).to.be.equal(JSON.stringify({
            level: 'info',
            serviceName: 'testService',
            time: currentDate,
            caller: 'testFile.js:31',
            myProperty: true,
            somethingElse: 'example',
          }));
        },
      });

      log.info({
        myProperty: true,
        somethingElse: 'example',
      });
      expect(loggerCalled).to.be.true;
    });
  });

  describe('build', () => {
    it('should allow chaining multiple fields', () => {
      let loggerCalled = false;
      const currentDate = new Date();
      const log = logger('testService', 'DEBUG', {
        currentTimeGenerator: () => currentDate,
        callerFuncIdentifier: () => 'testFile.js:31',
        logPrinter: data => {
          loggerCalled = true;
          expect(data).to.be.equal(JSON.stringify({
            level: 'debug',
            serviceName: 'testService',
            time: currentDate,
            caller: 'testFile.js:31',
            myProp1: 'value1',
            myProp2: 'value2',
            msg: 'test1'
          }));
        },
      });

      log.build()
        .withField('myProp1', 'value1')
        .withField('myProp2', 'value2')
        .debug('test1');

      expect(loggerCalled).to.be.true;
    });

    it('should nest parameter object under msg value', () => {
      let loggerCalled = false;
      const currentDate = new Date();
      const log = logger('testService', 'DEBUG', {
        currentTimeGenerator: () => currentDate,
        callerFuncIdentifier: () => 'testFile.js:31',
        logPrinter: data => {
          loggerCalled = true;
          expect(data).to.be.equal(JSON.stringify({
            level: 'info',
            serviceName: 'testService',
            time: currentDate,
            caller: 'testFile.js:31',
            myProp1: 'value1',
            myProp2: 'value2',
            msg: {
              key: 'value',
            }
          }));
        },
      });

      log.build()
        .withField('myProp1', 'value1')
        .withField('myProp2', 'value2')
        .info({'key': 'value'});

      expect(loggerCalled).to.be.true;
    });
  });
});
