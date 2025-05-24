import {
  com, p,
  player1Window, player2Window,
  gameName
} from '@utils/util';
import { GameState } from '@utils/gamestate';
import { cards } from '@utils/cards';

export const ReadyCases = {
  'Its A Trap!': async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.JTL.ItsATrap)
      .AddUnit(1, cards.SOR.TieLnFighter, false, false)
      .AddUnit(1, cards.SOR.TieLnFighter, false, false)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //pre-check
    await browser.assert.elementPresent(com.AllySpaceUnit(1, true));
    await browser.assert.elementPresent(com.AllySpaceUnit(2, true));
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.AllySpaceUnit(1, true));
    await browser.assert.not.elementPresent(com.AllySpaceUnit(2, true));
  },
  'Its A Trap! fails on more': process.env.FULL_REGRESSION !== "true" ? '' : async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.JTL.ItsATrap)
      .AddUnit(1, cards.SOR.TieLnFighter, false, false)
      .AddUnit(1, cards.SOR.TieLnFighter, false, false)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //pre-check
    await browser.assert.elementPresent(com.AllySpaceUnit(1, true));
    await browser.assert.elementPresent(com.AllySpaceUnit(2, true));
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.AllySpaceUnit(1, true));
    await browser.assert.elementPresent(com.AllySpaceUnit(2, true));
  },
  'Its A Trap! fails on equal': process.env.FULL_REGRESSION !== "true" ? '' : async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.JTL.ItsATrap)
      .AddUnit(1, cards.SOR.TieLnFighter, false, false)
      .AddUnit(1, cards.SOR.TieLnFighter, false, false)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //pre-check
    await browser.assert.elementPresent(com.AllySpaceUnit(1, true));
    await browser.assert.elementPresent(com.AllySpaceUnit(2, true));
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.AllySpaceUnit(1, true));
    await browser.assert.elementPresent(com.AllySpaceUnit(2, true));
  }
}