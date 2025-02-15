import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName
} from '../utils/util';

export const BoardWipeCases = {
  'Iden Versio Leader Unit SLB': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 9")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.IdenLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 8)
      .AddCardToHand(1, cards.SOR.SLB)
      .AddUnit(1, cards.SOR.IdenLeaderUnit, true)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.AdmiralAckbar, false, true, 0, gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .WaitForAnimation()
      .Pass()
      .TargetMyBase()
      .RunAsync()
    ;
    //assert
    await gameplay
      .Assert()
      .MyBaseDamageEquals('15')
      .TheirBaseDamageEquals('9')
      .RunAsync()
    ;
  },
  'Iden Versio Leader Unit SLB Two Idens': process.env.FULL_REGRESSION !== 'true' ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 20")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.IdenLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.IdenLeader, true)
      .FillResources(1, cards.SOR.CraftySmuggler, 8)
      .AddCardToHand(1, cards.SOR.SLB)
      .AddUnit(1, cards.SOR.IdenLeaderUnit, true)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.IdenLeaderUnit, true, true, 0, gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .WaitForAnimation()
      .Pass()
      .TargetMyBase()
      .RunAsync()
    ;
    //assert
    await gameplay
      .Assert()
      .MyBaseDamageEquals('17')
      .TheirBaseDamageEquals('18')
      .RunAsync()
    ;
  },
  'Iden Versio Leader Unit Christophsis': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 9")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.IdenLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 15)
      .AddCardToHand(1, cards.TWI.Christophsis)
      .AddUnit(1, cards.SOR.IdenLeaderUnit, true)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.AdmiralAckbar, false, true, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .WaitForAnimation()
      .Submit()
      .Pass()
      .TargetMyBase()
      .RunAsync()
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '15');
    await browser.assert.textEquals(com.TheirBaseDamage, '9');
  },
  'Iden Versio Leader Unit Christophsis Two Idens': process.env.FULL_REGRESSION !== 'true' ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 20")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.IdenLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.IdenLeader, true)
      .FillResources(1, cards.SOR.CraftySmuggler, 15)
      .AddCardToHand(1, cards.TWI.Christophsis)
      .AddUnit(1, cards.SOR.IdenLeaderUnit, true)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.IdenLeaderUnit, false, true, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .WaitForAnimation()
      .Submit()
      .Pass()
      .TargetMyBase()
      .RunAsync()
    ;
    //assert
    await gameplay
      .Assert()
      .MyBaseDamageEquals('17')
      .TheirBaseDamageEquals('20')
      .RunAsync()
    ;
  },
  'Gideon Hask gives XP to rescued captive': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 9")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.KrennicLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 8)
      .AddCardToHand(1, cards.SOR.SLB)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(1, cards.SOR.GideonHask)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter, false, true, 0,
        gameState.SubcardBuilder().AddCaptive(cards.SOR.CraftySmuggler, 1).Build())
      .AddUnit(2, cards.SOR.AdmiralAckbar, false, true, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .Pass()
      .TargetMyGroundUnit(1)
      .TargetMyGroundUnit(1)
      .TargetMyBase()
      .TargetMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    await gameplay
      .Assert()
      .MyGroundUnitPieceEquals(1, 1, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 2, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 3, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 4, '5')
      .RunAsync()
    ;
  },
  'Two Gideon Hasks give XP to rescued captives': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("26 9")
      .AddBase(1, cards.SOR.DagobahSwamp)
      .AddLeader(1, cards.SOR.KrennicLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.KrennicLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 8)
      .AddCardToHand(1, cards.SOR.SLB)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(1, cards.SOR.GideonHask)
      .AddUnit(1, cards.SOR.DarthVader, false, true, 0,
        gameState.SubcardBuilder().AddCaptive(cards.SOR.BFMarine, 2).Build())
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter, false, true, 0,
        gameState.SubcardBuilder().AddCaptive(cards.SOR.CraftySmuggler, 1).Build())
      .AddUnit(2, cards.SOR.AdmiralAckbar, false, true, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.TopTarget, 1).Build())
      .AddUnit(2, cards.SOR.GideonHask)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .Pass()
      .TargetMyGroundUnit(1)
      .TargetMyGroundUnit(1)
      .TargetMyBase()
      .TargetMyGroundUnit(1)
      .TargetMyGroundUnit(1)
      .WaitForAnimation()
      .SwitchPlayerWindow()
      .WaitForMyGroundUnit(1)
      .TargetMyGroundUnit(1)
      .TargetMyGroundUnit(1)
      .TargetMyGroundUnit(1)
      .RunAsync()
    ;
    //assert
    await gameplay
      .Assert()
      .MyBaseDamageEquals('9')
      .TheirBaseDamageEquals('20')
      .MyGroundUnitPieceEquals(1, 1, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 2, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 3, 'EXPERIENCE')
      .MyGroundUnitPieceEquals(1, 4, '6')
      .TheirGroundUnitPieceEquals(1, 1, 'EXPERIENCE')
      .TheirGroundUnitPieceEquals(1, 2, 'EXPERIENCE')
      .TheirGroundUnitPieceEquals(1, 3, 'EXPERIENCE')
      .TheirGroundUnitPieceEquals(1, 4, 'EXPERIENCE')
      .TheirGroundUnitPieceEquals(1, 5, '6')
      .RunAsync()
    ;
  }
}