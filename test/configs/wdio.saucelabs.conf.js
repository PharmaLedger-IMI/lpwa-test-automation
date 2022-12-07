const {config} = require('./wdio.shared.conf');

// =====================
// Sauce specific config
// =====================
// See https://webdriver.io/docs/sauce-service.html for more information
config.user = process.env.SAUCE_USERNAME;
config.key = process.env.SAUCE_ACCESS_KEY;
config.region = process.env.REGION || 'eu';

const _build = `LPWA-E2E-${new Date().toISOString()}`
const _name = 'LPWA-E2E'

// Android capabilities
config.capabilities = ['7','10','11','12'].map((androidVersion) => (
  {
    platformName: 'Android',
    'appium:browserName': 'Chrome',
    'appium:deviceName': 'Samsung.*',
    'appium:automationName': 'UiAutomator2',
    'appium:platformVersion': androidVersion,
    'appium:autoGrantPermissions': true,
    'sauce:options': {
      build: _build,
      name: _name,
    }
  })
);

// iOS capabilities
iOSCapabilities = ['15','16'].map((iOSVersion) => ({
    platformName: 'iOS',
    browserName: 'Safari',
    'appium:deviceName': 'iPhone.*',
    'appium:platformVersion': iOSVersion,
    'appium:automationName': 'XCUITest',
    'appium:autoAcceptAlerts': true,
    'sauce:options': {
      build: _build,
      name: _name,
    }
}))

//Add capability for 4.7" device
iOSCapabilities.push({
  platformName: 'iOS',
  browserName: 'Safari',
  'appium:deviceName': 'iPhone_SE_2022_15_real',
  'appium:platformVersion': '15.7',
  'appium:automationName': 'XCUITest',
  'appium:autoAcceptAlerts': true,
  'sauce:options': {
    build: _build,
    name: _name,
  }
})

config.capabilities.push(...iOSCapabilities);

config.services = config.services.concat('sauce');

exports.config = config;
