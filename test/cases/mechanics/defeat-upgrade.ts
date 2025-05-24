import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName
} from '@utils/util';

export const DefeatUpgradeCases = {
  'Defeat Upgrade: Disabling Fang Fighter': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.Waylay, 3)
      .AddCardToHand(1, cards.SOR.DisablingFF)
      .AddUnit(2, cards.TWI.BattleDroid, false, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.Darksaber, 2).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ChooseButton(1, 1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.TheirDiscardCount, '1');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 1), '1');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 2), '1');
  },
  'Defeat Upgrade: Poe pilot': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 1)
      .FillResources(2, cards.SOR.BFMarine, 1)
      .AddCardToHand(2, cards.SOR.Confiscate)
      .AddUnit(1, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader()
      .ClickMyLeader()
      .MultiChoiceButton(1)
      .SwitchPlayerWindow()
      .WaitForMyHand()
      .ClickHandCard(1)
      .ChooseButton(1, 1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirLeaderIsThere()
      .TheirLeaderStillHasEpicAction()
      .RunAsync()
    ;
  }
}