import {
  com, p, src,
  player1Window, player2Window,
  customAsserts,
  gameName,
  cs,
} from '../utils/util';
import { GameState } from '../utils/gamestate';
import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';

export const LeaderAbilitySORCases = {
  'Leader Ability: Director Krennic passive buff': ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.KestroCity)
      .AddLeader(1, cards.SOR.KrennicLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.IdenLeader)
      .AddUnit(1, cards.SHD.HylobonEnforcer, false, false, 3)
      .FlushAsync(com.BeginTestCallback)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), '5');
  },
  'Leader Ability: Iden Versio heal if enemy defeated': ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 0")
      .AddBase(1, cards.SOR.KestroCity)
      .AddLeader(1, cards.SOR.IdenLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .SetClassStatePiece(2, cs.NumAlliesDestroyed, "1")
      .FlushAsync(com.BeginTestCallback)
    ;

    await browser.waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '4');
  },
  'Leader Ability: Chewbacca taunt': process.env.FULL_REGRESSION !== "true" ? '' : ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SHD.JabbasPalace).AddLeader(1, cards.SOR.ChewbaccaLeader)
      .AddBase(2, cards.SOR.EchoBase).AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.Waylay, 2)
      .AddCardToHand(1, cards.JTL.PaigeTico)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    await browser.assert.doesNotThrow(() =>
      gameplay.Assert()
        .MyGroundUnitPieceIsSentinelToken(1, 3)
        .RunAsync());
  },
  'Leader Ability: Chirrut Imwe buff': process.env.FULL_REGRESSION !== "true" ? '' : ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.JedhaCity)
      .AddLeader(1, cards.SOR.ChirrutLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .AddUnit(1, cards.TWI.SabineWren)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 2), '6');
  },
  'Leader Ability: Luke Shield fails': ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.JedhaCity)
      .AddLeader(1, cards.SOR.LukeLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .AddResource(1, cards.SOR.Waylay)
      .AddUnit(1, cards.SOR.R2D2, false, false, 0, '-', 1, false, 1, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    ;
    //assert
    await customAsserts.AllyUnitDivPieceIsOverlay(browser, 'GROUND', 1, 3);
    await browser.assert.textEquals(com.MyResources, '0/1');
  },
  'Leader Ability: Luke Shield': ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.JedhaCity)
      .AddLeader(1, cards.SOR.LukeLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .AddResource(1, cards.SOR.Waylay)
      .AddUnit(1, cards.SOR.R2D2, false, false, 0, '-', 1, false, 1, 0)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.attributeContains(com.UnitDivPiece(com.AllyGroundUnit(1), 3), 'style', src.ShieldToken);
    await browser.assert.textEquals(com.MyResources, '0/1');
  },
  'Leader Ability: Palp fails': ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.SOR.PalpLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .AddResource(1, cards.SOR.Waylay)
      .AddCardToHand(1, cards.SOR.OB)
      .AddCardToDeck(1, cards.SOR.OB)
      .AddUnit(2, cards.TWI.BattleDroid)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.elementsCount(com.MyHandDivs, 1);
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-2)[0];
    await browser.assert.equal(lastLog, 'You don\'t control enough resources to deploy that leader; reverting the game state.');
  },
  'Leader Ability: Palp destroy, ping, and draw': ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.SOR.PalpLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .AddResource(1, cards.SOR.Waylay)
      .AddCardToHand(1, cards.SOR.OB)
      .AddCardToDeck(1, cards.SOR.OB)
      .AddUnit(1, cards.TWI.BattleDroid)
      .AddUnit(1, cards.TWI.BattleDroid)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '1');
    await browser.assert.elementsCount(com.MyHandDivs, 2);
    await browser.assert.textEquals(com.MyResources, '0/1');
  },
  'Leader Ability: Tarkin fails': process.env.FULL_REGRESSION !== "true" ? '' : ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .AddResource(1, cards.SOR.Waylay)
      .AddUnit(1, cards.SOR.AllianceXWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
    ;
    //assert
    await customAsserts.AllyUnitDivPieceIsOverlay(browser, 'SPACE', 1, 3);
    await browser.assert.textEquals(com.MyResources, '0/1');
  },
  'Leader Ability: Tarkin xp': process.env.FULL_REGRESSION !== "true" ? '' : ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .AddResource(1, cards.SOR.Waylay)
      .AddUnit(1, cards.SOR.TieLnFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 2), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 3), '2');
    await browser.assert.textEquals(com.MyResources, '0/1');
  },
  'Leader Ability: Hera ignore aspect': ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.SOR.HeraLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.BFMarine, 4)
      .AddCardToHand(1, cards.SOR.KananJarrus)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.textEquals(com.MyResources, '0/4');
  },
  'Leader Ability: Leia attacks on base': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.SOR.LeiaLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .AddUnit(1, cards.SOR.R2D2)
      .AddUnit(1, cards.SOR.R2D2, false, true, 1, "-", 1, false, 1, 1, 0, true)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.TheirBaseDamage, '2');
  },
  'Leader Ability: Leia attacks on same unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.SOR.LeiaLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.IdenLeader)
      .AddUnit(1, cards.SOR.R2D2)
      .AddUnit(1, cards.SOR.R2D2, false, true, 1, "-", 1, false, 1, 1, 0, true)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.textEquals(com.TheirBaseDamage, '0');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '2');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '1');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 3), '2');
    },
    'Leader Ability: Leia interrupted by Ezra': ''+async function () {//currently failing. here for TDD
      // await LoadTestGameStateAsync('leader-ability-sor/leia-ezra');

      // await browser.waitForElementPresent(com.Leader(1))
      //   .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      //   .click(com.Leader(1))
      //   .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      //   .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      //   .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      //   .click(com.AllyGroundUnit(2))
      //   .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      //   .click(com.Base(2))
      //   .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      //   .click(com.Checkbox(3)).pause(p.CheckBox)
      //   .click(com.SubmitButton).pause(p.ButtonPress)
      //   .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      //   .click(com.AllyGroundUnit(1))
      //   .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      //   .click(com.Base(2))
      //   .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      // ;

      // await browser.assert.textEquals(com.TheirBaseDamage, '6');
      // await browser.assert.textEquals(com.MyDiscardCount, '1');
      // await browser.assert.textEquals(com.TheirDiscardCount, '2');

    },
    'Leader Ability: Darth Vader ping': ''+async function () {//TEMP: after set 4, add back
      //arrange
      const gameState = new GameState(gameName);
      await gameState.LoadGameStateLinesAsync();
      await gameState.ResetGameStateLines()
        .AddBase(1, cards.SOR.EchoBase)
        .AddLeader(1, cards.SOR.VaderLeader)
        .AddBase(2, cards.SOR.EchoBase)
        .AddLeader(2, cards.SOR.IdenLeader)
        .AddUnit(2, cards.TWI.WTTradeOfficial)
        .AddResource(1, cards.SOR.Waylay)
        .SetClassStatePiece(1, cs.NumVillainyPlayed, "1")
        .FlushAsync(com.BeginTestCallback)
      ;

      await browser.waitForElementPresent(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.assert.textEquals(com.TheirBaseDamage, '1');
      await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '1');
      await browser.assert.textEquals(com.MyResources, '0/1');
    },
    'Leader Ability: Grand Inquisitor ping ready': ''+async function () {//TEMP: after set 4, add back
      //arrange
      const gameState = new GameState(gameName);
      await gameState.LoadGameStateLinesAsync();
      await gameState.ResetGameStateLines()
        .AddBase(1, cards.SOR.EchoBase)
        .AddLeader(1, cards.SOR.GILeader)
        .AddBase(2, cards.SOR.EchoBase)
        .AddLeader(2, cards.SOR.IdenLeader)
        .AddUnit(1, cards.TWI.WTTradeOfficial, false, false)
        .FlushAsync(com.BeginTestCallback)
      ;

      await browser.waitForElementPresent(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.AllyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)

      await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '2');
      await browser.assert.not.elementPresent(com.AllyGroundUnit(1, true));
    },
    'Leader Ability: IG-88 buff': process.env.FULL_REGRESSION !== "true" ? '' : ''+async function () {//TEMP: after set 4, add back
      //arrange
      const gameState = new GameState(gameName);
      await gameState.LoadGameStateLinesAsync();
      await gameState.ResetGameStateLines()
        .AddBase(1, cards.SOR.EchoBase)
        .AddLeader(1, cards.SOR.IG88Leader)
        .AddBase(2, cards.SOR.EchoBase)
        .AddLeader(2, cards.SOR.IdenLeader)
        .AddUnit(1, cards.TWI.WTTradeOfficial)
        .AddUnit(1, cards.TWI.DarthMaul)
        .FlushAsync(com.BeginTestCallback)
      ;
      //act
      await browser.waitForElementPresent(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.AllyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.Base(2))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      //assert
      await browser.assert.textEquals(com.TheirBaseDamage, '2');
    },
    'Leader Ability: Cassian Draw': process.env.FULL_REGRESSION !== "true" ? '' : ''+async function () {//TEMP: after set 4, add back
      //arrange
      const gameState = new GameState(gameName);
      await gameState.LoadGameStateLinesAsync();
      await gameState.ResetGameStateLines()
        .AddBase(1, cards.SOR.EchoBase)
        .AddLeader(1, cards.SOR.CassianLeader)
        .AddBase(2, cards.SOR.EchoBase)
        .AddLeader(2, cards.SOR.IdenLeader)
        .FillResources(1, cards.SHD.DaringRaid, 2)
        .AddCardToHand(1, cards.SHD.DaringRaid)
        .AddCardToHand(1, cards.SHD.DaringRaid)
        .AddCardToDeck(1, cards.SHD.DaringRaid)
        .SetClassStatePiece(2, cs.DamageTaken, "1")
        .FlushAsync(com.BeginTestCallback)
      ;
      //act
      await browser.waitForElementPresent(com.MyHand)
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.HandCard(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.Base(2))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.window.switchTo(player2Window).refresh()
        .waitForElementPresent(com.PassButton)
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.PassButton).pause(p.ButtonPress)
      ;

      await browser.window.switchTo(player1Window).refresh()
        .waitForElementPresent(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      ;
      //assert
      await browser.assert.textEquals(com.TheirBaseDamage, '2');
      await browser.assert.elementsCount(com.MyHandDivs, 2);
    },
    'Leader Ability: Sabine ping': async function () {
      const gameState = new GameState(gameName);
      await gameState.LoadGameStateLinesAsync()
      await gameState
        .ResetGameStateLines()
        .AddBase(1, cards.SOR.ECL)
        .AddLeader(1, cards.SOR.SabineLeader)
        .AddBase(2, cards.SOR.ECL)
        .AddLeader(2, cards.SOR.SabineLeader)
        .SetBasesDamage("2 5")
        .FlushAsync(async () => await browser.refresh())
      ;

      await browser.waitForElementPresent(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.assert.textEquals(com.MyBaseDamage, '3');
      await browser.assert.textEquals(com.TheirBaseDamage, '6');
    },
    'Leader Ability: Boba Fett ready resource': ''+async function () {//ignored since Boba Fett leader is suspended
      // await LoadTestGameStateAsync('leader-ability-sor/boba-ready');
      // await browser.assert.textEquals(com.MyResources, '4/7');
      // await browser.waitForElementPresent(com.AllyGroundUnit(1))
      //   .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      //   .click(com.AllyGroundUnit(1))
      //   .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      //   .click(com.EnemyGroundUnit(1))
      //   .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      // ;

      // await browser.assert.textEquals(com.MyResources, '5/7');
    },
    'Leader Ability: Thrawn reveal exhaust': process.env.FULL_REGRESSION !== "true" ? '' : ''+async function () {//TEMP: after set 4, add back
      //arrange
      const gameState = new GameState(gameName);
      await gameState.LoadGameStateLinesAsync();
      await gameState.ResetGameStateLines()
        .AddBase(1, cards.SOR.DagobahSwamp)
        .AddLeader(1, cards.SOR.ThrawnLeader)
        .AddBase(2, cards.SOR.KestroCity)
        .AddLeader(2, cards.SOR.IdenLeader)
        .AddResource(1, cards.SOR.Waylay)
        .AddCardToDeck(1, cards.SOR.OB)
        .AddUnit(2, cards.TWI.DarthMaul)
        .FlushAsync(com.BeginTestCallback)
      ;
      //act
      await browser.waitForElementPresent(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;
      //assert
      await browser.assert.elementPresent(com.EnemyGroundUnit(1, true));
    },
    Han_Solo_resource_and_blow_up: async function () {
      //arrange
      const gameState = new GameState(gameName);
      await gameState.LoadGameStateLinesAsync();
      await gameState.ResetGameStateLines()
        .AddBase(1, cards.SOR.ChopperBase)
        .AddLeader(1, cards.SOR.HanLeader)
        .AddBase(2, cards.SOR.DagobahSwamp)
        .AddLeader(2, cards.SOR.IdenLeader)
        .FillResources(1, cards.SOR.Waylay, 7)
        .AddCardToHand(1, cards.SOR.Waylay)
        .AddCardToHand(1, cards.SOR.Waylay)
        .FlushAsync(com.BeginTestCallback)
      ;
      //act
      const gameplay = new GamePlay(browser);
      await gameplay
        .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).ClickHandCard(1)
        .RunAsync()
      ;
      //assert
      await browser.assert.doesNotThrow(()=>
        gameplay.Assert()
          .MyResourcesEquals('8/8')
          .RunAsync());
      //act
      await gameplay
        .SwitchPlayerWindow().WaitForPassButton().PassTurn()
        .SwitchPlayerWindow().WaitForPassButton().PassTurn()
        .WaitForPassButton().Pass().ChooseMultiImg(4)
        .RunAsync()
      ;
      //assert
      await browser.assert.doesNotThrow(() =>
        gameplay.Assert()
          .MyResourcesEquals('7/7')
          .RunAsync());
    },
    'Leader Ability: Jyn Erso debuff': process.env.FULL_REGRESSION !== "true" ? '' : ''+async function () {//TEMP: after set 4, add back
      //arrange
      const gameState = new GameState(gameName);
      await gameState.LoadGameStateLinesAsync();
      await gameState.ResetGameStateLines()
        .AddBase(1, cards.SOR.DagobahSwamp)
        .AddLeader(1, cards.SOR.JynErsoLeader)
        .AddBase(2, cards.SOR.KestroCity)
        .AddLeader(2, cards.SOR.IdenLeader)
        .AddUnit(1, cards.SOR.CraftySmuggler)
        .AddUnit(2, cards.SOR.CraftySmuggler)
        .FlushAsync(com.BeginTestCallback)
      ;

      await browser.waitForElementPresent(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
        .click(com.EnemyGroundUnit(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;

      await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
      await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '1');
    }
}