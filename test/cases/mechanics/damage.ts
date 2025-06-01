import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, src, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '@utils/util';

export const DamageCases = {
  Overwhelming_Barrage_pings_simultaneously: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.TWI.LairOfGrievous)
      .AddLeader(1, cards.SHD.BosskLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.OB)
      .AddUnit(1, cards.SOR.DSStormTrooper, false, true, 0,
        gameState.SubcardBuilder().AddExperience(1,3).Build())
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.TWI.Malevolence, false, true, 3)
      .AddUnit(2, cards.SOR.SLT)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);//TODO: verify self does not have counters button
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetMyGroundUnit(1)
        .ClickTheirGroundUnitDmgInc(2, 3)
        .ClickTheirGroundUnitDmgInc(1)
        .ClickTheirSpaceUnitDmgInc(1, 4)
        .RunAsync()
      ;
    //assert
    gameplay.Assert()
      .TheirResourcesEquals('0/0')
      .RunAsync()
    ;
    //act
    await gameplay.Confirm().PassTurn()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirResourcesEquals('1/1')
      .TheirGroundUnitIsThere(1)
      .TheirGroundUnitPieceEquals(1, 1, '1')
      .TheirGroundUnitPieceEquals(1, 2, '1')
      .TheirGroundUnitIsGone(2)
      .TheirSpaceUnitIsGone(1)
      .RunAsync()
    ;
  },
  Overwhelming_Barrage_pings_both: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.TWI.LairOfGrievous)
      .AddLeader(1, cards.SHD.BosskLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.OB)
      .AddUnit(1, cards.SOR.DSStormTrooper, false, true, 0,
        gameState.SubcardBuilder().AddExperience(1,3).Build())
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.TWI.Malevolence, false, true, 3)
      .AddUnit(2, cards.SOR.SLT)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetMyGroundUnit(2)
        .ClickTheirGroundUnitDmgInc(1)
        .ClickTheirGroundUnitDmgInc(2)
        .ClickTheirSpaceUnitDmgInc(1)
        .ClickMyGroundUnitDmgInc(1, 2)
        .Confirm()
        .RunAsync()
      ;
    ;
    //assert
    gameplay.Assert()
      .TheirResourcesEquals('1/1')
      .TheirGroundUnitIsGone(2)
      .TheirGroundUnitPieceEquals(1, 3, '1')
      .TheirSpaceUnitPieceEquals(1, 3, '4')
      .MyGroundUnitPieceEquals(1, 6, '2')
      .MyGroundUnitPieceEquals(2, 1, '5')
      .RunAsync()
    ;
  },
  Overwhelming_Barrage_pings_only_self: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.TWI.LairOfGrievous)
      .AddLeader(1, cards.SHD.BosskLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.OB)
      .AddUnit(1, cards.SOR.DSStormTrooper, false, true, 0,
        gameState.SubcardBuilder().AddExperience(1,3).Build())
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.TWI.Malevolence, false, true, 3)
      .AddUnit(2, cards.SOR.SLT)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetMyGroundUnit(2)
      .ClickMyGroundUnitDmgInc(1, 5)
      .Confirm()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsThere(1)
      .TheirGroundUnitIsThere(1)
      .TheirGroundUnitIsThere(2)
      .MyGroundUnitIsGone(2)
      .MyGroundUnitIsThere(1)
      .MyGroundUnitPieceEquals(1, 1, '5')
      .RunAsync()
    ;
  },
  Overwhelming_Barrage_used_only_for_buff: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.TWI.LairOfGrievous)
      .AddLeader(1, cards.SHD.BosskLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.OB)
      .AddUnit(1, cards.SOR.DSStormTrooper, false, true, 0,
        gameState.SubcardBuilder().AddExperience(1,3).Build())
      .AddUnit(1, cards.SOR.DisablingFF)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetMyGroundUnit(1)
        .PassTurn()
        .RunAsync()
      ;
    //assert
    gameplay.Assert()
      .MyGroundUnitPieceEquals(1, 4, '8')
      .RunAsync()
    ;
  },
  'TarkinTown cannot hit piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .AddUnit(2, cards.SOR.Snowspeeder, false, false, 1)
      .AddUnit(2, cards.SOR.Snowspeeder, false, false, 1,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.Snowspeeder, false, false, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemyGroundUnit(2));
  },
  Palp_SOR_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 8)
      .AddCardToHand(1, cards.SOR.PalpUnit)
      .AddUnit(2, cards.SOR.DarthVader)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .ClickTheirGroundUnitDmgInc(2)
      .ClickTheirGroundUnitDmgInc(1, 5)
      .Confirm()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirGroundUnitIsGone(2)
      .TheirGroundUnitPieceEquals(1, 3, '5')
      .RunAsync()
    ;
  },
  Palp_SOR_unit_no_enemies: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 8)
      .FillResources(2, cards.SOR.DSStormTrooper, 3)
      .AddCardToHand(1, cards.SOR.PalpUnit)
      .AddCardToHand(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1)
      .SwitchPlayerWindow()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheyHaveNoSpaceUnits()
      .TheirGroundUnitIsThere(1)
      .MyGroundUnitIsThere(1)
      .RunAsync()
    ;
  },
  Vambrace_Flamethrower_hits_ground_units: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.PalpLeader)
      .AddUnit(2, cards.SOR.DarthVader)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)//TODO: add a check for has no counter buttons
      .AddUnit(1, cards.SOR.DSStormTrooper, false, true, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.VambraceFlameThrower, 3).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(1).ClickMyGroundUnit(1).TargetTheirBase()
      .ClickTheirGroundUnitDmgInc(2)
      .ClickTheirGroundUnitDmgInc(1, 2)
      .Confirm()
      .RunAsync()
    ;

    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals('4')
      .TheirGroundUnitPieceEquals(1, 3, '2')
      .TheirGroundUnitIsGone(2)
      .RunAsync()
    ;
  },
  Vambrace_Flamethrower_no_ground_enemies: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(2, cards.SOR.DSStormTrooper, 3)
      .AddCardToHand(2, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(1, cards.SOR.DSStormTrooper, false, true, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SHD.VambraceFlameThrower, 3).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(1).ClickMyGroundUnit(1).TargetTheirBase()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1)
      .SwitchPlayerWindow()
      .RunAsync()
    ;

    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals('4')
      .TheirGroundUnitIsThere(1)
      .RunAsync()
    ;
  },
  IG2000_only_does_1_damage_per_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 4)
      .AddCardToHand(1, cards.JTL.IG2000)
      .AddUnit(2, cards.SOR.DarthVader, false, false, 6)
      .AddUnit(2, cards.SOR.CraftySmuggler, false, false, 1)
      .AddUnit(2, cards.JTL.HoundsTooth, false, false, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .ClickTheirSpaceUnit(1).ClickTheirGroundUnit(1).ClickTheirGroundUnit(2)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals('0')
      .TheirSpaceUnitPieceEquals(1, 3, '2')
      .TheirGroundUnitIsGone(1)
      .RunAsync()
    ;
  },
  Devastator_when_played_hits_base_for_4: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.PalpLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 8)
      .AddCardToHand(1, cards.JTL.Devastator)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.JTL.HoundsTooth)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .SwitchPlayerWindow().Ok()
      .SwitchPlayerWindow().ClickTheirBaseDmgInc(4).Confirm()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals('4')
      .RunAsync()
    ;
  },
  Bombing_Run_hits_arena_overrides: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.TarkinTown)
      .AddLeader(1, cards.SOR.TarkinLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.JTL.WedgeLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 5)
      .FillResources(2, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.BombingRun)
      .AddCardToHand(2, cards.JTL.BlueLeader)
      .AddUnit(2, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).Pass().ChooseYes().ChooseMultiImg(1).ChooseMultiImg(1)
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).ChooseModalOption(2)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsGone(2)
      .TheirGroundUnitIsThere(1)
      .TheirGroundUnitPieceEquals(1, 5, '3')
      .RunAsync()
    ;
  },
}