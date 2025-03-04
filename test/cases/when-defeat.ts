
import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '../utils/util';

export const WhenDefeatCases = {
  'When Defeat: Inferno Four top bottom': ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 3)
      .AddCardToHand(1, cards.TWI.MercilessContest)
      .AddCardToDeck(1, cards.SHD.TopTarget)
      .AddCardToDeck(1, cards.SOR.Waylay)
      .AddCardToDeck(1, cards.SOR.Vanquish, 3)
      .AddCardToDeck(1, cards.SOR.Avenger, 3)
      .AddUnit(1, cards.SOR.InfernoFour)
      .FlushAsync(com.BeginTestCallback)
    ;
    //pre-assert
    const prevTopDeck = gameState.GetTopDeck(1);
    const prevTopDeck2 = gameState.GetTopDeck(1, 2);
    const prevBottomDeck = gameState.GetBottomDeck(1);
    await browser.assert.equal(prevTopDeck, cards.SHD.TopTarget);
    await browser.assert.equal(prevTopDeck2, cards.SOR.Waylay);
    await browser.assert.equal(prevBottomDeck, cards.SOR.Avenger);
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .ChooseButton(2, 2).ChooseButton(1, 1)
      .RunAsync()
    ;
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1)[0];
    const secondLastLog = (await browser.getText(com.GameLog)).split('\n').slice(-2)[0];
    await browser.assert.equal(secondLastLog, 'Player 1 put a card on the bottom of the deck.');
    await browser.assert.equal(lastLog, 'Player 1 put a card on top of the deck.');
    await gameState.LoadGameStateLinesAsync();
    const newTopDeck = gameState.GetTopDeck(1);
    const newTopDeck2 = gameState.GetTopDeck(1, 2);
    const newBottomDeck = gameState.GetBottomDeck(1);
    await browser.assert.equal(newTopDeck, cards.SHD.TopTarget);
    await browser.assert.equal(newTopDeck2, cards.SOR.Vanquish);
    await browser.assert.equal(newBottomDeck, cards.SOR.Waylay);
  },
  'When Defeat: SLT w Clone Cohort Pinged by Dengar': process.env.FULL_REGRESSION !== "true" ? '' : ''+async function () {//TEMP: after set 4, add back
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.SHD.BosskLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.MoffTarkinLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.TWI.CloneCohort)
      .AddUnit(1, cards.SOR.SLT)
      .AddUnit(1, cards.SHD.Dengar)
      .FlushAsync(com.BeginTestCallback)
    ;
    await browser
    .waitForElementPresent(com.MyHand)
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.HandCard(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.AllyGroundUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    .click(com.YesNoButton('YES'))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(com.AllyGroundUnit(3));
    await customAsserts.AllyGroundUnitIsCloneTrooper(browser, 2);
    await browser.assert.textEquals(com.MyResources, '1/3');
  },
}