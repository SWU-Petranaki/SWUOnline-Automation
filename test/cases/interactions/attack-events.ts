import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  src
} from '@utils/util';

export const AttackEventsCases = {
  Surprise_Strike_does_three_more: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("0 4")
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.GreenSquadAWing, 2)
      .FillResources(2, cards.SOR.GreenSquadAWing, 2)
      .AddCardToHand(1, cards.SOR.SurpriseStrike)
      .AddUnit(1, cards.SOR.GreenSquadAWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals("0")
      .TheirBaseDamageEquals("10")
      .RunAsync()
    ;
  }
}