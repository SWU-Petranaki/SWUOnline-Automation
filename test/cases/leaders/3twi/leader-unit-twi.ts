
import { cards } from '@utils/cards';
import { GameState } from '@utils/gamestate';
import {
    com, p,
    player1Window, player2Window,
    gameName,
    src,
    customAsserts
} from '@utils/util';

export const LeaderUnitTWICases = {
    'Leader Unit: Nala Se TWI Ignore Aspect': async function () {
      //arrange
      const gameState = new GameState(gameName);
      await gameState.LoadGameStateLinesAsync();
      await gameState.ResetGameStateLines()
        .AddBase(1, cards.SOR.ECL)
        .AddLeader(1, cards.TWI.NalaSeLeader, true)
        .AddBase(2, cards.SOR.EchoBase)
        .AddLeader(2, cards.SOR.MoffTarkinLeader)
        .FillResources(1, cards.TWI.EliteP, 2)
        .AddCardToHand(1, cards.TWI.PhaseIStormTrooper)
        .AddUnit(1, cards.TWI.NalaSeLeaderUnit, true)
        .FlushAsync(com.BeginTestCallback)
      ;

      await browser
        .waitForElementPresent(com.MyHand)
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.HandCard(1))
        .pause(p.WaitForEffect)
      ;

      await browser.assert.textEquals(com.MyResources, '0/2');
    },
    'Leader Unit: Yoda flip cant defeat piloted leader unit': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
      //arrange
      const gameState = new GameState(gameName);
      await gameState.LoadGameStateLinesAsync();
      await gameState.ResetGameStateLines()
        .AddBase(1, cards.SOR.ChopperBase)
        .AddLeader(1, cards.TWI.YodaLeader)
        .AddBase(2, cards.SOR.EchoBase)
        .AddLeader(2, cards.JTL.HanSoloLeader, true)
        .FillResources(1, cards.TWI.EliteP, 7)
        .AddCardToDeck(1, cards.TWI.EliteP)
        .AddUnit(2, cards.SOR.TieLnFighter)
        .AddUnit(2, cards.SOR.TieLnFighter, false, true, 0,
          gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
        .AddUnit(2, cards.SOR.TieLnFighter)
        .FlushAsync(com.BeginTestCallback)
      ;
      //act
      await browser
        .waitForElementPresent(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.Move)
        .click(com.Leader(1))
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.ButtonMultiChoice(2)).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
        .click(com.YesNoButton("YES")).pause(p.ButtonPress)
        .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      ;
      //assert
      await customAsserts.UnitIsNotPlayable(browser, com.EnemySpaceUnit(2));
    }
}