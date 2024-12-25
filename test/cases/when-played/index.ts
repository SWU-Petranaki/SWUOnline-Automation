import {
    com, p,
    LoadTestGameStateAsync,
    player1Window, player2Window
} from '../../utils/util';

export const WhenPlayedCases = {
    'When Played: U-Wing Many Played': async function () {
        await LoadTestGameStateAsync('when-played/uwing-manyplayed');

        await browser
        .waitForElementPresent(com.MyHand)
        .click(com.HandCard(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.Checkbox(3)).pause(p.CheckBox)
        .click(com.Checkbox(5)).pause(p.CheckBox)
        .click(com.Checkbox(8)).pause(p.CheckBox)
        .click(com.SubmitButton).pause(p.ButtonPress)
        .click(com.AllyGroundUnit(3))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.PassButton).pause(p.ButtonPress)
        .click(com.PassButton).pause(p.ButtonPress)
        .click(com.AllyGroundUnit(4))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.PassButton).pause(p.ButtonPress)
        .click(com.TopBottomButton(1, 2)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.YesNoButton("YES")).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.Checkbox(1)).pause(p.CheckBox)
        .click(com.SubmitButton).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        ;

        await browser.assert.not.elementPresent(com.EnemyGroundUnit(2));
        await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(3), 3), '2');
        await browser.assert.attributeEquals(com.HandCardImg(4), 'alt', 'Admiral Ackbar');
    },
    'When Played: Darth Vader multi then draw': async function () {
        await LoadTestGameStateAsync('when-played/vader-bottom-deck');

        await browser.waitForElementPresent(com.MyHand)
          .click(com.HandCard(1))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
          .click(com.PassButton).pause(p.ButtonPress)
          .click(com.Checkbox(1)).pause(p.CheckBox)
          .click(com.Checkbox(9)).pause(p.CheckBox)
          .click(com.SubmitButton).pause(p.ButtonPress)
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
          .click(com.YesNoButton("YES")).pause(p.ButtonPress)
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
          .click(com.EnemyGroundUnit(1))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        ;

        await browser.window.switchTo(player2Window)
          .waitForElementPresent(com.ClaimButton)
          .click(com.ClaimButton).pause(p.ButtonPress)
        ;

        await browser.window.switchTo(player1Window)
          .waitForElementPresent(com.MyHand)
          .click(com.HandCard(1))
          .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        ;

        await browser.assert.not.elementPresent(com.EnemyGroundUnit(2));
        await browser.assert.elementPresent(com.AllyGroundUnit(2));
        await browser.assert.elementPresent(com.AllyGroundUnit(3));
        await browser.assert.elementPresent(com.AllyGroundUnit(4));
        await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 3), '3');
        await browser.assert.attributeEquals(com.HandCardImg(1), 'alt', 'Phase-III Dark Trooper');
    }
}