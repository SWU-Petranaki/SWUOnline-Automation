import {NightwatchAPI, NightwatchTests} from 'nightwatch';

import { p, player1Window, player2Window } from './utils/util';
import { init } from './utils/gamestart';
import { GameState } from './utils/gamestate';
import { BugReportFetch } from './utils/bug-report';
import { LocalRunGameStartAsync } from './utils/helper-func';

const home: NightwatchTests = {
  'BugReportRun': async (browser: NightwatchAPI) => {
    if(process.env.BUG_REPORT) {
      const localRunningGame = process.env.LOCAL_RUN || '';
      if(!process.env.PROD_URL || !process.env.MOD_USERNAME || !process.env.MOD_PASSWORD || localRunningGame === '') {
        throw new Error('environment variables not set for Bug Report local run');
      }
      if(!Number.isInteger(Number.parseInt(localRunningGame)) || !GameState.GameExists(localRunningGame)) {
        throw new Error('localRunningGame not set to a valid game');
      }
      await BugReportFetch.LogInProdAsync(browser);
      await BugReportFetch.LoadBugReportData(browser, localRunningGame);
      await browser.url("http://localhost:8080/SWUOnline/MainMenu.php").pause(p.WaitToBegin);
      await LocalRunGameStartAsync(browser, localRunningGame);
      await browser.pause(p.Indefinite);
    }
  },
  after: async (browser, done) => {
    await browser.window.switchTo(player2Window).window.close();
    await browser.window.switchTo(player1Window).window.close();

    done();
  }
};

export default home;