import {
    com, p, src,
    LoadTestGameStateAsync,
    player1Window, player2Window
} from '../../utils/util';

export const LeaderAbilitySORCases = {
  'Leader Ability: Director Krennic passive buff': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/krennic-passive');

    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '1');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), '2');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 3), '1');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 1), '2');
  },
  'Leader Ability: Iden Versio heal if enemy defeated': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/iden-versio-heal');

    await browser.waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin)
      .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
    ;

    await browser.assert.textEquals(com.MyBaseDamage, '4');
  },
  'Leader Ability: Chewbacca taunt': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/chewbacca-taunt');

    await browser.waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.attributeContains(com.UnitDivPiece(com.AllySpaceUnit(1), 3), 'style', src.SentinelToken);
  },
  'Leader Ability: Chirrut Imwe buff': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/chirrut-buff');

    await browser.waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 2), '5');
  },
  'Leader Ability: Luke Shield fails': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/luke-shield');

    await browser.waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    ;

    await browser.assert.attributeEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), 'class', 'overlay');
    await browser.assert.attributeEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 3), 'class', 'overlay');
    await browser.assert.textEquals(com.MyResources, '3/4');
  },
  'Leader Ability: Luke Shield': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/luke-shield');

    await browser.waitForElementPresent(com.MyHand)
      .click(com.HandCard(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.TopBottomButton(1, 1)).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window)
      .waitForElementPresent(com.PassButton)
      .click(com.PassButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player1Window)
      .waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.attributeContains(com.UnitDivPiece(com.AllyGroundUnit(3), 3), 'style', src.ShieldToken);
    await browser.assert.textEquals(com.MyResources, '2/4');
  },
  'Leader Ability: Palp fails': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/palp-fails');

    await browser.waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '4');
    await browser.assert.elementsCount(com.MyHandDivs, 5);
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-2)[0];
    await browser.assert.equal(lastLog, 'You don\'t control enough resources to deploy that leader; reverting the game state.');
  },
  'Leader Ability: Palp destroy, ping, and draw': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/palp-ping');

    await browser.waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 4), '1');
    await browser.assert.elementsCount(com.MyHandDivs, 6);
    await browser.assert.textEquals(com.MyResources, '3/4');
  },
  'Leader Ability: Tarkin fails': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/tarkin-fails');

    await browser.waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
    ;

    await browser.assert.attributeEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 3), 'class', 'overlay');
    await browser.assert.textEquals(com.MyResources, '3/4');
  },
  'Leader Ability: Tarkin xp': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/tarkin-xp');

    await browser.waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 2), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 3), '2');
    await browser.assert.textEquals(com.MyResources, '3/4');
  },
  'Leader Ability: Hera ignore aspect': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/hera-ignore-aspect');

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.textEquals(com.MyResources, '0/4');
  },
  'Leader Ability: Leia attacks on base': async function () {
    await LoadTestGameStateAsync('leader-ability-sor/leia-attacks');

    await browser
      .waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.textEquals(com.TheirBaseDamage, '2');
  },
  'Leader Ability: Leia attacks on same unit': async function () {
      await LoadTestGameStateAsync('leader-ability-sor/leia-attacks');

      await browser
        .waitForElementPresent(com.Leader(1))
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.AllyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .pause(p.WaitForEffect)
      ;

      await browser.window.switchTo(player2Window)
        .waitForElementPresent(com.MyHand)
        .click(com.YesNoButton("NO")).pause(p.ButtonPress)
      ;

      await browser.window.switchTo(player1Window)
        .waitForElementPresent(com.AllyGroundUnit(2))
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.AllyGroundUnit(2))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.assert.textEquals(com.TheirBaseDamage, '0');
      await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 4), '2');//subcard, then atk, then def, then damage
      await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '2');
      await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 3), '2');
    },
    'Leader Ability: Darth Vader ping': async function () {
      await LoadTestGameStateAsync('leader-ability-sor/vader-ping');

      await browser.waitForElementPresent(com.Leader(1))
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.assert.textEquals(com.TheirBaseDamage, '1');
      await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
      await browser.assert.textEquals(com.MyResources, '3/4');
    },
    'Leader Ability: Grand Inquisitor ping ready': async function () {
      await LoadTestGameStateAsync('leader-ability-sor/grandinq-ready');

      await browser.waitForElementPresent(com.Leader(1))
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.AllyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)

      await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '2');
      await browser.assert.not.elementPresent(com.AllyGroundUnit(1, true));
    },
    'Leader Ability: IG-88 buff': async function () {
      await LoadTestGameStateAsync('leader-ability-sor/ig88-buff');

      await browser.waitForElementPresent(com.Leader(1))
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.AllyGroundUnit(2))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.Base(2))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)

      await browser.assert.textEquals(com.TheirBaseDamage, '2');
    },
    'Leader Ability: Cassian Draw': async function () {
      await LoadTestGameStateAsync('leader-ability-sor/cassian-draw');

      await browser.waitForElementPresent(com.MyHand)
        .click(com.HandCard(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.Base(2))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.window.switchTo(player2Window)
        .waitForElementPresent(com.PassButton)
        .click(com.PassButton).pause(p.ButtonPress)
      ;

      await browser.window.switchTo(player1Window)
        .waitForElementPresent(com.Leader(1))
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
      ;

      await browser.assert.textEquals(com.TheirBaseDamage, '3');
      await browser.assert.elementsCount(com.MyHandDivs, 2);
    },
    'Leader Ability: Sabine ping': async function () {
      await LoadTestGameStateAsync('leader-ability-sor/sabine-ping');

      await browser.waitForElementPresent(com.Leader(1))
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.assert.textEquals(com.MyBaseDamage, '3');
      await browser.assert.textEquals(com.TheirBaseDamage, '6');
    },
    'Leader Ability: Boba Fett ready resource': ''+async function () {//ignored since Boba Fett leader is suspended
      await LoadTestGameStateAsync('leader-ability-sor/boba-ready');
      await browser.assert.textEquals(com.MyResources, '4/7');
      await browser.waitForElementPresent(com.AllyGroundUnit(1))
        .click(com.AllyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.assert.textEquals(com.MyResources, '5/7');
    },
    'Leader Ability: Thrawn reveal exhaust': async function () {
      await LoadTestGameStateAsync('leader-ability-sor/thrawn-exhaust');

      await browser.waitForElementPresent(com.Leader(1))
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.assert.elementPresent(com.EnemyGroundUnit(1, true));
    },
    'Leader Ability: Han Solo resource and blow up': async function () {
      await LoadTestGameStateAsync('leader-ability-sor/han-resource');

      await browser.waitForElementPresent(com.Leader(1))
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.HandCard(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.assert.textEquals(com.MyResources, '5/8');

      await browser.window.switchTo(player2Window)
        .waitForElementPresent(com.PassButton)
        .click(com.PassButton).pause(p.ButtonPress)
      ;

      await browser.window.switchTo(player1Window)
        .waitForElementPresent(com.PassButton)
        .click(com.PassButton).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.ButtonPress)
        .click(com.PassButton).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.ButtonPress)
        .click(com.MultizoneImage(4))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.assert.textEquals(com.MyResources, '7/7');
    },
    'Leader Ability: Jyn Erso debuff': async function () {
      await LoadTestGameStateAsync('leader-ability-sor/jyn-erso-debuff');

      await browser.waitForElementPresent(com.Leader(1))
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonInputChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
      await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '1');
    }
}