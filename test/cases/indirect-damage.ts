import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, src, p,
  player1Window, player2Window,
  gameName
} from '../utils/util';

export const IndirectDamageCases = {
  'Planetary Bombardment pings simultaneously': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .AddUnit(2, cards.SOR.SLT)
      .AddUnit(2, cards.JTL.TieFighter, false, 0,
        gameState.SubcardBuilder().AddExperience(2).Build())
      .AddUnit(2, cards.SHD.Dengar, false, 0,
        gameState.SubcardBuilder().AddShield(2).Build())
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.Checkbox(1))
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.Checkbox(3)).pause(p.CheckBox)
      .click(com.Checkbox(4)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      //mid-assert SLT doesn't give resource
      .assert.textEquals(com.MyResources, '0/0')
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser
      .assert.textEquals(com.MyBaseDamage, '10')
      .assert.textEquals(com.MyResources, '1/1')
      .assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 4), '1')
      .assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '1')
      .assert.attributeContains(com.UnitDivPiece(com.AllyGroundUnit(1), 4), 'style', src.ShieldToken)
      .assert.not.elementPresent(com.AllyGroundUnit(2))
    ;
  },
  'Planetary Bombardment with units tries to skip base': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .AddUnit(2, cards.JTL.TieFighter, false, 0,
        gameState.SubcardBuilder().AddExperience(2).Build())
      .AddUnit(2, cards.SHD.Dengar, false, 0,
        gameState.SubcardBuilder().AddShield(2).Build())
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.Checkbox(1))
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.Checkbox(3)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser
      .assert.textEquals(com.MyBaseDamage, '11')
      .assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 4), '1')
      .assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '1')
      .assert.attributeContains(com.UnitDivPiece(com.AllyGroundUnit(1), 4), 'style', src.ShieldToken)
      .assert.not.elementPresent(com.AllyGroundUnit(2))
    ;
  },
  'Planetary Bombardment no units': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.Checkbox(1))
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '13');
  },
  'Planetary Bombardment no units skip base': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.Checkbox(1))
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '13');
  },
  'PBnDev pings simultaneously': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .AddUnit(2, cards.SOR.SLT)
      .AddUnit(2, cards.JTL.TieFighter, false, 0,
        gameState.SubcardBuilder().AddExperience(2).Build())
      .AddUnit(2, cards.SHD.Dengar, false, 0,
        gameState.SubcardBuilder().AddShield(2).Build())
      .AddUnit(1, cards.JTL.Devastator)
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.Checkbox(3)).pause(p.CheckBox)
      .click(com.Checkbox(4)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      //mid-assert SLT doesn't give resource
      .assert.textEquals(com.TheirResources, '0/0')
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser
      .assert.textEquals(com.TheirBaseDamage, '14')
      .assert.textEquals(com.TheirResources, '1/1')
      .assert.textEquals(com.UnitDivPiece(com.EnemySpaceUnit(1), 4), '1')
      .assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '1')
      .assert.attributeContains(com.UnitDivPiece(com.EnemyGroundUnit(1), 4), 'style', src.ShieldToken)
      .assert.not.elementPresent(com.EnemyGroundUnit(2))
    ;
  },
  'PBnDev with units tries to skip base': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .AddUnit(2, cards.JTL.TieFighter, false, 0,
        gameState.SubcardBuilder().AddExperience(2).Build())
      .AddUnit(2, cards.SHD.Dengar, false, 0,
        gameState.SubcardBuilder().AddShield(2).Build())
      .AddUnit(1, cards.JTL.Devastator)
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.Checkbox(3)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser
      .assert.textEquals(com.TheirBaseDamage, '15')
      .assert.textEquals(com.UnitDivPiece(com.EnemySpaceUnit(1), 4), '1')
      .assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '1')
      .assert.attributeContains(com.UnitDivPiece(com.EnemyGroundUnit(1), 4), 'style', src.ShieldToken)
      .assert.not.elementPresent(com.EnemyGroundUnit(2))
    ;
  },
  'PBnDev no units': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .AddUnit(1, cards.JTL.Devastator)
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.TheirBaseDamage, '17');
  },
  'PBnDev no units skip base': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .AddUnit(1, cards.JTL.Devastator)
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.TheirBaseDamage, '17');
  }
}