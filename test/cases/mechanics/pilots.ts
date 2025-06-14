import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts,
  g,
} from '@utils/util'
import { GameState } from '@utils/gamestate'
import { cards } from '@utils/cards'
import { GamePlay } from '@utils/gameplay';

export const PilotJTLCases = {
  Dengar_not_piloting_attacks_for_five: process.env.FULL_REGRESSION !== 'true' ? '' : async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .AddUnit(1, cards.JTL.Dengar)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.TheirBaseDamage, '5');
  },
  Dengar_as_pilot_deals_two_indirect_damage: process.env.FULL_REGRESSION !== 'true' ? '' : ''+async function() {//currently failing
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .AddUnit(1, cards.SOR.TieLnFighter, false, true, 0, gameState.SubcardBuilder().AddPilot(cards.JTL.Dengar, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.YesNoButton("YES"))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.TheirBaseDamage, '6');
  },
  Nien_Nunb_not_piloting_gets_buff : process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.JTL.BobaFettLeader, true)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .AddUnit(1, cards.JTL.NienNunb)
      .AddUnit(1, cards.JTL.Chewbacca)
      .AddUnit(1, cards.SOR.TieLnFighter, false, false, 0,
          gameState.SubcardBuilder().AddUpgrade(cards.JTL.Dengar, 1, true).Build())
      .AddUnit(1, cards.SOR.TieLnFighter, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.BobaFettLeader, 1, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), '4');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 2), '2');
  },
  Nien_Nunb_as_pilot_gives_buff : process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.JTL.BobaFettLeader, true)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .AddUnit(1, cards.JTL.Chewbacca)
      .AddUnit(1, cards.SOR.TieLnFighter, false, false, 0,
          gameState.SubcardBuilder().AddUpgrade(cards.JTL.NienNunb, 1, true).Build())
      .AddUnit(1, cards.SOR.TieLnFighter, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.BobaFettLeader, 1, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'NIEN NUNB');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 2), '5');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 3), '3');
  },
  Red_Leader_costs_less_and_creates_XWing_on_attach_Pilot: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader, true)
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.JTL.RedLeader)
      .AddCardToHand(1, cards.JTL.IndependentSmuggler)
      .AddUnit(1, cards.JTL.Chewbacca)
      .AddUnit(1, cards.SOR.TieLnFighter, false, false, 0,
          gameState.SubcardBuilder().AddUpgrade(cards.JTL.NienNunb, 1, true).Build())
      .AddUnit(1, cards.SOR.TieLnFighter, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.ClaimButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ClaimButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.YesNoButton("YES")).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.MyResources, '0/2');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(3), 1), 'INDEPENDENT SMUGGLER');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(3), 2), '4');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(3), 3), '5');
    customAsserts.AllySpaceUnitIsXWing(browser, 4);
  },
  IG88_pilot_no_buff_if_no_damaged_enemies: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .AddUnit(1, cards.JTL.TieFighter, false, true, 1,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.IG88, 1, true).Build())
      .AddUnit(2, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'IG-88');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 2), '1');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 3), '4');
  },
  IG88_pilot_gives_buff_if_damaged_enemies: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .AddUnit(1, cards.JTL.TieFighter, false, true, 1,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.IG88, 1, true).Build())
      .AddUnit(2, cards.JTL.XWing, false, true, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'IG-88');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 2), '4');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 3), '4');
  },
  IG88_ground_unit_not_buffed_if_no_damaged_enemies: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .AddUnit(1, cards.JTL.IG88, false, true, 1)
      .AddUnit(2, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), '4');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 2), '5');
  },
  IG88_ground_unit_buffed_if_damaged_enemies: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .AddUnit(1, cards.JTL.IG88, false, true, 1)
      .AddUnit(2, cards.JTL.XWing, false, true, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), '7');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 2), '5');
  },
  unique_pilot_upgrades_should_trigger_uniqueness_rule: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("20 4")
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.JTL.BobaFettUnit)
      .AddUnit(1, cards.JTL.TieFighter)
      .AddUnit(1, cards.JTL.BobaFettUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PilotOrUnitButton("Pilot")).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'BOBA FETT');
  },
  unique_pilot_unit_should_trigger_uniqueness_rule: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("20 4")
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.JTL.BobaFettUnit)
      .AddUnit(1, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.BobaFettUnit, 1, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), '1');
  },
  Poe_JTL_unit_then_pilot_then_other_unit: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 4")
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.JTL.WedgeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PoeUnit)
      .AddCardToHand(1, cards.SOR.CraftySmuggler)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(1, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseNo().ChooseYes().TargetMySpaceUnit(1)
      .SwitchPlayerWindow()
      .WaitForPassButton().PassTurn()
      .SwitchPlayerWindow()
      .WaitForMyHand()
      .PlayFromHand(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(1)
      .MyGroundUnitIsGone(2)
      .RunAsync()
    ;
  },
  Luke_JTL_pilot_unit_defeated_then_no_shield: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 11")
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SOR.LukeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 1)
      .FillResources(2, cards.SOR.BFMarine, 1)
      .AddCardToHand(2, cards.SOR.Confiscate)
      .AddUnit(1, cards.JTL.XWing, false, false, 0, gameState.SubcardBuilder().AddPilot(cards.JTL.LukeUnit, 1, false, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForPassButton().PassTurn()
      .SwitchPlayerWindow()
      .WaitForMyHand().PlayFromHand(1).ChooseButton(1, 1)
      .SwitchPlayerWindow()
      .ChooseYes()
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).TargetMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(1)
      .MyGroundUnitPieceIsOverlay(1, 3)
      .RunAsync()
    ;
  },
  Luke_pilot_controlled_drops_on_my_side: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 16")
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .FillResources(1, cards.SOR.BFMarine, 1)
      .AddCardToDeck(1, cards.SOR.BFMarine, 10)
      .AddCardToDeck(2, cards.SOR.BFMarine, 10)
      .AddCardToDiscard(1, cards.JTL.HoundsTooth)
      .AddUnit(1, cards.SOR.BFMarine)
      .AddUnit(2, cards.JTL.XWing, false, true, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SOR.Traitorous, 2).AddPilot(cards.JTL.LukeUnit, 1).Build(), 1)
      .AddCardToHand(1, cards.SOR.Confiscate)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseButton(2, 1).ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsThere(1)
      .MyGroundUnitIsThere(2)
      .RunAsync()
    ;
  },
  PadawanStarfighter_and_Traitorous_Kid_Anakin: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SOR.LukeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.Traitorous)
      .AddUnit(2, cards.TWI.PadawanStarfighter, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.KidAnakin, 2).Build())
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
      .TheirSpaceUnitIsGone(1)
      .MySpaceUnitPieceEquals(1, 3, '3')
      .MySpaceUnitPieceEquals(1, 4, '6')
      .RunAsync()
    ;
  },
  PadawanStarfighter_and_EotC_Kid_Anakin: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SOR.LukeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SHD.EvidenceOfTheCrime)
      .AddUnit(1, cards.TWI.PadawanStarfighter)
      .AddUnit(2, cards.JTL.XWing, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.KidAnakin, 2).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseButton(1, 1).TargetMySpaceUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsThere(1)
      .MySpaceUnitPieceEquals(1, 1, 'ANAKIN SKYWALKER')
      .MySpaceUnitPieceEquals(1, 2, '4')
      .MySpaceUnitPieceEquals(1, 3, '7')
      .RunAsync()
    ;
  },
  Black_One_and_Traitorous_Poe_pilot: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.Traitorous)
      .AddUnit(2, cards.SOR.DisablingFF)
      .AddUnit(2, cards.JTL.BlackOne, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.PoeUnit, 2).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetTheirSpaceUnit(2)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMySpaceUnit(1).AttackWithMySpaceUnit(1).TargetTheirBase()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsGone(2)
      .MySpaceUnitPieceEquals(1, 1, 'TRAITOROUS')
      .TheirBaseDamageEquals('5')
  },
  Luke_pilot_taken_control_drops_on_their_side: async function() {//currently failing
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SOR.PalpLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.LukeLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .FillResources(2, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.SHD.EvidenceOfTheCrime)
      .AddCardToHand(2, cards.SOR.OpenFire)
      .AddUnit(1, cards.JTL.TieFighter)
      .AddUnitWithPilot(2, cards.JTL.XWing, cards.JTL.LukeUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseButton(1, 1).TargetMySpaceUnit(1)
      .SwitchPlayerWindow().PlayFromHand(1).TargetTheirSpaceUnit(1)
      .SwitchPlayerWindow().ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsThere(1)
      .MySpaceUnitIsGone(1)
      .MyGroundUnitIsThere(1)
      .RunAsync()

  }
}