const chromedriver = require('chromedriver');

module.exports = {
  src_folders: ['test'],
  test_settings: {
    default: {
      disable_error_log: false,
      launch_url: 'http://localhost:8080/SWUOnline/',
      globals: {
        waitForConditionTimeout: 5_000,
        asyncHookTimeout: 120_000,
      },
      screenshots: {
        enabled: false,
        path: 'screens',
        on_failure: true
      },
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--mute-audio',
          ]
        }
      },
      webdriver: {
        start_process: true,
        server_path: '',
      },
    },
    headless: {
      extends: 'default',
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: [
            '--headless',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--window-size=1920,1080',
            '--mute-audio',
          ]
        }
      }
    },
  },
  usage_analytics: {
    enabled: true,
    log_path: './logs/analytics',
    client_id: 'ecefd613-7f58-46f4-83fe-5ee515815d2f'
  },
};