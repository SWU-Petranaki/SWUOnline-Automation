import fsp from 'fs/promises';
import { NightwatchAPI } from "nightwatch";

import { com, gameName, p } from "./util";

export class BugReportFetch {
  private _browser: NightwatchAPI;

  constructor(browser: NightwatchAPI) {
    this._browser = browser;
  }

  static LogInProdAsync(browser: NightwatchAPI) {
    if(!process.env.MOD_USERNAME || !process.env.MOD_PASSWORD || !process.env.PROD_URL || !process.env.BUG_REPORT) {
      throw new Error('environment variables not set for Bug Report local run');
    }
    return browser
      .url(process.env.PROD_URL + '/MainMenu.php')
      .waitForElementVisible(com.LoginButton, 1000)
      .click(com.LoginButton)
      .waitForElementPresent('input.username', 1000)
      .setValue('input.username', process.env.MOD_USERNAME)
      .setValue('input.password', process.env.MOD_PASSWORD)
      .click('button[type=submit]').pause(p.WaitToBegin)
    ;
  }

  static async LoadBugReportData(browser: NightwatchAPI, localRunningGame: string) {
    const text = await browser
      .url(process.env.PROD_URL + '/zzBeginTurnBugAPI.php?bugReport=' + process.env.BUG_REPORT)
      .getText(com.BugReportData)
    ;
    const data = text.split('\n').join('\r\n');
    await fsp.writeFile(`${process.env.SWUONLINE_ROOT_PATH || '../SWUOnline'}/Games/${localRunningGame}/gamestate.txt`, data, 'ascii');
  }
}