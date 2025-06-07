import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts,
  cs,
  g
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
  Daughter_Sabine_ping_heals: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("2 1")
      .AddBase(1, cards.generic.YellowBase, false, true)
      .AddLeader(1, cards.LOF.AnakinLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddUnit(1, cards.LOF.TheDaughter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1)
      .SwitchPlayerWindow().WaitForMyGroundUnit(1).ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(1)
      .MyBaseDamageEquals("1")
      .TheirBaseDamageEquals("2")
      .RunAsync()
    ;
  },
  Eeth_Koth_on_zero_resources: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase, false, true)
      .AddLeader(1, cards.LOF.AnakinLeader)
      .AddBase(2, cards.generic.YellowBase, false, true)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddResource(1, cards.SOR.CraftySmuggler, false)
      .AddResource(1, cards.SOR.CraftySmuggler, false)
      .AddResource(1, cards.SOR.CraftySmuggler, false)
      .AddResource(1, cards.SOR.CraftySmuggler, false)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddUnit(1, cards.LOF.EethKoth)
      .AddUnit(2, cards.LOF.JediSentinel)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).MouseAway().ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsGone(1)
      .TheirGroundUnitIsGone(1)
      .MyResourcesEquals("0/5")
      .TheirResourcesEquals("2/2")
      .RunAsync()
    ;
  },
  Rey_Drawn_Multi: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.RedBase, false, true)
      .AddLeader(1, cards.LOF.MorganElsbethLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 4)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SHD.RemnantReserves)
      .AddCardToDeck(1, cards.LOF.ReyUnit)
      .AddCardToDeck(1, cards.LOF.ReyUnit)
      .AddCardToDeck(1, cards.LOF.SavageOpress)
      .AddCardToDeck(1, cards.LOF.SavageOpress)
      .AddCardToDeck(1, cards.LOF.SavageOpress)
      .AddUnit(2, cards.SOR.R2D2)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).WaitForCheckboxes().Check(1).Check(2).Check(3).Submit()
      .SwitchPlayerWindow().WaitForMyLeader()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirHandSizeIs(3)
      .MyHandIsEmpty()
      .TheirDiscardCountEquals(1)
      .MyDiscardCountEquals(1)
      .MyGroundUnitIsGone(1)
      .MyBaseDamageEquals("4")
      .TheirBaseDamageEquals("0")
      .RunAsync()
    ;
  },
  Deceptive_Shades_deploy_leader: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase, false, true)
      .AddLeader(1, cards.LOF.DarthRevanLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.CraftySmuggler, 4)
      .AddUnit(1, cards.LOF.DeceptiveShades)
      .AddUnit(2, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.SOR.CraftySmuggler)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForMyGroundUnit().AttackWithMyGroundUnit(1)
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader()
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2)
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).Pass().ChooseYes().TargetTheirGroundUnit(1).ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(2)
      .TheirGroundUnitIsGone(2)
      .MyGroundUnitPieceEquals(2, 1, 'EXPERIENCE')
      .MyGroundUnitPieceIsOverlay(2, 4)
      .MyBaseDamageEquals("3")
      .TheirBaseDamageEquals("0")
      .RunAsync()
    ;
  }
}