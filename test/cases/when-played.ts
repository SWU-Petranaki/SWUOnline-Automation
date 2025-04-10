import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  src
} from '../utils/util';

export const WhenPlayedCases = {
  When_Played_UWing_Many_Played: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase).AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.EchoBase).AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .AddCardToHand(1, cards.SOR.UWing)
      .AddCardToDeck(1, cards.SOR.BFMarine, 2)
      .AddCardToDeck(1, cards.SOR.MonMothma)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToDeck(1, cards.SOR.ModdedCohort)
      .AddCardToDeck(1, cards.SOR.BFMarine, 2)
      .AddCardToDeck(1, cards.SOR.R2D2)
      .AddCardToDeck(1, cards.SOR.BFMarine, 3)
      .AddCardToDeck(1, cards.SOR.AdmiralAckbar)
      .AddUnit(2, cards.SHD.Kuiil)
      .AddUnit(2, cards.SOR.LukeSkywalker)
      .AddUnit(1, cards.SOR.R2D2)
      .AddUnit(1, cards.SOR.MonMothma)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .WaitForCheckboxes().Check(3).Check(5).Check(8).Submit()
      .TargetMyGroundUnit(3).Pass().Pass()
      .TargetMyGroundUnit(4).Pass().ChooseButton(1, 2)
      .ChooseYes().TargetTheirGroundUnit(1)
      .WaitForCheckboxes().Check(1).Submit()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirGroundUnitIsGone(2)
      .MyGroundUnitPieceEquals(3, 3, '2')
      .MyHandCardIs(1, 'Admiral Ackbar')
      .RunAsync()
    ;
  },
  'When Played: Darth Vader multi then draw': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase).AddLeader(1, cards.SOR.MoffTarkinLeader)
      .AddBase(2, cards.SOR.TarkinTown).AddLeader(2, cards.SOR.MoffTarkinLeader)
      .FillResources(1, cards.SOR.BFMarine, 10)
      .AddCardToHand(1, cards.SOR.DarthVader)
      .AddCardToHand(1, cards.SHD.NoBargain)
      .AddCardToDeck(1, cards.SOR.FLSnowTrooper)
      .AddCardToDeck(1, cards.SOR.GideonHask, 7)
      .AddCardToDeck(1, cards.SOR.DSStormTrooper)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToDeck(1, cards.SHD.PhaseIIIDarkTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).Pass()
      .WaitForCheckboxes().Check(1).Check(9).Submit()
      .ChooseYes().TargetTheirGroundUnit(1)
      .SwitchPlayerWindow()
      .WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow()
      .WaitForMyHand().PlayFromHand(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirGroundUnitIsGone(2)
      .MyGroundUnitIsThere(2)
      .MyGroundUnitIsThere(3)
      .MyGroundUnitPieceEquals(1, 3, '3')
      .MyHandCardIs(1, 'Phase-III Dark Trooper')
      .RunAsync()
    ;
  },
  'When Played: Darth Vader cant pull pilots as upgrades': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase).AddLeader(1, cards.SOR.MoffTarkinLeader)
      .AddBase(2, cards.SOR.TarkinTown).AddLeader(2, cards.SOR.MoffTarkinLeader)
      .FillResources(1, cards.SOR.BFMarine, 10)
      .AddCardToHand(1, cards.SOR.DarthVader)
      .AddCardToDeck(1, cards.JTL.InterceptorAce)
      .AddUnit(1, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).Pass()
      .WaitForCheckboxes().Check(1).Submit()
      .ChooseYes().TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirGroundUnitIsGone(2)
      .MyGroundUnitIsThere(1)
      .MySpaceUnitIsThere(1)
      .RunAsync()
    ;
  },
  'When Played: Leia JTL lets Pilot attack': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 16")
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 3)
      .AddCardToHand(1, cards.JTL.Leia)
      .AddUnit(1, cards.JTL.Mandalorian)
      .AddUnit(1, cards.JTL.XWing, false, true, 1,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.Chewbacca, 1, true).Build())
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '8');
    await browser.assert.textEquals(com.TheirBaseDamage, '22');
  },
  'When Played: Leia JTL lets Piloted space unit attack': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 16")
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 3)
      .AddCardToHand(1, cards.JTL.Leia)
      .AddUnit(1, cards.JTL.Mandalorian)
      .AddUnit(1, cards.JTL.XWing, false, true, 1,
        gameState.SubcardBuilder().AddUpgrade(cards.JTL.Chewbacca, 1, true).Build())
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '8');
    await browser.assert.textEquals(com.TheirBaseDamage, '22');
  },
}
