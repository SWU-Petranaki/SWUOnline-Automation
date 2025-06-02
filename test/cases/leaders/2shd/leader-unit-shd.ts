import { cards } from '@utils/cards';
import { GameState } from '@utils/gamestate';
import {
  com, p, src, customAsserts,
  player1Window, player2Window,
  gameName
} from '@utils/util'

export const LeaderUnitSHDCases = {
  'SHD: Blue and Green Leader Units': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 10")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SHD.QiRaLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SHD.JabbaLeader)
      .FillResources(1, cards.SOR.InfernoFour, 5)
      .FillResources(2, cards.SHD.CollectionsStarhopper, 7)
      .AddUnit(1, cards.SOR.TieLnFighter)
      .AddUnit(1, cards.TWI.DevGunship, false, true, 5,
        gameState.SubcardBuilder().AddUpgrade(cards.TWI.DroidCohort, 1).Build())
      .AddUnit(1, cards.SHD.GarSaxonLeaderUnit, true)
      .AddUnit(1, cards.SHD.FinnLeaderUnit, true)
      .AddUnit(1, cards.SHD.ReyLeaderUnit, true)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.InfernoFour)
      .AddUnit(2, cards.SHD.HondoLeaderUnit, true)
      .AddUnit(2, cards.SHD.GideonLeaderUnit, true)
      .AddUnit(2, cards.SHD.HunterLeaderUnit, true)
      .AddUnit(2, cards.SHD.BobaDaimyoLeaderUnit, true)
      .FlushAsync(com.BeginTestCallback)
    ;
    //pre-assert
    await customAsserts.AllyUnitDivPieceIsOverlay(browser, "SPACE", 1, 3);
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(2), 4), '5')
    await customAsserts.AllyUnitDivPieceIsOverlay(browser, "GROUND", 1, 3);
    await customAsserts.AllyUnitDivPieceIsOverlay(browser, "GROUND", 2, 3);
    await customAsserts.AllyUnitDivPieceIsOverlay(browser, "GROUND", 2, 3);
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, "SPACE", 1, 3);
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, "SPACE", 2, 3);
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, "SPACE", 3, 3);
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, "GROUND", 1, 3);
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, "GROUND", 2, 3);
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, "GROUND", 3, 3);
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, "GROUND", 4, 3);
    //Qi'Ra flip
    await browser.waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Qi'Ra pings everyone
    await customAsserts.AllyUnitDivPieceIsOverlay(browser, "SPACE", 1, 3);
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(2), 4), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 3), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(3), 3), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(4), 3), '4');
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, "SPACE", 1, 3);
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, "SPACE", 2, 3);
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemySpaceUnit(3), 3), '1');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(2), 3), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(3), 3), '4');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(4), 3), '3');
    //Jabba flip
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.Leader(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Jabba lets ally unit capture enemy unit
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'TIE/LN FIGHTER');
    //Qi'Ra grit
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(5))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert damage on new Jabba leader ground unit
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(5), 3), '4');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(4), 3), '6');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(4), 1), '6');

    //Hondo gives XP for playing from resources
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.MyResources)
      .moveToElement(com.MyResources, 0, 0).pause(p.Move)
      .click(com.MyResources)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ResourcePopupImgOption(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ResourcePopupCloseButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Boba Fett Daimyo has XP added
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(4), 1), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(4), 2), '5');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(4), 3), '8');
    //Rey on attack
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(5))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    //Rey has XP; Gar Saxon's +1 power on Rey for being upgraded; Jabba has 4 more damage; base healed 3
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(3), 1), 'EXPERIENCE');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(3), 2), '4');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(3), 3), '7');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(5), 3), '8');
    await browser.assert.textEquals(com.MyBaseDamage, '2');

    //Hondo raid 1; does 5 to the base
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.textEquals(com.TheirBaseDamage, '7');

    //hit space unit with Devastating Gunship to prepare for Moff Gideon's unit attacks ability
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    //Moff Gideon's unit attacks ability; Gar Saxon upgrade bounce
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
    //Boba Fett keyword +1, Moff Gideon's unit attacks ability +1 and overwhelms 3 to the base
    await browser.assert.textEquals(com.TheirBaseDamage, '10');

    //Gar Saxon upgrade bounce
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ChooseButton(1, 1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //upgrade bounced to hand
    await browser.assert.elementsCount(com.MyHandDivs, 1);

    //Finn defeat upgrade and give shield
    await browser.waitForElementPresent(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(5))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ChooseButton(1, 1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    //Rey has shield and plus 1 from Gar Saxon
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(3), 1), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(3), 2), '6');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(3), 3), '5');
    await browser.assert.attributeContains(com.UnitDivPiece(com.AllyGroundUnit(3), 4), 'style', src.ShieldToken);

    //Moff Gideon self overwhelm
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(5))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.textEquals(com.TheirBaseDamage, '13');

    //Gar Saxon returns passive buff
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //Rey still has three power due to shield upgrade
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 1), '3');
    //Hunter pulls resource to hand
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //await browser.pause(p.Debug);
  },
  'SHD: Mando cant capture piloted leader unit w Rifle': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SHD.MandoLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SHD.MandosRifle, 3)
      .AddCardToHand(1, cards.SHD.MandosRifle)
      .AddUnit(1, cards.SHD.MandoLeaderUnit, true)
      .AddUnit(2, cards.SOR.TieLnFighter, false, false)
      .AddUnit(2, cards.SOR.TieLnFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.SOR.TieLnFighter, false, false)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.MyHand, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.EnemySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemySpaceUnit(2));
  },
  'SHD: Jabba cant capture piloted leader unit': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.SHD.JabbaLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SHD.CollectionsStarhopper, 7)
      .AddUnit(1, cards.SOR.GILeaderUnit, true)//Twin Suns prep
      .AddUnit(1, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.TieLnFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.SOR.TieLnFighter, false, false)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemySpaceUnit(2));
  }
}