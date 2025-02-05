import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, src, p,
  player1Window, player2Window,
  gameName
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
      .AddUnit(1, cards.SOR.DSStormTrooper, true, 0,
        gameState.SubcardBuilder().AddExperience(1,3).Build())
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.TWI.Malevolence, true, 3)
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
  'TarkinTown cannot hit piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .AddUnit(2, cards.SOR.Snowspeeder, false, 1)
      .AddUnit(2, cards.SOR.Snowspeeder, false, 1,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.Snowspeeder, false, 1)
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
    await browser.assert.attributeEquals(com.UnitImg(com.EnemyGroundUnit(2)), 'style', src.NotPlayableBorderUnit);
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
  }
}