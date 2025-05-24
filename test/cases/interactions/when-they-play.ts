import { cards } from '@utils/cards';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName
} from '@utils/util';

export const WhenTheyPlayCases = {
  'When They Play: POTDS Krayt Dragon': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.SOR.KrennicLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.SOR.POTDS)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SHD.KraytDragon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    //assert
    await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.textEquals(com.TheirBaseDamage, '3');
  },
}
