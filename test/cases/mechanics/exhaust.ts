import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '@utils/util';


export const ExhaustCases = {
  Poggle_The_Lesser_exaust_for_droid: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 0")
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SOR.PalpLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.ColonelYularen)
      .AddUnit(1, cards.TWI.PoggleTheLesser)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).Pass().ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .MyBaseDamageEquals('0')
      .MyGroundUnitIsBattleDroid(3)
      .MyGroundUnitIsExhausted(1)
      .RunAsync()
    ;
  },
  Ackbar_leader_exhaust_them_they_get_XWing: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 2")
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.JTL.AckbarLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddUnit(2, cards.JTL.TieFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyResourcesEquals('1/2')
      .TheirSpaceUnitIsExhausted(1)
      .TheirSpaceUnitIsXWing(2)
      .RunAsync()
    ;
  },
  Ackbar_leader_exhaust_mine_i_get_XWing: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 2")
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.JTL.AckbarLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddUnit(1, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyResourcesEquals('1/2')
      .MySpaceUnitIsExhausted(1)
      .MySpaceUnitIsXWing(2)
      .RunAsync()
    ;
  },
  Mythosaur_ally_NGTMD_after_attack: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 0")
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SOR.PalpLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToDeck(1, cards.SOR.InfernoFour, 2)
      .AddCardToDeck(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(2, cards.SOR.NGTMD)
      .AddUnitWithUpgrade(1, cards.LOF.Mythosaur, cards.generic.Shield)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForMyGroundUnit(1).AttackWithMyGroundUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsExhausted(1)
      .RunAsync()
    ;
  },
  Mythosaur_can_still_exhaust_friendly_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 0")
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SOR.PalpLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .FillResources(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.SOR.ColonelYularen)
      .AddUnitWithUpgrade(1, cards.TWI.PoggleTheLesser, cards.generic.Shield)
      .AddUnit(1, cards.LOF.Mythosaur)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).Pass().ChooseYes()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .MyBaseDamageEquals('0')
      .MyGroundUnitIsBattleDroid(4)
      .MyGroundUnitIsExhausted(1)
      .RunAsync()
    ;
  },
  Kylo_Ren_with_his_lightsaber_Cal_Kestis: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.LOF.KyloRenLeader, true)
      .AddBase(2, cards.generic.YellowBase, false, true)
      .AddLeader(2, cards.LOF.CalKestisLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .FillResources(2, cards.SOR.CraftySmuggler, 5)
      .AddUnitWithUpgrade(1, cards.LOF.KyloRenLeaderUnit, cards.LOF.KyloRensLightsaber)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirGroundUnitIsNotExhausted(1)
      .RunAsync()
    ;
  },
}