import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName
} from '../utils/util';

export const AmbushCases = {
  //GIVEN: i have base SOR.ECL; i have leader SOR.SabineLeader; they have base SOR.ECL; they have leader SOR.SabineLeader; i have 2 SOR.BFMarine in my resources; they have 2 SOR.BFMarine in their resources; i have SOR.SabineUnit in hand; i have SOR.SabineUnit in play; they have SOR.CraftySmuggler in play with a shield;;
  //WHEN: i activate my base; i target the first card in my hand; i target my first ground unit; i choose yes; i pass; i target their first ground unit;;
  //EXPECT: they have no ground units; my first ground unit's third piece equals 2;
  ECL_Sabine_ping_shield: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL).AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.ECL).AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.SabineUnit)
      .AddUnit(1, cards.SOR.SabineUnit, false, false)
      //by default, the unit is not epic action, is ready, has 0 damage, and the shield is owned by the same player that controls the unit
      .AddUnit(2, cards.SOR.CraftySmuggler, false, true, 0,
        gameState.SubcardBuilder().AddShield(2).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().ClickMyBase()
      .TargetMyHandCard(1).TargetMyGroundUnit(1).ChooseYes()
      //TODO: remove when we figure out how to autopass layers
      .Pass()
      .TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheyHaveNoGroundUnits()
      .MyGroundUnitPieceEquals(1, 3, '2')
      .RunAsync()
    ;
  },
  'Ambush: Rukh into Krayt Dragon with ECL': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.MoffTarkinLeader)
      .AddBase(2, cards.SOR.KestroCity)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.Rukh)
      .AddUnit(2, cards.SHD.KraytDragon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyBase().ClickMyBase().TargetMyHandCard(1)
      .Pass().ChooseYes()
      .SwitchPlayerWindow()
      .WaitForTheirGroundUnit(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .IHaveNoGroundUnits()
      .TheirGroundUnitPieceEquals(1, 3, '5')
      .RunAsync()
    ;
  },
  'Ambush: Rukh into Krayt Dragon with TI': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.MoffTarkinLeader)
      .AddBase(2, cards.SOR.KestroCity)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.SOR.Rukh)
      .AddCardToHand(1, cards.SHD.TimelyIntervention)
      .AddUnit(2, cards.SHD.KraytDragon)
      .FlushAsync(com.BeginTestCallback)
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().ClickHandCard(2).TargetMyHandCard(1)
      .ClickLayerTile(1).ClickLayerTile(3)
      .Pass().ChooseYes().Pass()
      .SwitchPlayerWindow()
      .WaitForTheirGroundUnit(1).TargetTheirGroundUnit(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .WeHaveNoGroundUnits()
      .RunAsync()
    ;
  },
}