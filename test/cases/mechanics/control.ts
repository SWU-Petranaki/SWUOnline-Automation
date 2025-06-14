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

export const ControlCases = {
  Traitorous_enemy_joins_my_side: async function () {
  //arrange
  const gameState = new GameState(gameName);
  await gameState.LoadGameStateLinesAsync();
  await gameState.ResetGameStateLines()
    .AddBase(1, cards.SOR.ECL)
    .AddLeader(1, cards.SOR.SabineLeader)
    .AddBase(2, cards.SOR.ECL)
    .AddLeader(2, cards.SOR.SabineLeader)
    .FillResources(1, cards.SOR.BFMarine, 5)
    .AddCardToHand(1, cards.SOR.Traitorous)
    .AddUnit(1, cards.SOR.SabineUnit, false, false)
    .AddUnitWithUpgrade(2, cards.SOR.CraftySmuggler, cards.generic.Shield)
    .FlushAsync(com.BeginTestCallback)
  ;
  //act
  await browser
    .waitForElementPresent(com.MyHand)
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.HandCard(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.EnemyGroundUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
  ;
  //assert
  await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
  await browser.assert.elementPresent(com.AllyGroundUnit(2));
  await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 1), 'TRAITOROUS');
  },
  Traitorous_enemy_returns_when_upgrade_defeated: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 1)
      .AddCardToHand(1, cards.SOR.Confiscate)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper, false, true, 0,
        gameState.SubcardBuilder().AddExperience(2, 8).Build())
      .AddUnit(2, cards.SOR.CraftySmuggler, false, true, 0,
        gameState.SubcardBuilder().AddShield(2).AddUpgrade(cards.SOR.Traitorous, 2).Build(), 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ChooseButton(2, 1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(2));
    await browser.assert.elementPresent(com.AllyGroundUnit(2));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 1), '2');
  },
  Traitorous_fails_on_piloted_leader_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.JTL.AsajjLeader, true)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.Traitorous)
      .AddUnit(1, cards.SOR.BFMarine)
      .AddUnit(2, cards.SOR.TieLnFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 2, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().ClickHandCard(1)
      .TargetTheirSpaceUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsThere(1)
      .MySpaceUnitIsGone(1)
      .RunAsync()
    ;
  },
  Change_Of_Heart_returns_at_end: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.SOR.ChangeOfHeart)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DarthVader)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.elementPresent(com.AllyGroundUnit(2));
    //pass turn
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.ClaimButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ClaimButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.not.elementPresent(com.AllyGroundUnit(2));
  },
  Mercenary_Gunship_both_players_can_take_control: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 4)
      .FillResources(2, cards.SOR.BFMarine, 4)
      .AddUnit(2, cards.SHD.MercenaryGunship)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.elementPresent(com.AllySpaceUnit(1));
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.elementPresent(com.AllySpaceUnit(1));
  },
  Choose_Sides_on_opponent: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .AddCardToHand(1, cards.SHD.ChooseSides)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DarthVader)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 2), '1');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 1), '5');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 2), '7');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 1), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 2), '1');
  },
  Choose_Sides_cant_choose_piloted_leader_units: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.HanSoloLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.JTL.AsajjLeader, true)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .AddCardToHand(1, cards.SHD.ChooseSides)
      .AddUnit(1, cards.SOR.Snowspeeder)
      .AddUnit(1, cards.SOR.Snowspeeder, false, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SOR.SabineLeaderUnit, 1, true).Build())
      .AddUnit(1, cards.SOR.Snowspeeder)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.TieLnFighter, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.TieLnFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.AllyGroundUnit(2));
    //act
    await browser.click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemySpaceUnit(2));
  },
  Sly_Moore_cant_take_token_with_pilot_leader: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SHD.CadBaneLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.JTL.AsajjLeader, true)
      .FillResources(1, cards.TWI.SlyMoore, 3)
      .AddCardToHand(1, cards.TWI.SlyMoore)
      .AddUnit(2, cards.JTL.TieFighter, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 2, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsGone(1)
      .TheirLeaderHasUsedEpicAction()
      .RunAsync()
    ;
  },
  No_Glory_Chewbacca_unit_still_defeated: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.ThrawnLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 5)
      .AddCardToHand(1, cards.JTL.NoGloryOnlyResults)
      .AddUnit(2, cards.JTL.Chewbacca)
      .AddUnit(2, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().ClickHandCard(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirGroundUnitIsGone(1)
      .TheirSpaceUnitIsThere(1)
      .RunAsync()
    ;
  },
  No_Glory_Chewbacca_pilot_still_defeated: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.ThrawnLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 5)
      .AddCardToHand(1, cards.JTL.NoGloryOnlyResults)
      .AddUnit(2, cards.JTL.XWing)
      .AddUnit(2, cards.JTL.XWing, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.Chewbacca, 2).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().ClickHandCard(1).TargetTheirSpaceUnit(2)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsThere(1)
      .TheirSpaceUnitIsGone(2)
      .RunAsync()
    ;
  },
  No_Glory_RR_Cant_Ping_LurkingTie: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.ThrawnLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 5)
      .AddCardToHand(1, cards.JTL.NoGloryOnlyResults)
      .AddUnit(2, cards.SHD.LurkingTie)
      .AddUnit(2, cards.SOR.RuthlessRaider)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetTheirSpaceUnit(2).ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsThere(1)
      .TheirSpaceUnitIsGone(2)
      .MySpaceUnitIsGone(1)
      .TheirBaseDamageEquals('4')
      .RunAsync()
  },
  // GIVEN: i have base SOR.ECL; i have leader SOR.KrennicLeader; they have base SOR.ECL; they have leader SOR.SabineLeader; i have 5 SOR.BFMarine in my resources; they have 2 SOR.BFMarine in their resources; i have JTL.NoGloryOnlyResults in hand; they have SHD.LurkingTie in play;;
  // WHEN: i play the first card from my hand;;
  // EXPECT: they have no space units;;
  No_Glory_Lurking_Tie: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.KrennicLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.JTL.NoGloryOnlyResults)
      .AddUnit(2, cards.SHD.LurkingTie)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsGone(1)
      .RunAsync()
    ;
  }
}