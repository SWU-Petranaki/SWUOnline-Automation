/*
  Sample for running a local test case with Nightwatch.js.
  This file is intended to be used as a template for creating new test cases.
  Copy this file to ./_local.ts and modify it as needed.
  Then run the test with the command:
  ```
  npm run test:local
  ```
*/
import { cards } from "@utils/cards";
import { GamePlay } from "@utils/gameplay";
import { init } from "@utils/gamestart";
import { GameState } from "@utils/gamestate";
import { com, cs, gameName, lt, p, player1Window, player2Window } from "@utils/util";
import { NightwatchTests } from "nightwatch";

const home: NightwatchTests = {
  before: init,
  'Local Run': !Number.isInteger(Number.parseInt(process.env.LOCAL_RUN || '')) ? '' : async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("12 2")
      .AddBase(1, cards.generic.GreenForceBase, false, true)
      .AddLeader(1, "5174764156")
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.WedgeLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      //.___Debug() //uncomment to pause locally for debug
      //.___LongPause() //uncomment to pause locally for longer debug
      .RunAsync()
    ;
    //assert
  },
  after: async (browser, done) => {
    await browser.window.switchTo(player2Window).window.close();
    await browser.window.switchTo(player1Window).window.close();

    done();
  }
}

export default home;