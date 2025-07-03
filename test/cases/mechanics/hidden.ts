import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '@utils/util';


export const HiddenCases = {
  hidden_unit_rescued_not_hidden: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.RedForceBase, false, true)
      .AddLeader(1, cards.LOF.KyloRenLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.WedgeLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 5)
      .FillResources(2, cards.SOR.BFMarine, 5)
      .AddUnitWithCaptive(1, cards.SOR.DSStormTrooper, cards.LOF.Grogu)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.BFMarine)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .MouseAway().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .WeHaveNoUnits()
      .RunAsync()
    ;
  }
}