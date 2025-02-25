import {
  com, p, src,
  player1Window, player2Window,
  customAsserts,
  gameName,
  cs,
} from '../utils/util';
import { GameState } from '../utils/gamestate';
import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';

export const LeaderAbilitySHDCases = {
  Mando_Leader_exhaust_with_bounty: async function() {
    //arrange
    const gamestate = new GameState(gameName);
    await gamestate.LoadGameStateLinesAsync();
    await gamestate.ResetGameStateLines()
      .SetBasesDamage('5 5')
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.SHD.MandoLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .AddCardToHand(1, cards.SHD.Wanted)
      .AddUnit(2, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetTheirSpaceUnit(1)
      .RunAsync()
    ;
    //assert
    await gameplay.Assert()
      .TheirSpaceUnitIsThere(1, true)
      .TheirSpaceUnitPieceEquals(1, 1, 'WANTED')
      .RunAsync()
    ;
  },
  Mando_Leader_exhaust_with_pilot: async function() {
    //arrange
    const gamestate = new GameState(gameName);
    await gamestate.LoadGameStateLinesAsync();
    await gamestate.ResetGameStateLines()
      .SetBasesDamage('5 5')
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.SHD.MandoLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.JTL.Mandalorian)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(2, cards.JTL.XWing)
      .AddUnit(2, cards.JTL.XWing)
      .AddUnit(2, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseYes()
      .TargetTheirSpaceUnit(1).Pass().TargetTheirSpaceUnit(2)
      .RunAsync()
    ;
    //assert
    await gameplay.Assert()
      .TheirSpaceUnitIsThere(1, true)
      .TheirSpaceUnitIsThere(2, true)
      .TheirSpaceUnitIsNotExhausted(3)
      .MySpaceUnitPieceEquals(1, 1, 'THE MANDALORIAN')
      .RunAsync()
    ;
  }
}