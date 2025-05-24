import { NightwatchAPI, NightwatchTestHook } from "nightwatch";

import {
  com, p,
  player1Window, player2Window,
  setGameName,
  setPlayer1Window, setPlayer2Window,
} from "@utils/util";
import { GameState } from "@utils/gamestate";
import { LocalRunGameStartAsync, NewRunGameStartAsync } from "@utils//helper-func";

export const init: NightwatchTestHook = async (browser, done) => {
  await browser
    .url('http://localhost:8080/Arena/MainMenu.php')
    .window.maximize().pause(p.WaitForEffect)
    .assert.titleEquals('Petranaki')
    .pause(p.WaitToBegin)
  ;
  const localRunningGame = process.env.LOCAL_RUN || '';
  setPlayer1Window(await browser.window.getHandle());
  if(Number.isInteger(Number.parseInt(localRunningGame)) && GameState.GameExists(localRunningGame)) {
    await LocalRunGameStartAsync(browser, localRunningGame);
  } else {
    await NewRunGameStartAsync(browser);
  }

  done();
};
