import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '@utils/util';


export const PlotCases = {
  Palp_SEC_leader_Plot_discounts: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SEC.ChancellorPalpatineLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SEC.PadmeAmidalaLeader)
      .FillResources(1, cards.SEC.CadBane, 3)
      .FillResources(1, cards.SEC.SlyMoore, 1)
      .FillResources(1, cards.SEC.ArmorOfFortune, 1)
      .FillResources(1, cards.SOR.SLT, 3)
      .AddCardToDeck(1, cards.SOR.TieLnFighter)
      .AddCardToDeck(1, cards.SOR.DarthVader)
      .AddCardToDeck(1, cards.SOR.DarthVader)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2).ChooseMultiImg(1).ChooseMultiImg(3).ChooseMultiImg(3).TargetMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyResourcesEquals("0/8")
      .RunAsync()
    ;
  },
  Palp_SEC_leader_Plot_discounts_run_out_deck: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SEC.ChancellorPalpatineLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SEC.PadmeAmidalaLeader)
      .FillResources(1, cards.SEC.CadBane, 3)
      .FillResources(1, cards.SEC.SlyMoore, 1)
      .FillResources(1, cards.SEC.ArmorOfFortune, 1)
      .FillResources(1, cards.SOR.SLT, 3)
      .AddCardToDeck(1, cards.SOR.TieLnFighter)
      .AddCardToDeck(1, cards.SOR.DarthVader)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2).ChooseMultiImg(1).ChooseMultiImg(3).ChooseMultiImg(3).TargetMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyResourcesEquals("0/7")
      .RunAsync()
    ;
  }
}