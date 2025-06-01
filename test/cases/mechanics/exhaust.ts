import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '@utils/util';


export const ExhaustCases = {
  Poggle_The_Lesser_exaust_for_droid: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 0")
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SOR.PalpLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.ColonelYularen)
      .AddUnit(1, cards.TWI.PoggleTheLesser)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).Pass().ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .MyBaseDamageEquals('0')
      .MyGroundUnitIsBattleDroid(3)
      .MyGroundUnitIsExhausted(1)
      .RunAsync()
    ;
  }
}