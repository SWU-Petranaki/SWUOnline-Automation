import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts,
  cs
} from '@utils/util';

export const SpecificLOFCases = {
  Kelleran_Beq_UWing_QuiGons_Aethersprite: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenForceBase, false, true)
      .AddLeader(1, cards.LOF.QuiGonJinnLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.LOF.AnakinKid, 10)
      .FillResources(2, cards.TWI.SabineWren, 10)
      .AddCardToDeck(1, cards.LOF.KelleranBeq)
      .AddCardToDeck(1, cards.SOR.BFMarine, 9)
      .AddCardToDeck(1, cards.JTL.LukeUnit)
      .AddCardToDeck(1, cards.JTL.R2D2, 3)
      .AddCardToDeck(1, cards.SOR.BFMarine, 7)
      .AddCardToDeck(1, cards.SOR.CraftySmuggler, 3)
      .AddCardToHand(1, cards.SOR.UWing)
      .AddCurrentTurnEffect(cards.LOF.QuiGonAethrsprite, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .WaitForCheckboxes().Check(1).Submit().Check(2).Submit()
      .ChooseYes().WaitForCheckboxes().Check(5).Submit()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .MyGroundUnitIsThere(3)
      .MyGroundUnitIsGone(4)
      .MyGroundUnitPieceIsShieldToken(3, 3)
      .RunAsync()
    ;
  },
  Obiwan_padawan_captured_no_sentinel: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase, false, true)
      .AddLeader(1, cards.LOF.ObiWanLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SHD.L337)
      .AddUnitWithCaptive(2, cards.SOR.BFMarine, cards.LOF.ObiWanPadawan)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetTheirGroundUnit(1).ChooseButton(1, 1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(2)
      .MyGroundUnitPieceIsOverlay(2, 3)
      .RunAsync()
    ;
  },
  Mythosaur_can_still_exhaust_friendly_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 0")
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SOR.PalpLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.ColonelYularen)
      .AddUnitWithUpgrade(1, cards.TWI.PoggleTheLesser, cards.generic.Shield)
      .AddUnit(1, cards.LOF.Mythosaur)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).Pass().ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .MyBaseDamageEquals('0')
      .MyGroundUnitIsBattleDroid(4)
      .MyGroundUnitIsExhausted(1)
      .RunAsync()
    ;
  }
}