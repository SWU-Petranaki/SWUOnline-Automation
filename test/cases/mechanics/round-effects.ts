import {
  com, p,
  player1Window, player2Window,
  gameName
} from '@utils/util';
import { GameState } from '@utils/gamestate';
import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';

export const RoundEffectCases = {
  Rallying_Cry_only_units_in_play: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.SHD.KyloRenLeader)
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 4)
      .AddCardToHand(1, cards.SOR.RallyingCry)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader()
      .TargetMyGroundUnit(1).TargetMyGroundUnit(2)
      .RunAsync();
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals("10")
      .RunAsync()
    ;
  },
  Millenium_Falcon_Han_SOR_keep_her_running: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SOR.HanLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.LukeLeader)
      .AddCardToDeck(1, cards.SOR.ChangeOfHeart, 2)
      .AddCardToHand(1, cards.SOR.CantinaBouncer)
      .AddUnit(1, cards.SOR.MillenniumFalcon)
      .FillResources(1, cards.SOR.CraftySmuggler, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .TargetMyHandCard(1).ChooseYes().ChooseMultiImg(1).ChooseMultiImg(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsThere(1)
      .MyResourcesEquals("2/2")
      .MyHandCardIs(1, "Change of Heart")
      .RunAsync()
    ;
  },
  Zorii_Bliss_Discard_Before_Regroup: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SOR.HanLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.LukeLeader)
      .AddCardToDeck(1, cards.SOR.CraftySmuggler, 1)
      .AddCardToDeck(1, cards.SOR.ChangeOfHeart, 2)
      .AddCardToHand(1, cards.SOR.CantinaBouncer)
      .AddCardToHand(1, cards.SOR.CantinaBouncer)
      .AddUnit(1, cards.SHD.ZoriiBliss)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(1).ClickMyGroundUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('0')
      .TheirBaseDamageEquals('4')
      .MyHandCardIs(3, "Crafty Smuggler")
      .PlayerPickSpanTextEquals("Choose a card to discard ")
      .RunAsync()
    ;
  },
  NGTMD_keeps_exhausted_next_round: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SHD.CadBaneLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.LukeLeader, true)
      .FillResources(1, cards.SOR.CraftySmuggler, 5)
      .AddCardToDeck(1, cards.SOR.NGTMD, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 5)
      .AddCardToDeck(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToDeck(2, cards.SOR.BFMarine, 4)
      .AddCardToHand(1, cards.SOR.NGTMD)
      .AddUnit(2, cards.JTL.LukeLeaderUnit, true)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('0')
      .TheirBaseDamageEquals('0')
      .TheirGroundUnitIsThere(1, true)
      .RunAsync()
    ;
  },
  NGTMD_keeps_exhausted_even_if_played_exhausted: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SHD.CadBaneLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.LukeLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .AddCardToDeck(1, cards.SOR.NGTMD, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 4)
      .AddCardToDeck(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToDeck(2, cards.SOR.BFMarine, 4)
      .AddCardToHand(1, cards.SOR.NGTMD)
      .AddCardToHand(2, cards.SOR.SabineUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().PlayFromHand(1)
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('0')
      .TheirBaseDamageEquals('0')
      .TheirGroundUnitIsThere(1, true)
      .RunAsync()
    ;
  },
  NGTMD_keeps_exhausted_leader_deploy_next_round: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SHD.CadBaneLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.LukeLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 6)
      .AddCardToDeck(1, cards.SOR.NGTMD, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 6)
      .AddCardToDeck(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToDeck(2, cards.SOR.BFMarine, 4)
      .AddCardToHand(1, cards.SOR.NGTMD)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2)
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('0')
      .TheirBaseDamageEquals('0')
      .TheirGroundUnitIsThere(1, true)
      .RunAsync()
    ;
  },
  NGTMD_keeps_exhausted_even_if_entered_ready_and_attacked_already: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.SHD.CadBaneLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.LukeLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .AddCardToDeck(1, cards.SOR.NGTMD, 2)
      .FillResources(2, cards.SOR.CraftySmuggler, 4)
      .AddResource(2, cards.SHD.CassianAndor)
      .AddCardToDeck(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToDeck(2, cards.SOR.BFMarine, 4)
      .AddCardToHand(1, cards.SOR.NGTMD)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().OpenMyResources().ChooseResourceImg(5).CloseResourcePopup()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyGroundUnit().AttackWithMyGroundUnit(1)
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('3')
      .TheirBaseDamageEquals('0')
      .TheirGroundUnitIsThere(1, true)
      .RunAsync()
    ;
  },
  NGTMD_keeps_exhausted_even_if_player2_claims: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.JTL.LukeLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToDeck(2, cards.SOR.CraftySmuggler, 2)
      .FillResources(1, cards.SOR.CraftySmuggler, 4)
      .AddResource(1, cards.SHD.CassianAndor)
      .AddCardToDeck(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToDeck(1, cards.SOR.BFMarine, 4)
      .AddCardToHand(2, cards.SOR.NGTMD)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyResources().OpenMyResources().ChooseResourceImg(5).CloseResourcePopup()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative().TargetMyHandCard(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('0')
      .TheirBaseDamageEquals('0')
      .MyGroundUnitIsThere(1, true)
      .RunAsync()
    ;
  },
}