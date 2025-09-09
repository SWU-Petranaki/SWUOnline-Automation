
import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
    com, p,
    player1Window, player2Window,
    gameName,
    src,
    customAsserts
} from '@utils/util';

export const LeaderUnitTWICases = {
    Nala_Se_TWI_ignore_aspect: async function () {
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
    Yoda_flip_cant_defeat_piloted_leader_unit: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
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
    },
    Mace_Windu_TWI_leader_flip_only_their_damaged: async function () {
      //arrange
      const gameState = new GameState(gameName);
      await gameState.LoadGameStateLinesAsync();
      await gameState.ResetGameStateLines()
        .AddBase(1, cards.SOR.ChopperBase)
        .AddLeader(1, cards.TWI.MaceWinduLeader)
        .AddBase(2, cards.SOR.EchoBase)
        .AddLeader(2, cards.JTL.HanSoloLeader)
        .FillResources(1, cards.TWI.EliteP, 7)
        .FillResources(1, cards.SOR.BFMarine, 7)
        .AddUnitWithDamage(1, cards.SOR.CraftySmuggler, 1)
        .AddUnitWithDamage(1, cards.SOR.AllianceXWing, 1)
        .AddUnitWithDamage(1, cards.SOR.AllianceXWing, 0)
        .AddUnitWithDamage(2, cards.SOR.BFMarine, 1)
        .AddUnitWithDamage(2, cards.SOR.AdmiralAckbar, 1)
        .AddUnitWithDamage(2, cards.SOR.BrightHope, 1)
        .AddUnitWithDamage(2, cards.SOR.FleetLieutenant, 0)
        .FlushAsync(com.BeginTestCallback)
      ;
      //act
      const gameplay = new GamePlay(browser);
      await gameplay
        .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2)
        .RunAsync()
      ;
      //assert
      gameplay.Assert()
        .TheirGroundUnitIsGone(3)
        .TheirGroundUnitPieceEquals(1, 3, '3')
        .TheirGroundUnitPieceIsOverlay(2, 3)
        .TheirSpaceUnitPieceEquals(1, 3, '3')
        .MySpaceUnitPieceEquals(1, 3, '1')
        .MySpaceUnitPieceIsOverlay(2, 3)
        .MyGroundUnitPieceEquals(1, 3, '1')
        .MyGroundUnitIsThere(2)
        .RunAsync()
      ;
    }
}