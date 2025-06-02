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

export const BounceCases = {
  Waylay_tokens: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.Waylay, 6)
      .AddCardToHand(1, cards.SOR.Waylay)
      .AddCardToHand(1, cards.SOR.Waylay)
      .AddUnit(2, cards.TWI.BattleDroid)
      .AddUnit(2, cards.TWI.CloneTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .TargetTheirGroundUnit(1)
      .SwitchPlayerWindow()
      .WaitForClaimButton()
      .ClaimInitiative()
      .SwitchPlayerWindow()
      .WaitForMyHand()
      .ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirDiscardIsEmpty()
      .TheirHandIsEmpty()
      .TheyHaveNoGroundUnits()
      .RunAsync()
    ;
  },
  Ma_Klounkee_cannot_bounce_own_piloted_leader_unit:process.env.FULL_REGRESSION !== "true" ? '' : async function () {
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
      .AddUnit(1, cards.SOR.EscortSkiff, false, false, 1)
      .AddUnit(1, cards.SOR.EscortSkiff, false, false, 1,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(1, cards.SOR.EscortSkiff, false, false, 1)
      .AddUnit(2, cards.SOR.BFMarine)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsNotPlayable(2)
      .RunAsync()
    ;
  },
  Evacuate_unique_captives_and_ignore_leaders: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader, true)
      .FillResources(1, cards.SOR.Waylay, 6)
      .AddCardToHand(1, cards.SHD.Evacuate)
      .AddUnit(2, cards.SOR.SabineLeaderUnit, true)
      .AddUnit(2, cards.TWI.BattleDroid, false, false, 0,
        gameState.SubcardBuilder().AddCaptive(cards.SOR.LukeSkywalker, 1).Build())
      .AddUnit(2, cards.TWI.BattleDroid, false, false, 0,
        gameState.SubcardBuilder().AddCaptive(cards.SOR.LukeSkywalker, 1).Build())
      .AddUnit(2, cards.SOR.TieLnFighter, false, false, 0, gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 2, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirGroundUnitIsThere(1)
      .TheirSpaceUnitIsThere(1)
      .PlayerPickSpanTextEquals('You have two of this unique card; choose one to destroy ')
      .RunAsync()
    ;
  },
  Waylay_cant_bounce_piloted_leader_unit: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 3)
      .AddCardToHand(1, cards.SOR.Waylay)
      .AddUnit(2, cards.JTL.XWing)
      .AddUnit(2, cards.JTL.XWing, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemySpaceUnit(2));
  },
  Bright_Hope_cant_bounce_piloted_leader_unit: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader, true)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.Waylay, 4)
      .AddCardToHand(1, cards.SOR.BrightHope)
      .AddUnit(1, cards.SOR.Snowspeeder)
      .AddUnit(1, cards.SOR.Snowspeeder, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.AllyGroundUnit(2));
  },
  Cunning_cant_bounce_piloted_leader_unit: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 4)
      .AddCardToHand(1, cards.SOR.Cunning)
      .AddUnit(2, cards.SOR.Snowspeeder)
      .AddUnit(2, cards.SOR.Snowspeeder, false, true, 0,
        gameState.SubcardBuilder()
          .AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true)
          .AddUpgrade(cards.TWI.PerilousPosition, 1)
          .Build())
      .AddUnit(2, cards.SOR.Snowspeeder)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ModalOption(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ModalOption(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemyGroundUnit(2));
  },
  Cantina_Bouncer_cant_bounce_piloted_leader_unit: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 5)
      .AddCardToHand(1, cards.SOR.CantinaBouncer)
      .AddUnit(2, cards.SOR.Snowspeeder)
      .AddUnit(2, cards.SOR.Snowspeeder, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.Snowspeeder)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemyGroundUnit(2));
  },
  Enfys_Nest_cant_bounce_piloted_leader_unit: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 7)
      .AddCardToHand(1, cards.TWI.EnfysNest)
      .AddUnit(2, cards.SOR.Snowspeeder)
      .AddUnit(2, cards.SOR.GreenSquadAWing, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.Snowspeeder)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemySpaceUnit(1));
  },
  Clear_The_Field_cant_bounce_piloted_leader_unit: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 2)
      .AddCardToHand(1, cards.TWI.ClearTheField)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.TieLnFighter, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.SOR.TieLnFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemySpaceUnit(2));
    //act
    await browser
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.elementsCount(com.TheirHandDivs, 2);
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemySpaceUnit(1), 1), 'ASAJJ VENTRESS');
  },
  Spare_The_Target_cant_bounce_piloted_leader_unit: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.Waylay, 3)
      .AddCardToHand(1, cards.SHD.SpareTheTarget)
      .AddUnit(2, cards.SHD.CartelTurncoat)
      .AddUnit(2, cards.SHD.CartelTurncoat, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.SHD.CartelTurncoat)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemySpaceUnit(2));
  },
  Bamboozle_on_pilot_leader_not_in_hand: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase).AddLeader(1, cards.JTL.HanSoloLeader)
      .AddBase(2, cards.generic.BlueBase).AddLeader(2, cards.JTL.LukeLeader, true)
      .FillResources(1, cards.SOR.Waylay, 2)
      .AddCardToHand(1, cards.SOR.Bamboozle)
      .AddUnit(2, cards.SHD.CartelTurncoat, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.LukeLeaderUnit, 2, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().ClickHandCard(1).TargetTheirSpaceUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsThere(1, true)
      .TheirLeaderHasUsedEpicAction()
      .TheirHandIsEmpty()
      .RunAsync()
    ;
  }
}