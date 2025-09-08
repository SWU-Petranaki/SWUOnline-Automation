import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '@utils/util';


export const SpecificSECCases = {
  Mon_Mothma_chained_attacks: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SEC.PadmeAmidalaLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SEC.ChancellorPalpatineLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .FillResources(2, cards.SEC.CadBane, 2)
      .FillResources(2, cards.SEC.SlyMoore, 1)
      .FillResources(2, cards.SEC.ChancellorPalpatineUnit, 1)
      .FillResources(2, cards.SOR.SLT, 3)
      .AddCardToHand(1, cards.SEC.MonMothma)
      .AddUnit(1, cards.SOR.BFMarine)
      .AddUnit(1, cards.SOR.BFMarine)
      .AddUnit(1, cards.SHD.FreetownBackup)
      .AddUnit(1, cards.SOR.BFMarine, false, false)
      .AddUnit(2, cards.SHD.PhaseIIIDarkTrooper)
      .AddUnit(2, cards.SHD.PhaseIIIDarkTrooper)
      .AddUnitWithDamage(2, cards.SHD.PhaseIIIDarkTrooper, 2)
      .AddUnit(2, cards.LOF.Mythosaur)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .TargetMyGroundUnit(1).TargetTheirGroundUnit(1)
      .TargetMyGroundUnit(1).TargetTheirGroundUnit(1)
      .TargetMyGroundUnit(1).TargetMyGroundUnit(2)
      .TargetMyGroundUnit(2)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirGroundUnitIsGone(2)
      .TheirGroundUnitPieceEquals(1, 3, '5')
      .MyGroundUnitIsGone(3)
      .RunAsync()
    ;
  }
}