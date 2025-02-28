import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts,
  g,
} from '../utils/util'
import { GameState } from '../utils/gamestate'
import { cards } from '../utils/cards'
import { GamePlay } from '../utils/gameplay';

export const PilotJTLCases = {
  'Dengar not piloting, attacks for 5': process.env.FULL_REGRESSION !== 'true' ? '' : async function() {
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
  'Dengar as pilot, deals 2 indirect damage': process.env.FULL_REGRESSION !== 'true' ? '' : ''+async function() {//currently failing
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
  'Nien Nunb not piloting, gets buff' : async function() {
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
  'Nien Nunb as pilot, gives buff' : async function() {
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
  'Red Leader costs less and creates X-Wing on attach Pilot': async function() {
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
  'IG-88 pilot gives no buff if no damaged enemies': async function() {
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
  'IG-88 pilot gives buff if damaged enemies': async function() {
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
  'IG-88 ground unit not buffed if no damaged enemies': async function() {
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
  'IG-88 ground unit buffed if damaged enemies': async function() {
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
  'Unique Pilot upgrades should trigger uniqueness rule': async function() {
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
      .click(com.PilotYesNoButton("YES")).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'BOBA FETT');
  },
  'Unique Pilot unit should trigger uniqueness rule': async function() {
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
      .click(com.PilotYesNoButton("NO")).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), '1');
  },
  Poe_JTL_unit_then_pilot_then_other_unit: async function() {
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
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .MyGroundUnitIsThere(1)
        .MyGroundUnitIsGone(2)
        .RunAsync()
      ;
    });
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
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .MyGroundUnitIsThere(1)
        .MyGroundUnitPieceIsOverlay(1, 3)
        .RunAsync()
      ;
    });
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
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .TheirSpaceUnitIsThere(1)
        .MyGroundUnitIsThere(2)
        .RunAsync()
      ;
    });
  }
}