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
  },
  Plot_with_resources_used: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.LOF.KyloRenLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SEC.PadmeAmidalaLeader)
      .AddResource(1, cards.SEC.CadBane, false)
      .AddResource(1, cards.SOR.BFMarine, false)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2).ChooseMultiImg(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(2)
      .MyResourcesEquals("0/7")
      .RunAsync()
    ;
  },
  Plot_with_resources_used_no_deck: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.LOF.KyloRenLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SEC.PadmeAmidalaLeader)
      .AddResource(1, cards.SEC.CadBane, false)
      .AddResource(1, cards.SOR.BFMarine, false)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2).ChooseMultiImg(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(2)
      .MyResourcesEquals("0/6")
      .RunAsync()
    ;
  },
  Plot_off_aspect_no_deck: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.LOF.CalKestisLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SEC.PadmeAmidalaLeader)
      .FillResources(1, cards.SOR.BFMarine, 4)
      .FillResources(1, cards.SEC.ChancellorPalpatineUnit, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2).ChooseMultiImg(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(2)
      .MyResourcesEquals("0/4")
      .RunAsync()
    ;
  },
  Plot_off_aspect: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.LOF.CalKestisLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SEC.PadmeAmidalaLeader)
      .FillResources(1, cards.SOR.BFMarine, 4)
      .FillResources(1, cards.SEC.ChancellorPalpatineUnit, 1)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2).ChooseMultiImg(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(2)
      .MyResourcesEquals("0/5")
      .RunAsync()
    ;
  },
  Plot_make_play_after: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.LOF.CalKestisLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SEC.PadmeAmidalaLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .FillResources(1, cards.SEC.UnveiledMight, 1)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.SOR.BFMarine)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2).ChooseMultiImg(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyGroundUnit().AttackWithMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals("5")
      .MyGroundUnitIsThere(1)
      .MyResourcesEquals("0/4")
      .RunAsync()
    ;
  }
}