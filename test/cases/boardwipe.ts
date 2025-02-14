import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName
} from '../utils/util';

export const BoardWipeCases = {
  'Iden Versio Leader Unit SLB': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 9")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.IdenLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 8)
      .AddCardToHand(1, cards.SOR.SLB)
      .AddUnit(1, cards.SOR.IdenLeaderUnit, true)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.AdmiralAckbar, true, false, 0, gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '15');
    await browser.assert.textEquals(com.TheirBaseDamage, '9');
  },
  'Iden Versio Leader Unit SLB Two Idens': process.env.FULL_REGRESSION !== 'true' ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 20")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.IdenLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.IdenLeader, true)
      .FillResources(1, cards.SOR.CraftySmuggler, 8)
      .AddCardToHand(1, cards.SOR.SLB)
      .AddUnit(1, cards.SOR.IdenLeaderUnit, true)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.IdenLeaderUnit, true, true, 0, gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '17');
    await browser.assert.textEquals(com.TheirBaseDamage, '18');
  },
  'Iden Versio Leader Unit Christophsis': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 9")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.IdenLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 15)
      .AddCardToHand(1, cards.TWI.Christophsis)
      .AddUnit(1, cards.SOR.IdenLeaderUnit, true)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.AdmiralAckbar, true, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '15');
    await browser.assert.textEquals(com.TheirBaseDamage, '9');
  },
  'Iden Versio Leader Unit Christophsis Two Idens': process.env.FULL_REGRESSION !== 'true' ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 20")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.IdenLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.IdenLeader, true)
      .FillResources(1, cards.SOR.CraftySmuggler, 15)
      .AddCardToHand(1, cards.TWI.Christophsis)
      .AddUnit(1, cards.SOR.IdenLeaderUnit, true)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.IdenLeaderUnit, true, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '17');
    await browser.assert.textEquals(com.TheirBaseDamage, '20');
  },
  'Gideon Hask gives XP to rescued captive': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 9")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.KrennicLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 8)
      .AddCardToHand(1, cards.SOR.SLB)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(1, cards.SOR.GideonHask)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter, true, false, 0,
        gameState.SubcardBuilder().AddCaptive(cards.SOR.CraftySmuggler, 1).Build())
      .AddUnit(2, cards.SOR.AdmiralAckbar, true, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 2), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 4), '5');
  },
  'Two Gideon Hasks give XP to rescued captives': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 9")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.KrennicLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 8)
      .AddCardToHand(1, cards.SOR.SLB)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(1, cards.SOR.GideonHask)
      .AddUnit(1, cards.SOR.DarthVader, true, false, 0,
        gameState.SubcardBuilder().AddCaptive(cards.SOR.BFMarine, 2).Build())
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter, true, false, 0,
        gameState.SubcardBuilder().AddCaptive(cards.SOR.CraftySmuggler, 1).Build())
      .AddUnit(2, cards.SOR.AdmiralAckbar, true, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .AddUnit(2, cards.SOR.GideonHask)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.TheirBaseDamage, '20');
    await browser.assert.textEquals(com.MyBaseDamage, '9');

    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 2), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 4), '6');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 1), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 2), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 4), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 5), '6');
  }
}