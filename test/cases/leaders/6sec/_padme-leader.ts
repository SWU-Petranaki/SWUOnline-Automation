import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '@utils/util';


export const PadmeLeaderSECCases = {
  Padme_leader_from_Spark_Of_Rebellion: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SEC.PadmeAmidalaLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 4)
      .AddCardToHand(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.SOR.BFMarine)
      .AddCardToHand(2, cards.SOR.SparkOfRebellion)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).MouseAway().ChooseMultiImg(2)
      .SwitchPlayerWindow().MouseAway().ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyLeaderIsExhausted()
      .TheyHaveNoUnits()
      .IHaveNoUnits()
      .RunAsync()
    ;
  },
  Padme_leader_from_Bazine: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SEC.PadmeAmidalaLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.SOR.BFMarine)
      .AddCardToHand(2, cards.SHD.BazineNetal)
      .AddUnit(2, cards.SOR.CraftySmuggler)
      .AddUnit(2, cards.SOR.CraftySmuggler)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).MouseAway().ChooseMultiImg(2)
      .SwitchPlayerWindow().MouseAway().ChooseYes().TargetTheirGroundUnit(2)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyLeaderIsExhausted()
      .IHaveNoUnits()
      .TheirGroundUnitPieceIsOverlay(1, 3)
      .TheirGroundUnitPieceEquals(2, 3, '1')
      .RunAsync()
    ;
  },
  Padme_leader_from_Cobb_Vanth: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SEC.PadmeAmidalaLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddUnit(1, cards.SHD.CobbVanth)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .WaitForCheckboxes().Check(1).Submit().ChooseYes().TargetTheirGroundUnit(2)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyLeaderIsExhausted()
      .IHaveNoUnits()
      .TheirGroundUnitPieceIsOverlay(1, 3)
      .TheirGroundUnitIsGone(2)
      .RunAsync()
    ;
  },
  Padme_leader_unit_from_Spark_Of_Rebellion: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SEC.PadmeAmidalaLeader, true)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 4)
      .AddCardToHand(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.SOR.BFMarine)
      .AddCardToHand(2, cards.SOR.SparkOfRebellion)
      .AddUnit(1, cards.SEC.PadmeAmidalaLeaderUnit)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).MouseAway().ChooseMultiImg(2)
      .SwitchPlayerWindow().MouseAway().TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheyHaveNoUnits()
      .RunAsync()
    ;
  },
  Padme_leader_unit_from_Bazine: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SEC.PadmeAmidalaLeader, true)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.SOR.BFMarine)
      .AddCardToHand(2, cards.SHD.BazineNetal)
      .AddUnit(1, cards.SEC.PadmeAmidalaLeaderUnit)
      .AddUnit(2, cards.SOR.CraftySmuggler)
      .AddUnit(2, cards.SOR.CraftySmuggler)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).Pass().ChooseMultiImg(2)
      .SwitchPlayerWindow().MouseAway().TargetTheirGroundUnit(2)
      .SwitchPlayerWindow().ChooseNo()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitPieceIsOverlay(1, 3)
      .MyGroundUnitPieceEquals(2, 3, '1')
      .RunAsync()
    ;
  },
  Padme_leader_unit_from_Cobb_Vanth: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SEC.PadmeAmidalaLeader, true)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddUnit(1, cards.SHD.CobbVanth)
      .AddUnit(1, cards.SEC.PadmeAmidalaLeaderUnit)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .WaitForCheckboxes().Check(1).Submit().MouseAway().TargetTheirGroundUnit(2)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirGroundUnitPieceIsOverlay(1, 3)
      .TheirGroundUnitIsGone(2)
      .RunAsync()
    ;
  }
}