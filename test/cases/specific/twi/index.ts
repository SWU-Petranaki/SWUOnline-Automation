import {
    com, p,
    LoadTestGameStateAsync,
    player1Window, player2Window
} from '../../../utils/util';

export const SpecificTWICases = {
  'Exploit: Red Dooku TWI and triggers': async function() {
    await LoadTestGameStateAsync('specific/twi/dooku-exploit-2units');

    await browser
    .waitForElementPresent(com.MyHand)
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.HandCard(3))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    .click(com.Checkbox(1)).pause(p.CheckBox)
    .click(com.Checkbox(2)).pause(p.CheckBox)
    .click(com.SubmitButton).pause(p.ButtonPress)
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.EnemySpaceUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    .pause(p.WaitToChooseTarget)
    .click(com.EnemyGroundUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    .click(com.PassButton).pause(p.ButtonPress)
    .click(com.YesNoButton('NO')).pause(p.ButtonPress)
    .click(com.PassButton).pause(p.ButtonPress)
    ;

    const expectDooku = com.EnemyGroundUnit(1);

    await browser.window.switchTo(player2Window)
      .waitForElementPresent(expectDooku)
      .click(expectDooku)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.YesNoButton('NO')).pause(p.ButtonPress)
      .click(com.YesNoButton('YES')).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(expectDooku)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.YesNoButton('NO')).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(expectDooku)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.YesNoButton('NO')).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player1Window)
      .waitForElementPresent(com.ClaimButton)
      .click(com.ClaimButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window)
      .waitForElementPresent(com.MyHand)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(expectDooku)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(expectDooku);
  },
  'On Attack: Maul TWI': async function () {
    await LoadTestGameStateAsync('specific/twi/maul-multi');

    await browser
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.AllyGroundUnit(4))
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.ButtonInputChoice(2)).pause(p.ButtonPress)
    .click(com.Checkbox(1)).pause(p.CheckBox)
    .click(com.Checkbox(2)).pause(p.CheckBox)
    .click(com.SubmitButton).pause(p.ButtonPress)
    .click(com.PassButton).pause(p.ButtonPress)
    ;

    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(4), 3), '2');
    const droid1 = com.EnemyGroundUnit(1);
    const droid2 = com.EnemyGroundUnit(2);
    await browser.assert.elementPresent(droid1);
    await browser.assert.textEquals(com.UnitDivPiece(droid1, 1), '1');
    await browser.assert.textEquals(com.UnitDivPiece(droid1, 2), '1');
    await browser.assert.elementPresent(droid2);
    await browser.assert.textEquals(com.UnitDivPiece(droid2, 1), '1');
    await browser.assert.textEquals(com.UnitDivPiece(droid2, 2), '1');
  },
  'On Attack: Maul TWI single target available': async function () {
    await LoadTestGameStateAsync('specific/twi/maul-single');

    await browser.waitForElementPresent(com.AllyGroundUnit(1))
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonInputChoice(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '3');
  },
  'On Attack: Maul TWI single target choice': async function () {
    await LoadTestGameStateAsync('specific/twi/maul-choose-single');

    await browser.waitForElementPresent(com.AllyGroundUnit(1))
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonInputChoice(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(com.EnemyGroundUnit(2));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '3');
  },
  'On Attack: Maul TWI sentinels': async function () {
    await LoadTestGameStateAsync('specific/twi/maul-sentinels');

    await browser.waitForElementPresent(com.AllyGroundUnit(1))
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 1), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 2), '1');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '');
    await browser.assert.attributeEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), 'class', 'overlay');
  },
  'On Attack: Maul TWI single sentinel': async function () {
    await LoadTestGameStateAsync('specific/twi/maul-sentinel-single');

    await browser.waitForElementPresent(com.AllyGroundUnit(1))
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(com.EnemyGroundUnit(2));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '3');
  },
  'Shadowed Intentions: avoids enemy capture': async function() {
    await LoadTestGameStateAsync('specific/twi/shadowed-intentions');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1)[0];
    await browser.assert.equal(lastLog, 'Greedo Slow on the Draw avoided capture.');
  },
  'Shadowed Intentions: enemy damage': async function() {
    await LoadTestGameStateAsync('specific/twi/shadowed-intentions');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 5), '1');
  },
  'Shadowed Intentions: defeats (merciless contest)': async function() {
    await LoadTestGameStateAsync('specific/twi/shadowed-intentions');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.AllyGroundUnit(1))
    ;

    await browser.window.switchTo(player1Window).refresh();

    await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1)[0];
    await browser.assert.equal(lastLog, 'Greedo Slow on the Draw cannot be defeated by enemy card effects.');
  },
  'Shadowed Intentions: damaged by self': async function() {
    await LoadTestGameStateAsync('specific/twi/shadowed-intentions');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 5), '1');
  },
  'Shadowed Intentions: bounced by enemy': async function() {
    await LoadTestGameStateAsync('specific/twi/shadowed-intentions');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.elementsCount(com.TheirHandDivs, 1);
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1)[0];
    await browser.assert.equal(lastLog, 'Greedo Slow on the Draw avoided bounce.');
  },
  'Shadowed Intentions: bounced by self': async function() {
    await LoadTestGameStateAsync('specific/twi/shadowed-intentions');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.elementsCount(com.MyHandDivs, 4);
  },
}