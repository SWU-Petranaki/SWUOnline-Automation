import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts,
} from '../utils/util'
import { GameState } from '../utils/gamestate'
import { cards } from '../utils/cards'

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
      .AddUnit(1, cards.SOR.TieLnFighter, true, 0, `${cards.JTL.Dengar},1,1,100`)
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
      .AddUnit(1, cards.SOR.TieLnFighter, false, 0,
          gameState.SubcardBuilder().AddUpgrade(cards.JTL.Dengar, 1, true).Build())
      .AddUnit(1, cards.SOR.TieLnFighter, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.BobaFettLeader, 1, true).Build())
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
      .AddUnit(1, cards.SOR.TieLnFighter, false, 0,
          gameState.SubcardBuilder().AddUpgrade(cards.JTL.NienNunb, 1, true).Build())
      .AddUnit(1, cards.SOR.TieLnFighter, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.BobaFettLeader, 1, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'NIEN NUNB LOYAL CO-PILOT');
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
      .AddUnit(1, cards.SOR.TieLnFighter, false, 0,
          gameState.SubcardBuilder().AddUpgrade(cards.JTL.NienNunb, 1, true).Build())
      .AddUnit(1, cards.SOR.TieLnFighter, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
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
      .AddUnit(1, cards.JTL.TieFighter, true, 1,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.IG88, 1, true).Build())
      .AddUnit(2, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'IG-88 MURDEROUS PHLUTDROID');
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
      .AddUnit(1, cards.JTL.TieFighter, true, 1,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.IG88, 1, true).Build())
      .AddUnit(2, cards.JTL.XWing, true, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'IG-88 MURDEROUS PHLUTDROID');
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
      .AddUnit(1, cards.JTL.IG88, true, 1)
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
      .AddUnit(1, cards.JTL.IG88, true, 1)
      .AddUnit(2, cards.JTL.XWing, true, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), '7');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 2), '5');
  }
}