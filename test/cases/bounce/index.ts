import {
  com, p,
  LoadTestGameStateAsync,
  player1Window, player2Window
} from '../../utils/util';

export const BounceCases = {
  'Bounce: Waylay Tokens': async function () {
    await LoadTestGameStateAsync('bounce/waylay-tokens');

    await browser.waitForElementPresent(com.MyHand)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window)
      .waitForElementPresent(com.ClaimButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.ClaimButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player1Window)
      .waitForElementPresent(com.MyHand)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.not.elementPresent(com.TheirHandDivs);
  },
}