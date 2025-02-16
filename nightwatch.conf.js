module.exports = {
  src_folders: ['test','nightwatch'],

  globals_path: 'globals.ts',

  webdriver: {},

  test_workers: {
    enabled: true
  },

  test_settings: {
    default: {
      disable_error_log: false,
      launch_url: 'http://localhost:8080/SWUOnline/',

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
          ]
        }
      },

      webdriver: {
        start_process: true,
        server_path: ''
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