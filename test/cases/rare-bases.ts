import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  src
} from '../utils/util';

export const RareBasesCases = {
  'ECL gives ambush': async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.BFMarine)
      .AddUnit(2, cards.SHD.PoeDameron)
      .AddUnit(2, cards.SOR.BFMarine, false, false, 0,
        gameState.SubcardBuilder().AddExperience(2).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickMyBase()
      .TargetMyHandCard(1)
      .ChooseYes()
      .TargetTheirGroundUnit(2)
      .RunAsync()
    ;
    //assert
    await gameplay.Assert()
      .TheirGroundUnitPieceEquals(2, 4, '3')
      .IHaveNoGroundUnits()
      .RunAsync()
    ;
  },
  'Petranaki Arena gives +1 power': async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.TWI.PetranakiArena)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SOR.HanLeader)
      .FillResources(1, cards.SOR.BFMarine, 4)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader()
      .ClickMyLeader()
      .MultichoiceButton(2)
      .SwitchPlayerWindow()
      .WaitForClaimButton()
      .ClaimInitiative()
      .SwitchPlayerWindow()
      .WaitForMyGroundUnit(1)
      .ClickMyGroundUnit(1)
      .TargetTheirBase()
      .RunAsync()
    ;
    //assert
    await gameplay.Assert()
      .MyGroundUnitPieceEquals(1, 1, '3')
      .TheirBaseDamageEquals('4')
      .RunAsync()
    ;
  }
}