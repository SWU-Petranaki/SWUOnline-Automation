import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import { com, p,  player1Window, player2Window, gameName, cs } from '@utils/util';

export const DebuffCases = {
  Make_An_Opening: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('5 5')
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SHD.MandoLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 5)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SOR.MakeAnOpening)
      .AddUnit(2, cards.JTL.XWing, false, false, 1,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build()
      )
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetTheirSpaceUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsThere(1)
      .TheirSpaceUnitPieceEquals(1, 2, '3')
      .TheirSpaceUnitPieceEquals(1, 3, '4')
      .MyBaseDamageEquals('3')
      .TheirBaseDamageEquals('5')
      .RunAsync()
    ;
  },
  Luke_Skywalker_debuff_when_played_six: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('5 5')
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.JTL.LukeLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 7)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SOR.LukeSkywalker)
      .AddUnit(2, cards.JTL.XWing, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build()
      )
      .SetClassStatePiece(1, cs.NumAlliesDestroyed, '1')
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
      .TheirSpaceUnitIsGone(1)
      .TheirHandIsEmpty()
      .MyHandIsEmpty()
      .TheirDiscardIsEmpty()
      .TheirLeaderHasUsedEpicAction()
      .RunAsync()
    ;
  },
  Luke_Skywalker_debuff_when_played_three: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('5 5')
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.JTL.LukeLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 7)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SOR.LukeSkywalker)
      .AddUnit(2, cards.JTL.XWing, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build()
      )
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
      .TheirSpaceUnitPieceEquals(1, 2, '2')
      .TheirSpaceUnitPieceEquals(1, 3, '3')
      .RunAsync()
    ;
  },
  Hello_There_debuff: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SHD.MandoLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.PiettLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 3)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.TWI.HelloThere)
      .AddUnit(2, cards.JTL.Banshee, false, true, 0, "-", 2, false, 1, 2)
      .AddUnit(2, cards.JTL.TieBomber)
      .AddUnit(2, cards.JTL.Chimaera)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetTheirSpaceUnit(3)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyResourcesEquals('0/3')
      .TheirSpaceUnitPieceEquals(1, 1, '4')
      .TheirSpaceUnitPieceEquals(1, 2, '5')
      .TheirSpaceUnitPieceEquals(2, 1, '0')
      .TheirSpaceUnitPieceEquals(2, 2, '4')
      .TheirSpaceUnitPieceEquals(3, 1, '1')
      .TheirSpaceUnitPieceEquals(3, 2, '2')
      .RunAsync()
    ;
  },
  Mystic_Reflection_with_Force_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SHD.MandoLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.PiettLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SHD.MysticReflection)
      .AddUnit(1, cards.SHD.Grogu)
      .AddUnit(2, cards.SOR.BFMarine)
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
      .MyResourcesEquals('1/2')
      .TheirGroundUnitPieceEquals(1, 1, '1')
      .TheirGroundUnitPieceEquals(1, 2, '1')
      .RunAsync()
    ;
  },
  Mystic_Reflection_without_Force_unit: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SHD.MandoLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.PiettLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SHD.MysticReflection)
      .AddUnit(1, cards.SOR.CraftySmuggler)
      .AddUnit(2, cards.SOR.BFMarine)
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
      .MyResourcesEquals('1/2')
      .TheirGroundUnitPieceEquals(1, 1, '1')
      .TheirGroundUnitPieceEquals(1, 2, '3')
      .RunAsync()
    ;
  },
  Out_The_Airlock_pilot_leaders: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.SHD.KyloRenLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .FillResources(1, cards.SOR.CraftySmuggler, 5)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.JTL.OutTheAirlock)
      .AddUnit(2, cards.JTL.XWing, false, false, 1,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build()
      )
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
      .TheirSpaceUnitIsGone(1)
      .TheirHandIsEmpty()
      .MyHandIsEmpty()
      .TheirDiscardIsEmpty()
      .TheirLeaderHasUsedEpicAction()
      .RunAsync()
    ;
  },
  Anakin_LOF_debuff_only_Villainy: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.LOF.DarthMaulLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.PiettLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 6)
      .AddCardToDiscard(1, cards.SOR.DSStormTrooper)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.LOF.AnakinAdult)
      .AddUnit(2, cards.SOR.LukeSkywalker)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyResourcesEquals('0/6')
      .TheirGroundUnitPieceEquals(1, 1, '3')
      .TheirGroundUnitPieceEquals(1, 2, '4')
      .RunAsync()
    ;
  },
  Anakin_LOF_debuff_only_Heroism: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.LOF.ObiWanLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.PiettLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 6)
      .AddCardToDiscard(1, cards.SOR.BFMarine)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.LOF.AnakinAdult)
      .AddUnit(2, cards.SOR.LukeSkywalker)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyResourcesEquals('0/6')
      .TheirGroundUnitPieceEquals(1, 1, '3')
      .TheirGroundUnitPieceEquals(1, 2, '4')
      .RunAsync()
    ;
  },
  Anakin_LOF_debuff_both_Villainy_and_Heroism: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.TWI.ChancellorPalpatineLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.TWI.YodaLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 6)
      .AddCardToDiscard(1, cards.SOR.DSStormTrooper)
      .AddCardToDiscard(1, cards.SOR.BFMarine)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.LOF.AnakinAdult)
      .AddUnit(2, cards.SOR.LukeSkywalker)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetTheirGroundUnit(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyResourcesEquals('0/6')
      .TheirGroundUnitPieceEquals(1, 1, '0')
      .TheirGroundUnitPieceEquals(1, 2, '1')
      .RunAsync()
    ;
  }
}