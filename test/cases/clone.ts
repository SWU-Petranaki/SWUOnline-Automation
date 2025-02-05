import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  src
} from '../utils/util';

export const CloneCases = {
  'Clone: cant clone piloted leader unit': process.env.FULL_REGRESSION !== 'true' ? '' : async function () {
    //technically not possible, but here just in case future rules allow it
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader, true)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.Waylay, 7)
      .AddCardToHand(1, cards.TWI.Clone)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(1, cards.SOR.DSStormTrooper, false, 0,//Han Solo piggy-backing on a stormtrooper..
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.AllyGroundUnit(2)), 'style', src.NotPlayableBorderUnit);
  },
}