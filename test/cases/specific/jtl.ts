import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '@utils/util';


export const SpecificJTLCases = {
  Eject_epic_action_pilot_leader_unit_defeated_cant_deploy_next_turn: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.WedgeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .AddCardToDeck(1, cards.SOR.BFMarine, 5)
      .AddCardToDeck(2, cards.SOR.DSStormTrooper, 5)
      .AddCardToHand(1, cards.JTL.Eject)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(2, cards.TWI.SavageOpress)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader()
      .ClickMyLeader()
      .MultiChoiceButton(2)
      .MultiChoiceButton(1)
      .SwitchPlayerWindow()
      .WaitForPassButton()
      .PassTurn()
      .SwitchPlayerWindow()
      .WaitForMyHand()
      .ClickHandCard(1)
      .ChooseButton(1, 1)
      .SwitchPlayerWindow()
      .WaitForMyGroundUnit(1)
      .ClickMyGroundUnit(1)
      .TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    await gameplay.Assert()
      .TheirLeaderHasUsedEpicAction()
      .RunAsync()
    ;
    //act
    await gameplay
      .SwitchPlayerWindow()
      .WaitForClaimButton()
      .ClaimInitiative()
      .SwitchPlayerWindow()
      .WaitForPassButton()
      .PassTurn()
      //next round
      .SwitchPlayerWindow()
      .WaitForMyHand()
      .ClickHandCard(1)
      .SwitchPlayerWindow()
      .WaitForMyHand()
      .ClickHandCard(1)
      .SwitchPlayerWindow()
      .WaitForMyLeader()
      .ClickMyLeader()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyLeaderHasUsedEpicAction()
      .MyGroundUnitIsGone(1)
      .RunAsync()
    ;
  },
  epic_action_pilot_leader_upgrade_defeated_cant_deploy_next_turn: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.WedgeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .AddCardToDeck(1, cards.SOR.BFMarine, 2)
      .AddCardToDeck(2, cards.SOR.DSStormTrooper, 2)
      .AddCardToHand(2, cards.SOR.DisablingFF)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.BFMarine, 3)
      .AddUnit(1, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2).MultiChoiceButton(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .TargetTheirSpaceUnit(1).ChooseButton(1, 1)
      .RunAsync()
    ;
    //assert
    await gameplay.Assert()
      .TheirLeaderHasUsedEpicAction()
      .RunAsync()
    ;
    //act
    await gameplay
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      //next round
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader()
      .RunAsync()
    //assert
    gameplay.Assert()
      .NoMultiChoicePopup()
      .RunAsync()
    ;
  },
  Leia_Poe_Ejected_ground_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader, true)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.JTL.Leia)
      .AddUnit(1, cards.JTL.PoeLeaderUnit, false)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .TargetMyGroundUnit(1)
      .TargetTheirBase()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals('10')
      .MyBaseDamageEquals('8')
      .RunAsync()
    ;
  },
  Leia_Poe_deployed_ground_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader, true)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.JTL.Leia)
      .AddUnit(1, cards.JTL.PoeLeaderUnit, true)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .TargetMyGroundUnit(1)
      .TargetTheirBase()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals('10')
      .MyBaseDamageEquals('8')
      .RunAsync()
    ;
  },
  Leia_Poe_space_piloted_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader, true)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.JTL.Leia)
      .AddUnit(1, cards.JTL.XWing, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.PoeLeaderUnit, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .TargetMySpaceUnit(1)
      .TargetTheirBase()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals('10')
      .MyBaseDamageEquals('8')
      .RunAsync()
    ;
  },
  Sabines_Masterpiece: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(2, cards.SOR.BFMarine, 1)
      .AddUnit(1, cards.JTL.SabinesMP)
      .AddUnit(1, cards.SOR.Yoda)
      .AddUnit(1, cards.SOR.AdmiralAckbar)
      .AddUnit(1, cards.SOR.SabineUnit)
      .AddUnit(1, cards.SOR.MillenniumFalcon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMySpaceUnit(1)
      .ClickMySpaceUnit(1)
      .TargetTheirBase()
      .TargetMyGroundUnit(2)
      .TargetTheirBase()
      .MultiChoiceButton(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals('9')
      .MyBaseDamageEquals('7')
      .MyGroundUnitPieceEquals(2, 1, 'EXPERIENCE')
      .TheirResourcesEquals('0/1')
      .RunAsync()
    ;
  },
  Kazuda_Millennium_Falcon: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.KazudaLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddUnit(1, cards.SOR.MillenniumFalcon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).TargetMySpaceUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMySpaceUnit(1).ClickMySpaceUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('15')
      .TheirBaseDamageEquals('17')
      .MySpaceUnitIsThere(1)
      .MyResourcesEquals('3/3')
      .RunAsync()
    ;
  },
  Kazuda_Fireball: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 2")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.KazudaLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.DarthVaderLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.JTL.Fireball)
      .AddUnit(2, cards.JTL.TieBomber)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().ClickHandCard(1).ChooseYes()
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).PassTurn()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('7')
      .TheirBaseDamageEquals('8')
      .MyResourcesEquals('2/2')
      .MySpaceUnitPieceIsOverlay(1, 3)
      .TheirSpaceUnitPieceEquals(1, 3, '3')
      .RunAsync()
    ;
  },
  Kazuda_upgrade_bounties: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("10 12")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.KazudaLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.DarthVaderLeader)
      .AddResource(2, cards.SOR.Devastator, false)
      .AddCardToDeck(2, cards.SOR.OB, 2)
      .AddUnit(1, cards.SOR.BFMarine, false, true, 0,
        gameState.SubcardBuilder()
          .AddUpgrade(cards.SHD.PriceOnYourHead, 2)
          .AddUpgrade(cards.SHD.DeathMark, 2)
          .AddUpgrade(cards.SHD.GuildTarget, 2)
          .AddUpgrade(cards.SHD.Wanted, 2)
          .AddUpgrade(cards.SHD.TopTarget, 2)
          .Build())
      .AddUnit(2, cards.SOR.EscortSkiff, false, false, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1)
      .TargetMyGroundUnit(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsGone(1)
      .TheirGroundUnitIsGone(1)
      .TheirResourcesEquals('0/1')
      .TheirBaseDamageEquals('12')
      .MyBaseDamageEquals('10')
      .RunAsync()
    ;
  },
  Krennic_discounts_first_card_only: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.ThrawnLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.TWI.WTTradeOfficial)
      .AddCardToHand(1, cards.TWI.WTTradeOfficial)
      .AddUnit(1, cards.JTL.DirectorKrennic)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1)
    ;
    //assert
    gameplay.Assert()
      .MyResourcesEquals('0/3')
      .TheirResourcesEquals('2/2')
      .MyGroundUnitIsThere(3)
      .RunAsync()
    ;
  },
  Krennic_no_discount_after: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.ThrawnLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.TWI.WTTradeOfficial)
      .AddCardToHand(1, cards.JTL.DirectorKrennic)
      .AddCardToHand(1, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1)
    ;
    //assert
    gameplay.Assert()
      .MyResourcesEquals('1/5')
      .TheirResourcesEquals('2/2')
      .MyGroundUnitIsThere(2)
      .MyGroundUnitIsGone(3)
      .MyHandCardIsNotPlayable(1)
      .RunAsync()
    ;
  },
  // GIVEN: i have base generic.BlueBase; i have leader SHD.ReyLeader; they have base generic.RedBase; they have leader SHD.MandoLeader; i have SOR.R2D2 in play with an experience token; i have JTL.Hondo in play;;
  // WHEN: i attack with my second ground unit; i pass; i target my first ground unit; i choose button (1,1); i target my second ground unit;;
  // EXPECT: my first ground unit's first piece equals '1'; my second ground unit's first piece equals 'EXPERIENCE'; their base's damage equals '4';
  Hondo_on_attack: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SHD.ReyLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.SHD.MandoLeader)
      .AddUnit(1, cards.SOR.R2D2, false, true, 0,
        gameState.SubcardBuilder().AddExperience(1).Build())
      .AddUnit(1, cards.JTL.Hondo)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(1).AttackWithMyGroundUnit(2).TargetMyGroundUnit(1).ChooseButton(1, 1).TargetMyGroundUnit(2)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitPieceEquals(1, 1, '1')
      .MyGroundUnitPieceEquals(2, 1, 'EXPERIENCE')
      .TheirBaseDamageEquals('4')
      .RunAsync()
  },
  // GIVEN: i have base generic.BlueBase; i have leader SHD.ReyLeader; they have base generic.RedBase; they have leader SHD.MandoLeader; i have JTL.Hondo in play; they have JTL.TheGhost in play: not from epic action, ready, with 2 damage, with JTL.PhantomII owned by Player 2 as a pilot;;
  // WHEN: i attack with my first ground unit; i pass; i target their first space unit; i choose button (1,1); i pass;;
  // EXPECT: my first ground unit is there; their first space unit is there; their base's damage equals '3'; their first space unit's first piece equals 'PHANTOM II';
  Hondo_on_attack_Ghost_Phantom_cant: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SHD.ReyLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.SHD.MandoLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddUnit(1, cards.JTL.Hondo)
      .AddUnit(2, cards.JTL.TheGhost, false, true, 2,
        gameState.SubcardBuilder().AddPilot(cards.JTL.PhantomII, 2).Build()
      )
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(1).AttackWithMyGroundUnit(1).TargetTheirSpaceUnit(1).ChooseButton(1, 1).Pass()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(1)
      .TheirSpaceUnitIsThere(1)
      .TheirBaseDamageEquals('3')
      .TheirSpaceUnitPieceEquals(1, 1, 'PHANTOM II')
      .RunAsync()
    ;
  },
  // GIVEN: i have base generic.BlueBase; i have leader SHD.ReyLeader; they have base generic.RedBase; they have leader SHD.MandoLeader; i have JTL.Hondo in play; i have JTL.TheGhost in play; they have JTL.TheGhost in play: not from epic action, ready, with 2 damage, with JTL.PhantomII owned by Player 2 as a pilot;;
  // WHEN: i attack with my first ground unit; i pass; i target their first space unit; i choose button (1,1); i target my first space unit; i pass;;
  // EXPECT: my first ground unit is there; their first space unit is there; their base's damage equals '3'; my first space unit's first piece equals 'PHANTOM II'; their first space unit's first piece equals '5';;
  Hondo_on_attack_Ghost_Phantom_own_Ghost: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SHD.ReyLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.SHD.MandoLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddUnit(1, cards.JTL.Hondo)
      .AddUnit(1, cards.JTL.TheGhost)
      .AddUnit(2, cards.JTL.TheGhost, false, true, 2,
        gameState.SubcardBuilder().AddPilot(cards.JTL.PhantomII, 2).Build()
      )
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(1).AttackWithMyGroundUnit(1)
      .TargetTheirSpaceUnit(1).ChooseButton(1, 1).TargetMySpaceUnit(1).Pass()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(1)
      .TheirSpaceUnitIsThere(1)
      .TheirBaseDamageEquals('3')
      .MySpaceUnitPieceEquals(1, 1, 'PHANTOM II')
      .TheirSpaceUnitPieceEquals(1, 1, '5')
      .RunAsync()
    ;
  },
  Chewie_survives_SLB: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SOR.PalpLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.WedgeLeader)
      .FillResources(1, cards.SOR.BFMarine, 8)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.SLB)
      .AddUnitWithPilot(1, cards.JTL.TieBomber, cards.JTL.DarthVaderLeaderUnit, true)
      .AddUnit(2, cards.JTL.Chewbacca)
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
      .IHaveNoSpaceUnits().IHaveNoSpaceUnits()
      .TheyHaveNoSpaceUnits().TheirGroundUnitIsThere(1)
      .RunAsync()
    ;
  },
  Chewie_piloting_Traitorous_SLB: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SOR.PalpLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.WedgeLeader)
      .FillResources(1, cards.SOR.BFMarine, 13)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.Traitorous)
      .AddCardToHand(1, cards.SOR.SLB)
      .AddUnitWithPilot(2, cards.JTL.XWing, cards.JTL.Chewbacca)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert().WeHaveNoUnits();
  },
  R2D2_extra_pilot: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SHD.ReyLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.WedgeLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.JTL.Chewbacca)
      .AddUnitWithPilot(1, cards.JTL.XWing, cards.JTL.R2D2)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).MultiChoiceButton(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitPieceEquals(1, 1, 'CHEWBACCA')
      .MySpaceUnitPieceEquals(1, 2, 'R2-D2')
      .MySpaceUnitPieceEquals(1, 3, '6')
      .MySpaceUnitPieceEquals(1, 4, '6')
      .RunAsync()
    ;
  },
  R2D2_on_piloted: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SHD.ReyLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.WedgeLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.JTL.R2D2)
      .AddUnitWithPilot(1, cards.JTL.XWing, cards.JTL.Chewbacca)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).MultiChoiceButton(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitPieceEquals(1, 1, 'R2-D2')
      .MySpaceUnitPieceEquals(1, 2, 'CHEWBACCA')
      .MySpaceUnitPieceEquals(1, 3, '6')
      .MySpaceUnitPieceEquals(1, 4, '6')
      .RunAsync()
    ;
  },
  BB8_Black_Squad_Scout_Wing: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.WedgeLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.JTL.BB8)
      .AddUnit(1, cards.JTL.BlackSquadScoutWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMySpaceUnit().AttackWithMySpaceUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).ChooseYes()
      .Pass().ChooseYes().ChooseMultiImg(1).ChooseMultiImg(1).ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .TheirHandIsEmpty()
      .MySpaceUnitPieceEquals(1, 1, 'BB-8')
      .MySpaceUnitPieceEquals(1, 2, '5')
      .TheirBaseDamageEquals('10')
      .RunAsync()
    ;
  },
  Poe_unit_hops_on_XWing: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.WedgeLeader)
      .FillResources(1, cards.SOR.BFMarine, 4)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.JTL.PoeUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitPieceEquals(1, 1, 'POE DAMERON')
      .MySpaceUnitPieceEquals(1, 2, '4')
      .MySpaceUnitPieceEquals(1, 3, '5')
      .MyGroundUnitIsGone(1)
      .RunAsync()
  },
}