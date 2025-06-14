import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '@utils/util';


export const RestockCases = {
  restock_my_discard: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.LOF.KyloRenLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.LOF.KyloRenLeader)
      .FillResources(1, cards.SOR.TieLnFighter, 2)
      .FillResources(2, cards.SOR.TieLnFighter, 2)
      .AddCardToDiscard(2, cards.SOR.JediLightsaber)
      .AddCardToDiscard(2, cards.SOR.FallenLightsaber)
      .AddCardToDiscard(1, cards.SOR.Rukh)
      .AddCardToDiscard(1, cards.SOR.Traitorous)
      .AddCardToHand(1, cards.SOR.Restock)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseModalOption(1)
      .WaitForCheckboxes().Check(1).Check(2).Check(3).Submit()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .MyDiscardIsEmpty()
      .MyDeckCountEquals(3)
      .TheirDiscardCountEquals(2)
      .TheirDeckIsEmpty()
      .RunAsync()
    ;
  },
  restock_their_discard: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.LOF.KyloRenLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.LOF.KyloRenLeader)
      .FillResources(1, cards.SOR.TieLnFighter, 2)
      .FillResources(2, cards.SOR.TieLnFighter, 2)
      .AddCardToDiscard(2, cards.SOR.JediLightsaber)
      .AddCardToDiscard(2, cards.SOR.FallenLightsaber)
      .AddCardToDiscard(1, cards.SOR.Rukh)
      .AddCardToDiscard(1, cards.SOR.Traitorous)
      .AddCardToHand(1, cards.SOR.Restock)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseModalOption(2)
      .WaitForCheckboxes().Check(1).Check(2).Submit()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .MyDiscardCountEquals(3)
      .MyDeckIsEmpty()
      .TheirDiscardIsEmpty()
      .TheirDeckCountEquals(2)
      .RunAsync()
    ;
  }
}