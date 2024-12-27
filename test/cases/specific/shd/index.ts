import {
    com, p,
    LoadTestGameStateAsync,
    player1Window, player2Window
} from '../../../utils/util';

export const SpecificSHDCases = {
  'Lurking TIE: avoids enemy capture': async function() {
    await LoadTestGameStateAsync('specific/shd/lurking-tie');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1)[0];
    await browser.assert.equal(lastLog, 'Lurking TIE Phantom avoided capture.');
  },
  'Lurking TIE: avoids enemy damage': async function() {
    await LoadTestGameStateAsync('specific/shd/lurking-tie');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.attributeEquals(com.UnitDivPiece(com.EnemySpaceUnit(1), 3), 'class', 'overlay');
  },
  'Lurking TIE: defeats (merciless contest)': async function() {
    await LoadTestGameStateAsync('specific/shd/lurking-tie');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.AllySpaceUnit(1))
    ;

    await browser.window.switchTo(player1Window).refresh();

    await browser.assert.not.elementPresent(com.AllySpaceUnit(2));
    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1)[0];
    await browser.assert.equal(lastLog, 'Lurking TIE Phantom cannot be defeated by enemy card effects.');
  },
  'Lurking TIE: damaged by self': async function() {
    await LoadTestGameStateAsync('specific/shd/lurking-tie');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 3), '1');
  },
  'Lurking TIE: bounced by enemy': async function() {
    await LoadTestGameStateAsync('specific/shd/lurking-tie');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.elementsCount(com.TheirHandDivs, 2);
  },
  'Lurking TIE: bounced by self': async function() {
    await LoadTestGameStateAsync('specific/shd/lurking-tie');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.HandCard(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(com.AllySpaceUnit(2));
    await browser.assert.elementsCount(com.MyHandDivs, 4);
  },
}