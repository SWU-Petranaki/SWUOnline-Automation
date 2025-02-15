import { cards } from '../../utils/cards';
import { GameState } from '../../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '../../utils/util';


export const SpecificJTLCases = {
  'Poe Leader: mass testing interactions': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader, true)
      .AddCardToDeck(1, cards.SOR.BFMarine, 20)
      .AddCardToDeck(2, cards.SOR.BFMarine, 20)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(1, cards.JTL.XWing, false, false, 0)
      .AddUnit(1, cards.JTL.XWing, false, true, 0, gameState.SubcardBuilder().AddPilot(cards.JTL.R2D2, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.IG88, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.PalpUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(2), 1), 'POE DAMERON')
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'POE DAMERON');
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .pause(p.WaitToBegin)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.AllySpaceUnit(1));
    //act
    await browser
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //pre-assert
    await browser.assert.not.elementPresent(com.Leader(1));
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.Leader(1));
    //act
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.Leader(1));
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.Leader(1));
    //act
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(2), 1), 'R2-D2');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), '2');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 2), '2');
    //act
    await browser
      .waitForElementPresent(com.ClaimButton)
      .moveToElement(com.ClaimButton, 0, 0).pause(p.Move)
      .click(com.ClaimButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'POE DAMERON');
  },
  'Poe Leader: Eject combo': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader, true)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.JTL.Eject)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(1, cards.JTL.XWing, false, false, 0)
      .AddUnit(1, cards.JTL.XWing, false, true, 0, gameState.SubcardBuilder().AddPilot(cards.JTL.R2D2, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.IG88, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.PalpUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
      await browser
      .waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(2), 1), 'POE DAMERON')
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ChooseButton(1, 1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
  },
  'Poe Leader: Eject combo; defeated still deploys': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader, true)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.JTL.Eject)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(1, cards.JTL.XWing, false, false, 0)
      .AddUnit(1, cards.JTL.XWing, false, true, 0, gameState.SubcardBuilder().AddPilot(cards.JTL.R2D2, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.IG88, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.PalpUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
      await browser
      .waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(2), 1), 'POE DAMERON')
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ChooseButton(1, 1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
    await customAsserts.UnitIs(browser, cards.JTL.PoeLeaderUnit, com.AllyGroundUnit(1));
  },
  'Eject: Set 4 pilot leader used epic action': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.WedgeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.JTL.Eject)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(2, "8540765053")
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(3)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ChooseButton(1, 1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await customAsserts.LeaderEpicActionUsed(browser, 1);
  }
}