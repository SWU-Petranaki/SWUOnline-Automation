
import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
    com, p,
    player1Window, player2Window,
    gameName,
    src,
    cs
} from '@utils/util';

export const LeaderAbilityJTLCases = {
  Kazuda_Leader_Unit_on_attack: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.JTL.KazudaLeader, true)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddCardToDeck(1, cards.SOR.Snowspeeder, 5)
      .AddCardToDeck(2, cards.SOR.Snowspeeder, 5)
      .AddUnit(1, cards.JTL.KazudaLeaderUnit)
      .AddUnit(1, cards.SOR.MillenniumFalcon)
      .AddUnit(1, cards.SHD.CartelTurncoat, false, true, 1)
      .AddUnit(2, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(1).ClickMyGroundUnit(1)
      .WaitForCheckboxes().Check(2).Check(3).Submit()
      .SwitchPlayerWindow().ClickMySpaceUnit(1).TargetTheirSpaceUnit(2)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(2)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(2)
      .SwitchPlayerWindow().WaitForMySpaceUnit(1).ClickMySpaceUnit(1)
      .RunAsync();
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsGone(1)
      .MySpaceUnitIsThere(1)
      .MySpaceUnitIsGone(2)
      .MyHandSizeIs(1)
      .TheirHandSizeIs(1)
      .MyResourcesEquals('1/1')
      .TheirResourcesEquals('1/1')
      .TheirBaseDamageEquals('5')
      .RunAsync()
    ;
  },
  Piett_discounts: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.JTL.PiettLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 5)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.JTL.Invincible)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).TargetMyHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyHandIsEmpty()
      .MyResourcesEquals('0/5')
      .MySpaceUnitIsThere(1)
      .RunAsync()
    ;
  },
  Wedge_soft_pass: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.JTL.WedgeLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.BFMarine, 5)
      .AddUnitWithPilot(1, cards.JTL.XWing, cards.JTL.Chewbacca)
      .AddCardToHand(1, cards.JTL.CassianAndor)
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
      .MyBaseDamageEquals('0')
      .TheirBaseDamageEquals('0')
      .MyHandSizeIs(1)
      .RunAsync()
    ;
  },
  Wedge_soft_pass_may: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.JTL.WedgeLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.BFMarine, 5)
      .AddUnit(1, cards.JTL.XWing)
      .AddCardToHand(1, cards.JTL.CassianAndor)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).Pass()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('0')
      .TheirBaseDamageEquals('0')
      .MyHandSizeIs(1)
      .RunAsync()
    ;
  },
}