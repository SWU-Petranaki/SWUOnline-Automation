import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  src
} from '../utils/util';

export const BounceCases = {
  'Bounce: Waylay Tokens': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.Waylay, 6)
      .AddCardToHand(1, cards.SOR.Waylay)
      .AddCardToHand(1, cards.SOR.Waylay)
      .AddUnit(2, cards.TWI.BattleDroid)
      .AddUnit(2, cards.TWI.CloneTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.ClaimButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ClaimButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.elementPresent(com.TheirDiscardEmpty);
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.not.elementPresent(com.TheirHandDivs);
  },
  'MaKlounkee cannot bounce own piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader, true)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SHD.MaKlounkee, 1)
      .AddCardToHand(1, cards.SHD.MaKlounkee)
      .AddUnit(1, cards.SOR.EscortSkiff, false, 1)
      .AddUnit(1, cards.SOR.EscortSkiff, false, 1,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(1, cards.SOR.EscortSkiff, false, 1)
      .AddUnit(2, cards.SOR.BFMarine)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.AllyGroundUnit(2)), 'style', src.NotPlayableBorderUnit);
  },
  'Bounce: Evacuate unique captives and ignore leaders': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader, true)
      .FillResources(1, cards.SOR.Waylay, 6)
      .AddCardToHand(1, cards.SHD.Evacuate)
      .AddUnit(2, cards.SOR.SabineLeaderUnit)
      .AddUnit(2, cards.TWI.BattleDroid, false, 0,
        gameState.SubcardBuilder().AddCaptive(cards.SOR.LukeSkywalker, 1).Build())
      .AddUnit(2, cards.TWI.BattleDroid, false, 0,
        gameState.SubcardBuilder().AddCaptive(cards.SOR.LukeSkywalker, 1).Build())
      .AddUnit(2, cards.SOR.TieLnFighter, false, 0, gameState.SubcardBuilder().AddUpgrade(cards.JTL.AsajjLeaderUnit, 2, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.textEquals(com.PlayerPickSpan, 'You have two of this unique unit; choose one to destroy ')
  },
  'Bounce: Waylay cant bounce piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 3)
      .AddCardToHand(1, cards.SOR.Waylay)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.TieLnFighter, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.SOR.TieLnFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.EnemySpaceUnit(2)), 'style', src.NotPlayableBorderUnit);
  },
  'Bounce: Bright Hope cant bounce piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader, true)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.Waylay, 4)
      .AddCardToHand(1, cards.SOR.BrightHope)
      .AddUnit(1, cards.SOR.Snowspeeder)
      .AddUnit(1, cards.SOR.Snowspeeder, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.AllyGroundUnit(2)), 'style', src.NotPlayableBorderUnit);
  },
  'Bounce: Cunning cant bounce piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 4)
      .AddCardToHand(1, cards.SOR.Cunning)
      .AddUnit(2, cards.SOR.Snowspeeder)
      .AddUnit(2, cards.SOR.Snowspeeder, true, 0,
        gameState.SubcardBuilder()
          .AddUpgrade(cards.JTL.HanSoloLeaderUnit, 2, true)
          .AddUpgrade(cards.TWI.PerilousPosition, 1)
          .Build())
      .AddUnit(2, cards.SOR.Snowspeeder)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ModalOption(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ModalOption(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.EnemyGroundUnit(2)), 'style', src.NotPlayableBorderUnit);
  },
  'Bounce: Cantina Bouncer cant bounce piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 5)
      .AddCardToHand(1, cards.SOR.CantinaBouncer)
      .AddUnit(2, cards.SOR.Snowspeeder)
      .AddUnit(2, cards.SOR.Snowspeeder, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.Snowspeeder)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.EnemyGroundUnit(2)), 'style', src.NotPlayableBorderUnit);
  },
  'Bounce: Enfys Nest cant bounce piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 7)
      .AddCardToHand(1, cards.TWI.EnfysNest)
      .AddUnit(2, cards.SOR.Snowspeeder)
      .AddUnit(2, cards.SOR.GreenSquadAWing, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.Snowspeeder)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.EnemySpaceUnit(1)), 'style', src.NotPlayableBorderUnit);
  },
  'Bounce: Clear the Field cant bounce piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 2)
      .AddCardToHand(1, cards.TWI.ClearTheField)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.TieLnFighter, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.AsajjLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.SOR.TieLnFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.EnemySpaceUnit(2)), 'style', src.NotPlayableBorderUnit);
    //act
    await browser
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.elementsCount(com.TheirHandDivs, 2);
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemySpaceUnit(1), 1), 'ASAJJ VENTRESS I WORK ALONE');
  },
  'Spare the Target cant bounce piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 3)
      .AddCardToHand(1, cards.SHD.SpareTheTarget)
      .AddUnit(2, cards.SHD.CartelTurncoat)
      .AddUnit(2, cards.SHD.CartelTurncoat, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.SHD.CartelTurncoat)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await browser.assert.attributeEquals(com.UnitImg(com.EnemySpaceUnit(2)), 'style', src.NotPlayableBorderUnit);
  }
}