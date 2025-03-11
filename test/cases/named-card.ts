import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName
} from '../utils/util';

export const NamedCardCases = {
  Fetts_Firespray_with_leader: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.TWI.JangoLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.Waylay, 6)
      .AddCardToHand(1, cards.SOR.FettsFirespray)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsThere(1)
      .MySpaceUnitIsNotExhausted(1)
      .RunAsync()
    ;
  },
  Fetts_Firespray_BobaPilot: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.JTL.BobaFettLeader, true)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 6)
      .AddCardToHand(1, cards.SOR.FettsFirespray)
      .AddUnit(1, cards.JTL.TieFighter, false, false, 0, gameState.SubcardBuilder()
        .AddPilot(cards.JTL.BobaFettLeader, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsThere(2)
      .MySpaceUnitIsNotExhausted(2)
      .RunAsync()
    ;
  },
  Fetts_Firespray_BobaUnit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SHD.CadBaneLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 6)
      .AddCardToHand(1, cards.SOR.FettsFirespray)
      .AddUnit(1, cards.JTL.BobaFettUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsThere(1)
      .MySpaceUnitIsNotExhausted(1)
      .RunAsync()
    ;
  },
}