import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, p, src,
  player1Window, player2Window,
  customAsserts,
  gameName,
  cs
} from '../utils/util';

export const LeaderUnitSORCases = {
  'SOR: Blue and Green Leader Units': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("6 6")
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.SOR.IdenLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(1, cards.SOR.InfernoFour, 6)
      .FillResources(2, cards.SOR.InfernoFour, 8)
      .AddUnit(1, cards.TWI.DevGunship, false, false, 1)
      .AddUnit(1, cards.SOR.KrennicLeaderUnit, true)
      .AddUnit(1, cards.SOR.ChewbaccaLeaderUnit, true)
      .AddUnit(1, cards.SOR.ChirrutLeaderUnit, true)
      .AddUnit(1, cards.SOR.LukeLeaderUnit, true)
      .AddUnit(2, cards.SOR.MoffTarkinLeaderUnit, true)
      .AddUnit(2, cards.SOR.HeraLeaderUnit, true)
      .AddUnit(2, cards.SOR.LeiaLeaderUnit, true)
      .FlushAsync(com.BeginTestCallback)
    ;
    //deploy Iden Versio
    await browser.waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Iden Versio deploys shielded
    await browser.assert.elementPresent(com.AllyGroundUnit(5));
    await browser.assert.attributeContains(com.UnitDivPiece(com.AllyGroundUnit(5), 3), 'style', src.ShieldToken);
    //deploy palp
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.Leader(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Emperor Palpatine deploys and takes control of enemy unit
    await browser.assert.elementPresent(com.AllyGroundUnit(4));
    await browser.assert.elementPresent(com.AllySpaceUnit(1));
    await browser.assert.not.elementPresent(com.EnemySpaceUnit(1));
    //Luke attacks Palpatine
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    //Luke Skywalker gives shield to any unit
    await browser.assert.attributeContains(com.UnitDivPiece(com.AllyGroundUnit(1), 3), 'style', src.ShieldToken);
    //attack with Leia and Hera
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Leia Chained attacks, Hera XP, and Chewie Sentinel plus Grit, Iden Versio heals 1 from base when enemy defeated
    await browser.assert.not.elementPresent(com.AllyGroundUnit(4));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 3), '2');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(2), 3), '8');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(2), 1), '11');
    await browser.assert.attributeContains(com.UnitDivPiece(com.EnemyGroundUnit(2), 4), 'style', src.SentinelToken);
    await browser.assert.textEquals(com.TheirBaseDamage, '5');

    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(5))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(5))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Iden Versio heals 1 from base when enemy defeated
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(3));
    await browser.assert.textEquals(com.MyBaseDamage, '4');
    await customAsserts.AllyUnitDivPieceIsOverlay(browser, "GROUND", 5, 3);

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Grand Moff Tarkin gives XP to Imperial unit and Idem Versio heals 1 from base when enemy defeated
    await browser.assert.not.elementPresent(com.AllyGroundUnit(2));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), 'EXPERIENCE');
    await browser.assert.textEquals(com.TheirBaseDamage, '3');

    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Chirrut Imwe not defeated due to 0 HP and Krennic buffs damaged units
    await browser.assert.elementPresent(com.AllyGroundUnit(4));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 1), '4');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 2), '5');

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .pause(p.WaitForEffect)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Emperor Palpatine destroys ally unit to ping enemy unit, Iden Versio heals 1 from base when enemy defeated, Luke's shield is pinged
    await browser.assert.not.elementPresent(com.AllySpaceUnit(1));
    await browser.assert.not.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 4), '9');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 1), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 2), '7');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '5');
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, "GROUND", 1, 4);
    await browser.assert.textEquals(com.TheirBaseDamage, '2');
    await browser.assert.textEquals(com.MyBaseDamage, '9');

    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Krennic restores 2 health on attack
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.not.elementPresent(com.AllyGroundUnit(4));
    await browser.assert.textEquals(com.MyBaseDamage, '0');
    await browser.assert.textEquals(com.TheirBaseDamage, '9');
  },
  'SOR: Red and Yellow Leader Units': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("6 6")
      .AddBase(1, cards.SOR.KestroCity)
      .AddLeader(1, cards.SOR.ChewbaccaLeader)
      .AddBase(2, cards.SOR.ChopperBase)
      .AddLeader(2, cards.SOR.LukeLeader)
      .FillResources(1, cards.SOR.InfernoFour, 6)
      .FillResources(2, cards.SOR.InfernoFour, 8)
      .AddCardToDeck(1, cards.SHD.QiRaUnit)
      .AddCardToDeck(2, cards.SHD.QiRaUnit)
      .AddCardToDeck(2, cards.SHD.QiRaUnit)
      .AddUnit(1, cards.SOR.DarthVaderLeaderUnit, false, true, 3)
      .AddUnit(1, cards.SOR.GILeaderUnit, true)
      .AddUnit(1, cards.SOR.IG88LeaderUnit, true)
      .AddUnit(1, cards.SOR.CassianLeaderUnit, true)
      .AddUnit(1, cards.SOR.SabineLeaderUnit, true)
      .AddUnit(2, cards.SOR.BobaFettLeaderUnit, true)
      .AddUnit(2, cards.SOR.ThrawnLeaderUnit, true)
      .AddUnit(2, cards.SOR.HanLeaderUnit, true)
      .AddUnit(2, cards.SOR.JynErsoLeaderUnit, true)
      .SetClassStatePiece(2, cs.NumLeftPlay, "1")
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.AllyGroundUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.AllyGroundUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.EnemyGroundUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.EnemyGroundUnit(2))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    //Darth Vader pings enemy unit, IG-88 gives Vader Raid 1
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '6');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(2), 3), '2');

    await browser.window.switchTo(player2Window).refresh()
    .waitForElementPresent(com.AllyGroundUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.AllyGroundUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.Base(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    //Boba readies 2 resources
    await browser.assert.textEquals(com.MyResources, '8/8');
    await browser.assert.textEquals(com.TheirBaseDamage, '10');

    await browser.window.switchTo(player1Window).refresh()
    .waitForElementPresent(com.AllyGroundUnit(5))
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.AllyGroundUnit(5))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.EnemyGroundUnit(2))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    .click(com.YesNoButton('YES')).pause(p.ButtonPress)
    ;

    //Sabine does 1 to base, Cassian allows draw
    await browser.assert.textEquals(com.TheirBaseDamage, '7');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(5), 3), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(2), 3), '5');
    await browser.assert.attributeEquals(com.HandCardImg(1), 'src', 'http://localhost:8080/Arena/concat/7964782056.webp');

    await browser.window.switchTo(player2Window).refresh()
    .waitForElementPresent(com.AllyGroundUnit(3))
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.AllyGroundUnit(3))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.Base(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)

    //Han puts top deck as resource
    await browser.assert.textEquals(com.TheirBaseDamage, '14');
    await browser.assert.textEquals(com.MyResources, '9/9');

    await browser.window.switchTo(player1Window).refresh()
    .waitForElementPresent(com.AllyGroundUnit(2))
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.AllyGroundUnit(2))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.EnemyGroundUnit(4))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.AllyGroundUnit(5))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Inquisitor deals 1 damage to unit and readies it, IG-88 gives Inquisitor Raid 1
    await browser.assert.not.elementPresent(com.AllyGroundUnit(5, true));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 3), '4');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(5), 3), '4');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(4), 3), '4');

    await browser.window.switchTo(player2Window).refresh()
    .waitForElementPresent(com.AllyGroundUnit(2))
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.AllyGroundUnit(2))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.EnemyGroundUnit(2))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.EnemyGroundUnit(5))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)

    //Thrawn exhausts enemy unit, Jyn Erso debuffs defending unit
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(5));
    await browser.assert.elementPresent(com.EnemyGroundUnit(4, true));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 3), '7');
    ;

    await browser.window.switchTo(player1Window).refresh()
    .waitForElementPresent(com.AllyGroundUnit(2))
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.AllyGroundUnit(2))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.Base(2))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    //IG-88 does not give self Raid 1
    await browser.assert.textEquals(com.TheirBaseDamage, '12');
  },
  'Palp cant steal piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.PalpLeader)
      .AddBase(2, cards.SOR.ChopperBase)
      .AddLeader(2, cards.JTL.AsajjLeaderUnit, true)
      .FillResources(1, cards.SOR.InfernoFour, 8)
      .AddUnit(2, cards.SOR.TieLnFighter, false, false, 1,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.SOR.Avenger, false, false, 1)
      .AddUnit(2, cards.SOR.CraftySmuggler, false, false, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemySpaceUnit(1));
  }
}