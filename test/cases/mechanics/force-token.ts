import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '@utils/util';


export const ForceTokenCases = {
  Ambush_Luke_Force_Token: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueForceBase)
      .AddLeader(1, cards.LOF.QuiGonJinnLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 5)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.TWI.PloKoon)
      .AddUnit(1, cards.LOF.LukeSkywalker)
      .AddUnit(2, cards.SOR.BFMarine)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).Pass().ChooseYes().ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheyHaveNoUnits()
      .MyGroundUnitPieceEquals(1, 1, 'EXPERIENCE')
      .MyGroundUnitPieceIsShieldToken(1, 4)
      .MyGroundUnitPieceEquals(2, 3, '3')
      .RunAsync()
    ;
  }
}