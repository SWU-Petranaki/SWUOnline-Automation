import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, src, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '../utils/util';

export const DamageCases = {
  'Overwhelming Barrage pings simultaneously': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.TWI.LairOfGrievous)
      .AddLeader(1, cards.SHD.BosskLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.OB)
      .AddUnit(1, cards.SOR.DSStormTrooper, false, true, 0,
        gameState.SubcardBuilder().AddExperience(1,3).Build())
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.TWI.Malevolence, false, true, 3)
      .AddUnit(2, cards.SOR.SLT)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.Checkbox(3)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(4)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .assert.textEquals(com.TheirResources, '0/0')
      .assert.not.elementPresent(com.EnemyGroundUnit(1))
      //when defeated triggers after damage
      .click(com.ButtonMultiChoice(5)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.PassButton).pause(p.ButtonPress)
    ;
    //assert
    await browser
      .assert.textEquals(com.TheirResources, '1/1')
      .assert.elementPresent(com.EnemyGroundUnit(1))
      .assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 1), '1')
      .assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 2), '1')
      .assert.not.elementPresent(com.EnemyGroundUnit(2))
      .assert.not.elementPresent(com.EnemySpaceUnit(1))
    ;
  },
  'Overwhelming Barrage pings both': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.TWI.LairOfGrievous)
      .AddLeader(1, cards.SHD.BosskLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.OB)
      .AddUnit(1, cards.SOR.DSStormTrooper, false, true, 0,
        gameState.SubcardBuilder().AddExperience(1,3).Build())
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.TWI.Malevolence, false, true, 3)
      .AddUnit(2, cards.SOR.SLT)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.Checkbox(3)).pause(p.CheckBox)
      .click(com.Checkbox(1, 2)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(3)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(4)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(4)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser
      .assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(2), 3), '2')
      .assert.textEquals(com.UnitDivPiece(com.EnemySpaceUnit(1), 3), '6')
      .assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 6), '3')
    ;
  },
  'Overwhelming Barrage pings only self': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.TWI.LairOfGrievous)
      .AddLeader(1, cards.SHD.BosskLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.OB)
      .AddUnit(1, cards.SOR.DSStormTrooper, false, true, 0,
        gameState.SubcardBuilder().AddExperience(1,3).Build())
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.TWI.Malevolence, false, true, 3)
      .AddUnit(2, cards.SOR.SLT)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1, 2)).pause(p.CheckBox)
      .click(com.Checkbox(2, 2)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(6)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser
      .assert.textEquals(com.UnitDivPiece(com.EnemySpaceUnit(1), 3), '3')
      .assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 6), '5')
      .assert.not.elementPresent(com.AllyGroundUnit(2))
    ;
  },
  'Overwhelming Barrage used only for buff': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.TWI.LairOfGrievous)
      .AddLeader(1, cards.SHD.BosskLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.OB)
      .AddUnit(1, cards.SOR.DSStormTrooper, false, true, 0,
        gameState.SubcardBuilder().AddExperience(1,3).Build())
      .AddUnit(1, cards.SOR.DisablingFF)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser
      .assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 4), '8')
    ;
  },
  'TarkinTown cannot hit piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .AddUnit(2, cards.SOR.Snowspeeder, false, false, 1)
      .AddUnit(2, cards.SOR.Snowspeeder, false, 1,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.Snowspeeder, false, false, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemyGroundUnit(2));
  },
  'Palp SOR unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 8)
      .AddCardToHand(1, cards.SOR.PalpUnit)
      .AddUnit(2, cards.SOR.DarthVader)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(6))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser
      .assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '5')
      .assert.not.elementPresent(com.EnemyGroundUnit(2))
    ;
  },
  'Vambrace Flamethrower hits ground units': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.PalpLeader)
      .AddUnit(2, cards.SOR.DarthVader)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(1, cards.SOR.DSStormTrooper, true, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.VambraceFlameThrower, 3).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser
      .assert.textEquals(com.TheirBaseDamage, '4')
      .assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '2')
      .assert.not.elementPresent(com.EnemyGroundUnit(2))
  },
  'IG-2000 only does 1 damage per unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 4)
      .AddCardToHand(1, cards.JTL.IG2000)
      .AddUnit(2, cards.SOR.DarthVader, false, 6)
      .AddUnit(2, cards.SOR.CraftySmuggler, false, false, 1)
      .AddUnit(2, cards.JTL.HoundsTooth, false, false, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.Checkbox(3)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.ButtonMultiChoice(3));
    //act
    await browser
      .click(com.ButtonMultiChoice(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser
      .assert.textEquals(com.TheirBaseDamage, '0')
      .assert.textEquals(com.UnitDivPiece(com.EnemySpaceUnit(1), 3), '2')
      .assert.not.elementPresent(com.EnemyGroundUnit(1))
    ;
  },
  'Devastator when played hits base for 4': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 8)
      .AddCardToHand(1, cards.JTL.Devastator)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.JTL.HoundsTooth)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.TheirBaseDamage, '4');
  },
}