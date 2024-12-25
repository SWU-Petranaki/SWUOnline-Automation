import {
    com, p,
    LoadTestGameStateAsync,
    player1Window, player2Window
} from '../../utils/util';

export const AmbushCases = {
  'Ambush: ECL Sabine Ping Shield': async function () {
        await LoadTestGameStateAsync('ambush/sabine-ping-shield');

        await browser
        .window.switchTo(player2Window)
        .waitForElementPresent(com.MyHand)
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.Base(2))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.HandCard(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.AllyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.YesNoButton("YES")).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        ;

         await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
         await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '2');
    },
    'Ambush: Rukh into Krayt Dragon with ECL': async function () {
        await LoadTestGameStateAsync('ambush/rukh-krayt');

        await browser.waitForElementPresent(com.MyHand)
          .click(com.Base(1))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
          .click(com.HandCard(1))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
          .click(com.PassButton).pause(p.ButtonPress)
          .click(com.PassButton).pause(p.ButtonPress)
          .click(com.YesNoButton("YES")).pause(p.ButtonPress)
          .click(com.EnemyGroundUnit(1))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        ;

        await browser.window.switchTo(player2Window)
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
          .click(com.EnemyGroundUnit(1))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)

        await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
        await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '5');
    },
    'Ambush: Rukh into Krayt Dragon with TI': async function () {
      await LoadTestGameStateAsync('ambush/rukh-krayt');

        await browser.waitForElementPresent(com.MyHand)
          .click(com.HandCard(2))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
          .click(com.HandCard(1))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
          .click(com.PassButton).pause(p.ButtonPress)
          .click(com.PassButton).pause(p.ButtonPress)
          .click(com.PassButton).pause(p.ButtonPress)
          .click(com.YesNoButton("YES")).pause(p.ButtonPress)
          .click(com.EnemyGroundUnit(1))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
          .click(com.PassButton).pause(p.ButtonPress)
        ;

        await browser.window.switchTo(player2Window)
          .refresh()
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
          .click(com.EnemyGroundUnit(1))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
          .click(com.EnemyGroundUnit(1))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)

        await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
        await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
    },
}