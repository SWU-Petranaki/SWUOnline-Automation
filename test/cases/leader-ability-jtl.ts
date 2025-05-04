
import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';
import { GameState } from '../utils/gamestate';
import {
    com, p,
    player1Window, player2Window,
    gameName,
    src,
    cs
} from '../utils/util';

export const LeaderAbilityJTLCases = {
  Kazuda_Leader_Unit_on_attack: async function () {
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
      //TODO: remove when we figure out how to autopass layers
      .Pass()
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
  }
}