import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';
import { GameState } from '../utils/gamestate';
import {
    com, p,
    player1Window, player2Window,
    gameName
} from '../utils/util';

export const BountyCases = {
  'Bounty: The Client heal': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("12 10")
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(1, cards.SHD.TheClient)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(2)
      .ClickMyGroundUnit(2)
      .MultiChoiceButton(1)
      .TargetTheirGroundUnit(1)
      .SwitchPlayerWindow()
      .WaitForPassButton()
      .PassTurn()
      .SwitchPlayerWindow()
      .WaitForMyGroundUnit(1)
      .ClickMyGroundUnit(1)
      .TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('7')
      .TheirBaseDamageEquals('10')
      .RunAsync()
    ;
  },
  'Bounty: The Client edge case': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("12 10")
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(1, cards.SHD.TheClient)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(2)
      .ClickMyGroundUnit(2)
      .MultiChoiceButton(1)
      .TargetMyGroundUnit(1)
      .SwitchPlayerWindow()
      .WaitForMyGroundUnit(1)
      .ClickMyGroundUnit(1)
      .TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('5')
      .TheirBaseDamageEquals('12')
      .RunAsync()
    ;
  },
  'Bounty: multiple collected': ''+async function () {//WIP
    //arrage
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("12 10")
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.KestroCity)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.OB)
      .AddUnit(1, cards.SOR.PalpUnit)
      .AddUnit(2, cards.SHD.HylobonEnforcer)
      .AddUnit(2, cards.SHD.HylobonEnforcer)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .TargetMyGroundUnit(1)
      .RunAsync()
    ;
  },
}