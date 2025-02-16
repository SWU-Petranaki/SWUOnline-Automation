import { NightwatchAPI, NightwatchTestHook } from "nightwatch";

import {
  com, p,
  player1Window, player2Window,
  setGameName,
  setPlayer1Window, setPlayer2Window,
} from "./util";
import { GameState } from "./gamestate";

const swustatsDeck = 'https://swustats.net/TCGEngine/NextTurn.php?gameName=6128&playerID=1&folderPath=SWUDeck';
const maxRetries = 5;

export const init: NightwatchTestHook = async (browser, done) => {
  await browser
    .url('http://localhost:8080/SWUOnline/MainMenu.php')
    .window.maximize().pause(p.WaitForEffect)
    .assert.titleEquals('Karabast')
    .pause(p.WaitToBegin)
  ;

  setPlayer1Window(await browser.window.getHandle());
  const localRunningGame = process.env.LOCAL_RUN || '';
  if(Number.isInteger(Number.parseInt(localRunningGame))) {
    const gameState = new GameState(localRunningGame);
    await gameState.LoadGameStateLinesAsync();
    const p1AuthKey = gameState.GetAuthKey(1);
    await browser.cookies.set({
      name: "lastAuthKey",
      value: p1AuthKey,
    });
    await gameState.SetAuthKey(2, p1AuthKey).FlushAsync();
    await browser.url(`http://localhost:8080/SWUOnline/NextTurn4.php?gameName=${localRunningGame}&playerID=1`).refresh();

    setPlayer2Window(await browser.window.open('tab').window.getHandle());

    await browser.url(`http://localhost:8080/SWUOnline/NextTurn4.php?gameName=${localRunningGame}&playerID=2`).refresh();

    setGameName(localRunningGame);
    await browser.window.switchTo(player1Window).refresh().pause(p.WaitToBegin);
  } else {
    await browser
      .waitForElementPresent(com.DeckInput)
      .setValue(com.DeckInput, swustatsDeck)
      .click(com.CreateGameButton).pause(p.ButtonPress)
      .refresh().refresh().refresh().refresh().refresh()
      .refresh().pause(p.ButtonPress)
      .refresh().pause(p.WaitToBegin)
    ;

    let inviteRetry = 0;

    while(!await browser.element.find(com.InviteLink).isPresent() && inviteRetry < maxRetries) {
      await browser
      .refresh().refresh().refresh().refresh().refresh()
      .refresh().pause(p.ButtonPress)
      .refresh().pause(p.WaitToBegin)
      inviteRetry++;
    }

    const inviteLink = await browser
      .waitForElementPresent(com.InviteLink)
      .getValue(com.InviteLink);
    ;

    setPlayer2Window(await browser.window.open('tab').window.getHandle());

    browser
      .url(inviteLink)
      .waitForElementPresent(com.DeckInput)
      .setValue(com.DeckInput, swustatsDeck)
      .waitForElementPresent(com.JoinGameButton)
      .click(com.JoinGameButton).pause(p.ButtonPress)
      .pause(p.WaitToBegin)
      .refresh().pause(p.WaitToBegin)
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
      .setValue(com.DeckInput, swustatsDeck)
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
      .refresh().pause(p.WaitToBegin).pause(p.WaitToBegin);

    const game = new URL(await browser.getCurrentUrl()).searchParams.get('gameName') || '';
    setGameName(game);
  }

  done();
};
