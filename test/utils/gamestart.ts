import { NightwatchAPI, NightwatchTestHook } from "nightwatch";

import {
  com, p,
  player1Window, player2Window,
  setPlayer1Window, setPlayer2Window,
} from "./util";

const genericJangoDeck = 'https://swudb.com/deck/nwETxCRed';
const maxRetries = 5;

export const init: NightwatchTestHook = async (browser, done) => {
  await browser
    .url('http://localhost:8080/SWUOnline/MainMenu.php')
    .window.maximize().pause(p.WaitForEffect)
    .assert.titleEquals('Karabast')
  ;

  setPlayer1Window(await browser.window.getHandle());

  await browser
    .waitForElementPresent(com.DeckInput)
    .saveScreenshot('./screenshots/github-action-1.png')
    .setValue(com.DeckInput, genericJangoDeck)
    .click(com.CreateGameButton).pause(p.ButtonPress)
    .saveScreenshot('./screenshots/github-action-2.png')
    .refresh().refresh().refresh().refresh().refresh()
    .refresh().pause(p.ButtonPress)
    .refresh().pause(p.WaitToBegin)
    .saveScreenshot('./screenshots/github-action-3.png')
  ;

  let inviteRetry = 0;

  while(!await browser.element.find(com.InviteLink).isPresent() && inviteRetry < maxRetries) {
    await browser
    .refresh().refresh().refresh().refresh().refresh()
    .refresh().pause(p.ButtonPress)
    .refresh().pause(p.WaitToBegin)
    .saveScreenshot(`./screenshots/github-action-5${inviteRetry}.png`)
    inviteRetry++;
  }

  const inviteLink = await browser
    .saveScreenshot('./screenshots/github-action-6.png')
    .waitForElementPresent(com.InviteLink)
    .getValue(com.InviteLink);
  ;

  setPlayer2Window(await browser.window.open('tab').window.getHandle());

  browser
    .url(inviteLink)
    .waitForElementPresent(com.DeckInput)
    .setValue(com.DeckInput, genericJangoDeck)
    .waitForElementPresent(com.JoinGameButton)
    .click(com.JoinGameButton).pause(p.ButtonPress)
    .refresh().refresh().refresh().refresh().refresh()
    .pause(p.WaitToBegin)
  ;

  let retries = 0;

  while((!await browser.element.find(com.LobbySetupContent).isPresent()
        || (await browser.getText(com.LobbySetupContent)).length === 0)
      && retries < maxRetries) {
    await browser.navigateTo(inviteLink)
    .refresh().refresh().refresh().refresh().refresh()
    .pause(p.WaitToBegin)
    .refresh().pause(p.ButtonPress).refresh().pause(p.WaitToBegin)
    .waitForElementPresent(com.DeckInput)
    .setValue(com.DeckInput, genericJangoDeck)
    .waitForElementPresent(com.JoinGameButton)
    .click(com.JoinGameButton).pause(p.ButtonPress)
    .pause(p.WaitToBegin)
    .refresh().pause(p.ButtonPress)
    .refresh().pause(p.WaitToBegin)
    retries++;
  }

  if(await browser.element.find(com.GoFirstButton).isPresent()) {
    await browser.click(com.GoFirstButton)
    .waitForElementPresent(com.ReadyButton)
    .click(com.ReadyButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player1Window)
    .waitForElementPresent(com.StartButton)
    .click(com.StartButton).pause(p.ButtonPress)
    ;
  } else {
    await browser.window.switchTo(player1Window)
    .waitForElementPresent(com.GoFirstButton)
    .click(com.GoFirstButton).pause(p.ButtonPress)
    .waitForElementPresent(com.StartButton)
    .click(com.StartButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window)
    .waitForElementPresent(com.ReadyButton)
    .click(com.ReadyButton).pause(p.ButtonPress)
    ;
  }

  await browser.window.switchTo(player1Window)
    .refresh().pause(p.WaitToBegin);

  done();
};
