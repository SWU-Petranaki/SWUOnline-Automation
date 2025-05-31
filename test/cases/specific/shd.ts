import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
    com, p,
    player1Window, player2Window,
    customAsserts,
    gameName
} from '@utils/util';

const LurkingTieGameStateAsync = async function() {
  const gameState = new GameState(gameName);
  await gameState.LoadGameStateLinesAsync();
  await gameState.ResetGameStateLines()
    .AddBase(1, cards.SOR.ChopperBase)
    .AddLeader(1, cards.SOR.MoffTarkinLeader)
    .AddBase(2, cards.SOR.ECL)
    .AddLeader(2, cards.SOR.SabineLeader)
    .FillResources(1, cards.SOR.CraftySmuggler, 3)
    .AddCardToHand(1, cards.TWI.SanctioneerShuttle)
    .AddCardToHand(1, cards.TWI.EliteP)
    .AddCardToHand(1, cards.TWI.MercilessContest)
    .AddCardToHand(1, cards.SOR.Waylay)
    .AddCardToHand(2, cards.SOR.Waylay)
    .AddUnit(1, cards.SHD.LurkingTie)
    .AddUnit(1, cards.SHD.LurkingTie)
    .AddUnit(2, cards.SHD.LurkingTie)
    .AddUnit(2, cards.SOR.Greedo)
    .FlushAsync(com.BeginTestCallback)
  ;
}

export const SpecificSHDCases = {
  'Lurking TIE: avoids enemy capture': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    await LurkingTieGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1)[0];
    await browser.assert.equal(lastLog, 'Lurking TIE Phantom avoided capture.');
  },
  'Lurking TIE: avoids enemy damage': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    await LurkingTieGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, 'SPACE', 1, 3);
  },
  'Lurking TIE: defeats (merciless contest)': async function () {
    //arrange
    await LurkingTieGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(1))
    ;

    await browser.window.switchTo(player1Window).refresh();
    //assert
    await browser.assert.not.elementPresent(com.AllySpaceUnit(2));
    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1)[0];
    await browser.assert.equal(lastLog, 'Lurking TIE Phantom cannot be defeated by enemy card effects.');
  },
  'Lurking TIE: damaged by self': process.env.FULL_REGRESSION !== "true" ? '' : async function() {
    //arrange
    await LurkingTieGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 3), '1');
  },
  'Lurking TIE: bounced by enemy': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    await LurkingTieGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.elementsCount(com.TheirHandDivs, 2);
  },
  'Lurking TIE: bounced by self': process.env.FULL_REGRESSION !== "true" ? '' : async function() {
    //arrange
    await LurkingTieGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.AllySpaceUnit(2));
    await browser.assert.elementsCount(com.MyHandDivs, 4);
  },
  Lurking_Tie_Avenger_interaction: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SHD.KyloRenLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 9)
      .FillResources(2, cards.SOR.CraftySmuggler, 4)
      .AddCardToHand(1, cards.SOR.Avenger)
      .AddUnit(2, cards.SHD.LurkingTie)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetTheirSpaceUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .TheirSpaceUnitIsThere(1)
      .MyResourcesEquals('0/9')
      .RunAsync()
    ;
  },
  'Snoke wipes non-leaders and token units': async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SHD.RemnantScienceFacility)
      .AddLeader(1, cards.SHD.CadBaneLeader)
      .AddBase(2, cards.SHD.RemnantScienceFacility)
      .AddLeader(2, cards.SOR.SabineLeader, true)
      .FillResources(1, cards.SOR.CraftySmuggler, 8)
      .AddCardToHand(1, cards.SHD.Snoke)
      .AddUnit(2, cards.SOR.TieLnFighter, false, true, 3,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.TWI.CloneTrooper)
      .AddUnit(2, cards.TWI.BattleDroid)
      .AddUnit(2, cards.SOR.SabineLeaderUnit, false, true, 3)
      .AddUnit(2, cards.TWI.WTTradeOfficial, false, true, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //pre-assert
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemySpaceUnit(1), 1), 'ASAJJ VENTRESS');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemySpaceUnit(1), 4), '3');
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, 'GROUND', 1, 3);
    await customAsserts.EnemyUnitDivPieceIsOverlay(browser, 'GROUND', 2, 3);
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(3), 3), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(4), 3), '1');
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(2));
  },
  Migs_Mayfeld_discard_ping_once_per_round: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.SHD.KyloRenLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SOR.ForceThrow)
      .AddCardToHand(1, cards.SOR.ForceThrow)
      .AddCardToHand(2, cards.SOR.BFMarine)
      .AddUnit(1, cards.SHD.MigsMayfeld)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().ClickMyLeader().MultiChoiceButton(1).TargetMyHandCard(1).TargetTheirBase()
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).MultiChoiceButton(2)
      .SwitchPlayerWindow().WaitForMyHand().TargetMyHandCard(1)
      .SwitchPlayerWindow().WaitForMyBase().TargetTheirBase()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .TheirHandIsEmpty()
      .MyResourcesEquals('1/2')
      .MyGroundUnitPieceEquals(1, 1, '4')
      .TheirBaseDamageEquals('2')
      .RunAsync()
  },
  Migs_Mayfeld_Pillage_only_one_ping: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.SHD.KyloRenLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 4)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SHD.Pillage)
      .AddCardToHand(2, cards.SOR.BFMarine)
      .AddCardToHand(2, cards.SOR.BFMarine)
      .AddUnit(1, cards.SHD.MigsMayfeld)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).MultiChoiceButton(2)
      .SwitchPlayerWindow().WaitForMyHand().TargetMyHandCard(1).TargetMyHandCard(1)
      .SwitchPlayerWindow().WaitForMyBase().TargetTheirBase().TargetTheirBase()
      .SwitchPlayerWindow().SwitchPlayerWindow()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .TheirHandIsEmpty()
      .MyResourcesEquals('0/4')
      .TheirBaseDamageEquals('2')
      .RunAsync()
    ;
  }
}