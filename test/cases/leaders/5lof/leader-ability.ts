import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '@utils/util';


export const LeaderAbilityLOFCases = {
  DarthRevan_on_kill: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowForceBase, false, true)
      .AddLeader(1, cards.LOF.DarthRevanLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddUnitWithShield(1, cards.SOR.CraftySmuggler, 4)
      .AddUnit(2, cards.SOR.CraftySmuggler)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1).ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitPieceEquals(1, 1, 'EXPERIENCE')
      .MyGroundUnitPieceIsOverlay(1, 7)
      .RunAsync()
    ;
  },
  DarthRevan_on_kill_trades_no_xp: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowForceBase, false, true)
      .AddLeader(1, cards.LOF.DarthRevanLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddUnit(1, cards.TWI.BattleDroid)
      .AddUnit(1, cards.TWI.BattleDroid)
      .AddUnit(2, cards.TWI.BattleDroid)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyGroundUnit().AttackWithMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsGone(2)
      .MyGroundUnitPieceEquals(1, 1, '1')
      .MyGroundUnitPieceEquals(1, 2, '1')
      .MyGroundUnitPieceIsOverlay(1, 3)
      .TheirBaseDamageEquals("1")
      .RunAsync()
    ;
  },
  DarthRevan_on_kill_with_trigger: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowForceBase, false, true)
      .AddLeader(1, cards.LOF.DarthRevanLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddUnit(1, cards.SOR.BobaFettUnit)
      .AddUnitWithTurnsInPlay(2, cards.SOR.CraftySmuggler, 1, false, false)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1).ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitPieceEquals(1, 1, 'EXPERIENCE')
      .MyGroundUnitPieceIsOverlay(1, 4)
      .RunAsync()
    ;
  },
  DarthRevanLeaderUnit_on_kill_with_event_no_xp: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowForceBase, false, true)
      .AddLeader(1, cards.LOF.DarthRevanLeader, true)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 3)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.TWI.MercilessContest)
      .AddUnit(1, cards.TWI.BattleDroid)
      .AddUnit(1, cards.LOF.DarthRevanLeaderUnit)
      .AddUnitWithTurnsInPlay(2, cards.SOR.CraftySmuggler, 1, false, false)
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
      .MyGroundUnitPieceEquals(1, 1, '3')
      .MyGroundUnitPieceIsOverlay(1, 3)
      .RunAsync()
    ;
  },
}