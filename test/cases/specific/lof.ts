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
  UWing_Obi_wan_padawan: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.LOF.ObiWanLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SOR.UWing)
      .AddCardToDeck(1, cards.LOF.ObiWanPadawan)
      .AddCardToDeck(1, cards.SOR.BFMarine, 9)
      .AddCardToDeck(1, cards.JTL.LukeUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .WaitForCheckboxes().Check(1).Check(2).Check(3).Submit().Pass().Pass()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .MyGroundUnitIsThere(2)
      .MyGroundUnitPieceIsSentinelToken(1, 3)
      .RunAsync()
    ;
  },
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
      .WaitForCheckboxes().MouseAway().Check(1).Submit().MouseAway().Check(2).Submit()
      .ChooseYes().WaitForCheckboxes().MouseAway().Check(5).Submit()
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
      .WaitForMyHand().PlayFromHand(1).WaitForCheckboxes().Check(1).Check(2).Check(3).Submit().ChooseYes().ChooseYes()
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
  },
  Sneak_Attack_Leia_Force_base_combo: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowForceBase)
      .AddLeader(1, cards.LOF.ObiWanLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 4)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SOR.SneakAttack)
      .AddCardToHand(1, cards.LOF.Leia)
      .AddUnit(1, cards.SHD.CartelTurncoat)
      .AddUnit(1, cards.SHD.CartelTurncoat)
      .AddUnit(1, cards.SOR.EchoBaseDefender)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetMyHandCard(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMySpaceUnit(3).ClickMySpaceUnit(3).MultiChoiceButton(2)
      .ClickMySpaceUnit(3)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsGone(3)
      .MySpaceUnitPieceEquals(1, 1, '4')
      .MySpaceUnitPieceEquals(1, 2, '5')
      .MySpaceUnitPieceEquals(2, 1, '4')
      .MySpaceUnitPieceEquals(2, 2, '5')
      .MyGroundUnitPieceEquals(1, 1, '6')
      .MyGroundUnitPieceEquals(1, 2, '5')
      .MyGroundUnitPieceEquals(2, 1, '7')
      .MyGroundUnitPieceEquals(2, 2, '7')
      .TheirBaseDamageEquals("5")
      .MyBaseDamageEquals("0")
      .RunAsync()
    ;
  },
  Sneak_Attack_Leia_moves_ready: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowForceBase, false, true)
      .AddLeader(1, cards.LOF.ObiWanLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 4)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SOR.SneakAttack)
      .AddCardToHand(1, cards.LOF.Leia)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetMyHandCard(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMySpaceUnit(1).ClickMySpaceUnit(1).MultiChoiceButton(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsGone(1)
      .MyGroundUnitIsNotExhausted(1)
      .MyGroundUnitPieceEquals(1, 1, '7')
      .MyGroundUnitPieceEquals(1, 2, '7')
      .RunAsync()
    ;
  },
  Baylan_Skoll_bounces_token: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 2")
      .AddBase(1, cards.generic.YellowBase, false, true)
      .AddLeader(1, cards.SOR.IG88Leader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.CraftySmuggler, 3)
      .AddCardToHand(1, cards.LOF.BaylanSkoll)
      .AddUnit(2, cards.TWI.BattleDroid)
      .AddCardToHand(2, cards.TWI.MercilessContest)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseYes()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .WeHaveNoUnits()
      .MyDiscardCountEquals(1)
      .TheirDiscardCountEquals(1)
      .MyResourcesEquals("0/3")
      .TheirResourcesEquals("0/5")
      .RunAsync()
    ;
  },
  Kazuda_Space_Leia: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 2")
      .AddBase(1, cards.generic.GreenBase, false, true)
      .AddLeader(1, cards.JTL.KazudaLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddUnit(1, cards.LOF.Leia, false, false)
      .AddCardToDeck(1, cards.SOR.BFMarine, 2)
      .AddCardToDeck(2, cards.SOR.CraftySmuggler, 2)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMySpaceUnit().ClickMySpaceUnit(1).MultiChoiceButton(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyGroundUnit().AttackWithMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals("9")
      .RunAsync()
    ;
  },
  Rey_drawn_by_Yoda_TWI_leader: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.TWI.YodaLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToDeck(1, cards.LOF.ReyUnit)
      .AddCardToDeck(1, cards.SOR.Restock, 2)
      .AddCardToHand(1, cards.SOR.Restock)
      .AddCardToHand(1, cards.SHD.CassianAndor)
      .SetClassStatePiece(1, cs.NumLeftPlay, '1')
      .AddUnit(1, cards.SOR.GreenSquadAWing)
      .AddUnit(2, cards.SOR.GreenSquadAWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).ChooseModalOption(2)
      .TargetMyHandCard(2).ChooseButton(1, 1).TargetTheirSpaceUnit(1).TargetMySpaceUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals("2")
      .MyBaseDamageEquals("0")
      .MySpaceUnitIsThere(1)
      .MySpaceUnitPieceIsOverlay(1, 3)
      .TheirSpaceUnitPieceEquals(1, 3, "2")
      .RunAsync()
  },
  Drengir_Spawn_defeats_leader_unit_with_grit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.LOF.MorganElsbethLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SHD.QiRaLeader, true)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.CraftySmuggler, 5)
      .AddUnitWithExperience(1, cards.LOF.DrengirSpawn, 3, false, true, 3)
      .AddUnitWithDamage(2, cards.SHD.QiRaLeaderUnit, 2)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(1)
      .TheirGroundUnitIsGone(1)
      .MyGroundUnitPieceEquals(1, 1, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 2, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 3, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 4, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 5, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 6, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 7, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 8, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 9, '11')
      .MyGroundUnitPieceEquals(1, 10, '11')
      .MyGroundUnitPieceEquals(1, 11, '5')
      .MyGroundUnitPieceIsOverlay(1, 12)
      .RunAsync()
    ;
  },
  Boba_Daimyo_Obiwan_unit: async function () {
    // arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SHD.BobaDaimyoLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .FillResources(2, cards.SOR.CraftySmuggler, 3)
      .AddCardToHand(1, cards.LOF.ObiWanPadawan)
      .FlushAsync(com.BeginTestCallback)
    ;
    // act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).Pass().TargetMyGroundUnit(1)
      .RunAsync()
    ;
    // assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .MyGroundUnitIsThere(1)
      .MyGroundUnitPieceEquals(1, 1, '4')
      .RunAsync()
    ;
  },
  Kylo_Ren_leader_Migs_SHD_ping: async function () {
    // arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.LOF.KyloRenLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .FillResources(2, cards.SOR.CraftySmuggler, 3)
      .AddCardToHand(1, cards.SOR.POTDS)
      .AddUnit(1, cards.SHD.MigsMayfeld)
      .FlushAsync(com.BeginTestCallback)
    ;
    // act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).TargetMyHandCard(1).TargetTheirBase().MouseAway()
      .RunAsync()
    ;
    // assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .MyGroundUnitIsThere(1)
      .TheirBaseDamageEquals("2")
      .RunAsync()
    ;
  },
  Sith_Holocron_double_trigger: async function () {
    // arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.LOF.KyloRenLeader, true)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SHD.QiRaLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .FillResources(2, cards.SOR.CraftySmuggler, 7)
      .AddUnit(1, cards.LOF.KyloRenLeaderUnit, true, true, 1,
        gameState.SubcardBuilder()
        .AddUpgrade(cards.LOF.SithHolocron, 1)
        .AddUpgrade(cards.LOF.SithHolocron, 1)
        .AddUpgrade(cards.LOF.KyloRensLightsaber, 1)
        .Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    // act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).Pass().ChooseYes().ChooseYes()
      .RunAsync()
    ;
    // assert
    gameplay.Assert()
      .MyGroundUnitIsThere(1)
      .TheirBaseDamageEquals("12")
      .RunAsync()
  },
  HK47_no_ping_when_defeated_by_vanilla: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SOR.IG88Leader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.CraftySmuggler, 5)
      .AddUnitWithDamage(1, cards.LOF.HK47, 2)
      .AddUnit(2, cards.SOR.BFMarine)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheyHaveNoUnits()
      .MyGroundUnitPieceEquals(1, 3, '2')
      .TheirBaseDamageEquals('0')
      .MyBaseDamageEquals('0')
      .RunAsync()
    ;
  },
  HK47_no_ping_when_defeated_self: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SOR.IG88Leader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.CraftySmuggler, 5)
      .AddUnitWithDamage(1, cards.LOF.HK47, 2)
      .AddUnit(2, cards.SOR.BFMarine)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForMyGroundUnit().AttackWithMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheyHaveNoUnits()
      .MyGroundUnitPieceEquals(1, 3, '2')
      .TheirBaseDamageEquals('0')
      .MyBaseDamageEquals('0')
      .RunAsync()
    ;
  },
  HK47_no_ping_when_defeated_by_when_defeated_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SOR.IG88Leader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .FillResources(2, cards.SOR.CraftySmuggler, 7)
      .AddUnit(1, cards.LOF.HK47)
      .AddCardToHand(2, cards.LOF.QuiGonJinnUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).ChooseYes()
      .SwitchPlayerWindow()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .IHaveNoUnits()
      .MyGroundUnitIsGone(1)
      .TheirGroundUnitPieceEquals(1, 3, '2')
      .MyBaseDamageEquals('0')
      .TheirBaseDamageEquals('0')
      .RunAsync()
    ;
  },
  HK47_no_ping_when_defeated_self_on_defeated_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SOR.IG88Leader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.CraftySmuggler, 5)
      .AddUnit(1, cards.LOF.HK47)
      .AddUnit(2, cards.LOF.QuiGonJinnUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForMyLeader()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheyHaveNoUnits()
      .MyGroundUnitPieceEquals(1, 3, '2')
      .TheirBaseDamageEquals('0')
      .MyBaseDamageEquals('0')
      .RunAsync()
    ;
  },
  HK47_no_ping_when_defeated_by_ambush: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SOR.IG88Leader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.DarthVaderLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.CraftySmuggler, 5)
      .AddUnit(2, cards.LOF.HK47)
      .AddCardToHand(1, cards.SOR.Bossk)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseYes()
      .SwitchPlayerWindow()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .IHaveNoUnits()
      .TheirGroundUnitPieceEquals(1, 3, '2')
      .TheirBaseDamageEquals('0')
      .MyBaseDamageEquals('0')
      .RunAsync()
    ;
  },
}