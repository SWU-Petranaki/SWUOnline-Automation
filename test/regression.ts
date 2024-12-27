import {NightwatchTests} from 'nightwatch';

import {com, p, player1Window, player2Window, setPlayer1Window, setPlayer2Window} from './utils/util';
import { WhenPlayedCases } from './cases/when-played';
import { WhenDefeatCases } from './cases/when-defeat';
import { OnAttackCases } from './cases/on-attack';
import { AmbushCases } from './cases/ambush';
import { BounceCases } from './cases/bounce';
import { LeaderAbilitySORCases } from './cases/leader-ability-sor';
import { LeaderUnitCases } from './cases/leader-unit';
import { BountyCases } from './cases/bounty';
import { ExploitCases } from './cases/exploit';
import { SpecificSHDCases } from './cases/specific/shd';
import { SpecificTWICases } from './cases/specific/twi';

const genericJangoDeck = 'https://swudb.com/deck/nwETxCRed';
const maxRetries = 3;

const home: NightwatchTests = {
  'Before': async () => {
    await browser
      .url('http://localhost:8080/SWUOnline/MainMenu.php')
      .window.maximize().pause(p.WaitForEffect)
      .assert.titleEquals('Karabast')
    ;
  },
  'Set up new game for 2 players': async () => {
    setPlayer1Window(await browser.window.getHandle());

    await browser
      .waitForElementPresent('input#fabdb')
      .setValue('input#fabdb', genericJangoDeck)
      .click('input.create-game-button').pause(p.ButtonPress);

    let inviteRetry = 0;

    while(!await browser.element.find('input.invite-link').isPresent() && inviteRetry < maxRetries) {
      await browser.refresh().refresh().refresh().pause(p.WaitToBegin);
      inviteRetry++;
    }

    const inviteLink = await browser
      .waitForElementPresent('input.invite-link')
      .getValue('input.invite-link');
    ;

    setPlayer2Window(await browser.window.open('tab').window.getHandle());

    browser
      .url(inviteLink)
      .waitForElementPresent('input#fabdb')
      .setValue('input#fabdb', genericJangoDeck)
      .waitForElementPresent('input.JoinGame_Button')
      .click('input.JoinGame_Button').pause(p.ButtonPress)
      .pause(p.WaitToBegin)
    ;

    let joinGameRetry = 0;

    while(!await browser.element.find('div#setup-content').isPresent() && joinGameRetry < maxRetries) {
      await browser.navigateTo(inviteLink).pause(p.WaitToBegin)
        .refresh().refresh().refresh()
        .pause(p.WaitToBegin)
        .waitForElementPresent('input#fabdb')
        .setValue('input#fabdb', genericJangoDeck)
        .waitForElementPresent('input.JoinGame_Button')
        .click('input.JoinGame_Button').pause(p.ButtonPress)
        .pause(p.WaitToBegin)
      joinGameRetry++;
    }

    if(await browser.element.find('input.GameLobby_Button[value="Go First"]').isPresent()) {
      await browser.click('input.GameLobby_Button[value="Go First"]')
        .waitForElementPresent('input.GameLobby_Button[value="Ready"]')
        .click('input.GameLobby_Button[value="Ready"]').pause(p.ButtonPress)
      ;

      await browser.window.switchTo(player1Window)
        .refresh()
        .waitForElementPresent('input.GameLobby_Button[value="Start"]')
        .click('input.GameLobby_Button[value="Start"]').pause(p.ButtonPress)
        ;
    } else {
      await browser.window.switchTo(player1Window)
        .refresh()
        .waitForElementPresent('input.GameLobby_Button[value="Go First"]')
        .click('input.GameLobby_Button[value="Go First"]').pause(p.ButtonPress)
        .waitForElementPresent('input.GameLobby_Button[value="Start"]')
        .click('input.GameLobby_Button[value="Start"]').pause(p.ButtonPress)
      ;

      await browser.window.switchTo(player2Window)
        .refresh()
        .waitForElementPresent('input.GameLobby_Button[value="Ready"]')
        .click('input.GameLobby_Button[value="Ready"]').pause(p.ButtonPress)
      ;
    }

    await browser.window.switchTo(player1Window)
      .pause(p.WaitToBegin);
  },
//regression suite
  ...WhenPlayedCases,
  ...WhenDefeatCases,
  ...OnAttackCases,
  ...AmbushCases,
  ...BounceCases,
  ...LeaderAbilitySORCases,
  ...LeaderUnitCases,
  //...SpecificSORCases,
  ...BountyCases,
  ...SpecificSHDCases,
  ...ExploitCases,
  ...SpecificTWICases,
//end regression suite
  'After': async () => {
    await browser.window.switchTo(player2Window).window.close();
    await browser.window.switchTo(player1Window).window.close();
  }
};

export default home;