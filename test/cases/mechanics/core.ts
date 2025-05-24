import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  src
} from '@utils/util';

export const CoreMechanicsCases = {
  // GIVEN: bases are set to "9 16"; i have base SHD.JabbasPalace; i have leader TWI.YodaLeader; they have base SOR.EchoBase; they have leader JTL.HanSoloLeader; i have 3 SOR.CraftySmuggler in my resources; they have 2 SOR.CraftySmuggler in their resources; i have a TWI.PerilousPosition in hand; they have a SOR.CraftySmuggler in hand;;
  // WHEN: i pass; switch player window; i play the first card from my hand; switch player window; i play the first card from my hand; switch player window; open my discard pile;;
  // EXPECT: we have no units; my discard count is 1; their discard count is 1; SOR.CraftySmuggler is in my discard pile;;
  cards_go_in_discard: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('9 16')
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.TWI.YodaLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 3)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.TWI.PerilousPosition)
      .AddCardToHand(2, cards.SOR.CraftySmuggler)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForPassButton().Pass()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1)
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1)
      .SwitchPlayerWindow().OpenMyDiscard()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .WeHaveNoUnits()
      .TheirDiscardCountEquals(1)
      .MyDiscardCountEquals(1)
      .MyDiscardCardIs(1, cards.SOR.CraftySmuggler)
      .RunAsync()
    ;
  },
  // GIVEN: bases are set to "1 8"; i have base SHD.JabbasPalace; i have leader TWI.YodaLeader; they have base SOR.EchoBase; they have leader JTL.HanSoloLeader; i have 3 SOR.CraftySmuggler in my resources; they have 2 SOR.CraftySmuggler in their resources; i have a SOR.EzraBridger in hand; i have 2 SOR.CraftSmuggler units in play; i have a SOR.EzraBridger unit in play;;
  // WHEN: i play the first card from my hand; i target my 4th ground unit; i target my discard pile;;
  // EXPECT: i only have 3 ground units; their discard pile is empty; my discard count is 1; SOR.EzraBridger is in my discard pile; my resources are 0/3;;
  unique_units_trigger_uniqueness_rule: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('1 8')
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.TWI.YodaLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 3)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SOR.EzraBridger)
      .AddUnit(1, cards.SOR.CraftySmuggler)
      .AddUnit(1, cards.SOR.CraftySmuggler)
      .AddUnit(1, cards.SOR.EzraBridger)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetMyGroundUnit(4).TargetMyDiscard()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsGone(4)
      .TheirDiscardIsEmpty()
      .MyDiscardCountEquals(1)
      .MyDiscardCardIs(1, cards.SOR.EzraBridger)
      .MyResourcesEquals("0/3")
      .RunAsync()
    ;
  },
  // GIVEN: bases are set to "5 5"; i have base SHD.JabbasPalace; i have leader JTL.PoeLeader deployed; they have base SOR.EchoBase; they have leader JTL.HanSoloLeader; i have 2 SOR.CraftySmuggler in my resources; they have 2 SOR.CraftySmuggler in their resources; i have a SOR.GreenSquadAWing in hand; they have a SHD.MercenaryGunship in play: not from epic action, ready, with 0 damage, with JTL.PoeLeader owned by Player 1 as a Pilot, owned by Player 1;;
  // WHEN: i play the first card from my hand;;
  // EXPECT: my first space unit is there; my resources are 0/2;;
  leader_upgrade_under_their_control_aspects: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('5 5')
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.JTL.PoeLeader, true)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SOR.GreenSquadAWing)
      .AddUnit(2, cards.SHD.MercenaryGunship, false, true, 0, gameState.SubcardBuilder().AddPilot(cards.JTL.PoeLeader, 1).Build(), 1)
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
      .MySpaceUnitIsThere(1)
      .MyResourcesEquals("0/2")
      .RunAsync()
    ;
  },
  // GIVEN: bases are set to "5 5"; i have base generic.GreenBase; i have leader SHD.FinnLeader; they have base SOR.EchoBase; they have leader JTL.HanSoloLeader; i have 8 SOR.BFMarine in my resources; they have 2 SOR.BFMarine in their resources; i have a JTL.NienNunb in hand; i have a JTL.PaigeTico in hand; i have a JTL.Chewbacca in hand; i have 2 JTL.XWing in play;;
  // WHEN: i activate my leader; i choose the first multichoice button; i target my first space unit; switch player window; i claim initiative; switch player window; i play the first card from my hand; i choose no; i play the first card from my hand; i choose yes; i target my second space unit; i target my first hand card; i choose no;;
  // THEN: my first space unit is there; my second space unit is there; my first ground unit is there; my second ground unit is there; my resources are 0/8; their resources are 2/2; my discard pile is empty; their discard pile is empty;;
  piloting_yes_then_no: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('5 5')
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SHD.FinnLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 8)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.JTL.NienNunb)
      .AddCardToHand(1, cards.JTL.PaigeTico)
      .AddCardToHand(1, cards.JTL.Chewbacca)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(1, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).TargetMySpaceUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).ChooseNo()
      .PlayFromHand(1).ChooseYes().TargetMySpaceUnit(2).TargetMyHandCard(1).ChooseNo()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsThere(1)
      .MySpaceUnitIsThere(2)
      .MyGroundUnitIsThere(1)
      .MyGroundUnitIsThere(2)
      .MyResourcesEquals("0/8")
      .TheirResourcesEquals("2/2")
      .MyDiscardIsEmpty()
      .TheirDiscardIsEmpty()
      .RunAsync()
    ;
  },
  // GIVEN: bases are set to "8 22"; i have base generic.YellowBase; i have leader JTL.BobaFettLeader; they have base generic.BlueBase; they have leader JTL.HanSoloLeader; i have 3 SOR.DSStormTrooper in my resources; they have 3 SOR.CraftySmuggler in their resources; i have a JTL.BobaFettUnit in hand; i have a JTL.FOStormTrooper in hand; they have a TWI.PerilousPosition in hand; i have 2 JTL.TieFighter in play; they have a SOR.CraftySmuggler in play;;
  // WHEN: i play the first card from my hand; i choose yes; i target my second space unit; i target their first ground unit; i choose no; switch player window; i play the first card from my hand; i target their second space unit; switch player window; i play the first card from my hand;;
  // EXPECT: my first space unit is there; my second space unit is there; my first ground unit is there; their first ground unit is there; my resources are 0/3; their resources are 0/3;;
  piloting_yes_then_regular_unit_after_triggers: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('8 22')
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 3)
      .FillResources(2, cards.SOR.CraftySmuggler, 3)
      .AddCardToHand(1, cards.JTL.BobaFettUnit)
      .AddCardToHand(1, cards.JTL.FOStormTrooper)
      .AddCardToHand(2, cards.TWI.PerilousPosition)
      .AddUnit(1, cards.JTL.TieFighter)
      .AddUnit(1, cards.JTL.TieFighter)
      .AddUnit(2, cards.SOR.CraftySmuggler)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseYes().TargetMySpaceUnit(2).TargetTheirGroundUnit(1).ChooseNo()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).TargetTheirSpaceUnit(2)
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsThere(1)
      .MySpaceUnitIsThere(2)
      .MyGroundUnitIsThere(1)
      .TheirGroundUnitIsThere(1)
      .MyResourcesEquals("0/3")
      .TheirResourcesEquals("0/3")
      .RunAsync()
    ;
  },
  // GIVEN: bases are set to "3 10"; i have base generic.GreenBase; i have leader JTL.KazudaLeader; they have base SOR.EchoBase; they have leader JTL.HanSoloLeader; i have 2 SOR.BFMarine in my resources; they have 2 SOR.BFMarine in their resources; i have 2 SOR.BFMarine in deck; i have a JTL.HanSoloUnit in hand; they have a JTL.XWing in play: not from epic action, not ready, with 0 damage, with SHD.BHQuarry owned by Player 1 as an Upgrade; i have a JTL.MillenniumFalcon in play;;
  // WHEN: i play the first card from my hand; i choose yes; i choose yes; i target their first space unit; i pass; i wait for checkboxes; i check the first checkbox; i submit;;
  // EXPECT: my first space unit is there; their first space unit is gone; my first ground unit is there;;
  piloting_layers: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('3 10')
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.JTL.KazudaLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.JTL.HanSoloUnit)
      .AddUnit(2, cards.JTL.XWing, false, false, 0, gameState.SubcardBuilder().AddUpgrade(cards.SHD.BHQuarry, 1).Build())
      .AddUnit(1, cards.JTL.MillenniumFalcon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseYes().ChooseYes().TargetTheirSpaceUnit(1).Pass().WaitForCheckboxes().Check(1).Submit()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsThere(1)
      .TheirSpaceUnitIsGone(1)
      .MyGroundUnitIsThere(1)
      .RunAsync()
    ;
  },
}