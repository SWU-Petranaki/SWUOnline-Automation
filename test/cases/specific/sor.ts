import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName
} from '@utils/util';

const GideonHaskGameStateAsync = async () => {
  const gameState = new GameState(gameName);
  await gameState.LoadGameStateLinesAsync();
  await gameState.ResetGameStateLines()
    .SetBasesDamage("4 9")
    .AddBase(1, cards.SOR.ECL)
    .AddLeader(1, cards.SOR.KrennicLeader, true)
    .AddBase(2, cards.SOR.ChopperBase)
    .AddLeader(2, cards.SOR.SabineLeader)
    .AddResource(2, cards.SOR.CraftySmuggler)
    .AddCardToHand(2, cards.SHD.DaringRaid)
    .AddUnit(1, cards.SOR.KrennicLeaderUnit, true)
    .AddUnit(1, cards.SOR.GideonHask, false, false, 3)
    .AddUnit(2, cards.SOR.DSStormTrooper)
    .FlushAsync(com.BeginTestCallback)
  ;
}


export const SpecificSORCases = {
  Gideon_attacked_trades_gives_xp: async function () {
    //arrange
    await GideonHaskGameStateAsync();
    //act
    await browser
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), 'EXPERIENCE');
  },
  'Gideon Hask: opponent pings self': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    await GideonHaskGameStateAsync();
    //act
    await browser
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), 'EXPERIENCE');
  },
  'Gideon Hask: pinged to death': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    await GideonHaskGameStateAsync();
    //act
    await browser
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), '2');
  },
  Gideon_Hask_defeats_enemy_unit_gives_xp: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("4 9")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.KrennicLeader, true)
      .AddBase(2, cards.SOR.ChopperBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddUnit(1, cards.SOR.KrennicLeaderUnit, true)
      .AddUnit(1, cards.SOR.GideonHask)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(2).AttackWithMyGroundUnit(2).TargetTheirGroundUnit(1).TargetMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitPieceEquals(1, 1, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 2, '3')
      .MyGroundUnitPieceEquals(1, 3, '8')
      .MyGroundUnitPieceEquals(2, 1, '6')
      .MyGroundUnitPieceEquals(2, 2, '5')
      .MyGroundUnitPieceEquals(2, 3, '3')
      .RunAsync()
    ;
  },
  Gideon_Hask_sacrifices_into_enemy_unit_no_xp: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("4 9")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.KrennicLeader, true)
      .AddBase(2, cards.SOR.ChopperBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddUnit(1, cards.SOR.KrennicLeaderUnit, true)
      .AddUnit(1, cards.SOR.GideonHask)
      .AddUnit(2, cards.SHD.KraytDragon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(2).AttackWithMyGroundUnit(2).TargetTheirGroundUnit(1).TargetMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitPieceEquals(1, 1, '2')
      .MyGroundUnitPieceEquals(1, 2, '7')
      .MyGroundUnitIsGone(2)
      .RunAsync()
    ;
  },
  Gideon_Hask_trades_into_enemy_unit_gives_xp: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("4 9")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.KrennicLeader, true)
      .AddBase(2, cards.SOR.ChopperBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddUnit(1, cards.SOR.KrennicLeaderUnit, true)
      .AddUnit(1, cards.SOR.GideonHask, false, true, 3)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(2).AttackWithMyGroundUnit(2).TargetTheirGroundUnit(1).TargetMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitPieceEquals(1, 1, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 2, '3')
      .MyGroundUnitPieceEquals(1, 3, '8')
      .MyGroundUnitIsGone(2)
      .RunAsync()
    ;
  },
  Gideon_Hask_no_xp_when_defeated: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 9")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.KrennicLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddUnit(1, cards.SOR.GideonHask)
      .AddUnit(1, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SHD.KraytDragon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForMySpaceUnit().TargetMySpaceUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals('9')
      .MyBaseDamageEquals('10')
      .MySpaceUnitPieceEquals(1, 1, '2')
      .MySpaceUnitPieceEquals(1, 2, '1')
      .RunAsync()
    ;
  },
  Iden_Versio_leader_unit_no_heal_when_defeated: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 9")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.KrennicLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddUnit(1, cards.SOR.IdenLeaderUnit, true)
      .AddUnit(2, cards.SHD.KraytDragon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyGroundUnit().AttackWithMyGroundUnit(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheyHaveNoGroundUnits()
      .TheirBaseDamageEquals('11')
      .MyBaseDamageEquals('9')
      .RunAsync()
    ;
  },
  UWing_one_unit_swap_turn: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 0")
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .FillResources(2, cards.SOR.AdmiralPiett, 2)
      .AddCardToHand(1, cards.SOR.UWing)
      .AddCardToDeck(1, cards.SOR.MillenniumFalcon)
      .AddCardToDeck(1, cards.SOR.BFMarine, 9)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).WaitForCheckboxes().Check(1).Submit().TargetMySpaceUnit(1)
      .SwitchPlayerWindow()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('0')
    ;
  },
  UWing_two_units_swap_turn: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 0")
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .FillResources(2, cards.SOR.AdmiralPiett, 2)
      .AddCardToHand(1, cards.SOR.UWing)
      .AddCardToDeck(1, cards.SOR.MillenniumFalcon)
      .AddCardToDeck(1, cards.SOR.BFMarine, 9)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).WaitForCheckboxes().Check(1).Check(2).Submit().Pass().TargetMySpaceUnit(1)
      .SwitchPlayerWindow()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('0')
    ;
  },
  UWing_three_units_swap_turn: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 0")
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .FillResources(2, cards.SOR.AdmiralPiett, 2)
      .AddCardToHand(1, cards.SOR.UWing)
      .AddCardToDeck(1, cards.SOR.MillenniumFalcon)
      .AddCardToDeck(1, cards.SOR.BFMarine, 9)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).WaitForCheckboxes().Check(1).Check(2).Check(3).Submit()
      .ClickLayerTile(3).Pass().TargetMySpaceUnit(1)
      .SwitchPlayerWindow()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('0')
    ;
  }
}