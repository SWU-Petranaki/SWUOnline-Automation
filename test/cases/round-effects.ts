import {
  com, p,
  player1Window, player2Window,
  gameName
} from '../utils/util';
import { GameState } from '../utils/gamestate';
import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';

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
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2)
      .TargetMyGroundUnit(1).TargetMyGroundUnit(2)
      .RunAsync();
    ;
    //assert
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .TheirBaseDamageEquals("10")
        .RunAsync()
      ;
    });
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
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .MySpaceUnitIsThere(1)
        .MyResourcesEquals("2/2")
        .MyHandCardIs(1, "Change of Heart")
        .RunAsync()
      ;
    });
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
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .MyBaseDamageEquals('0')
        .TheirBaseDamageEquals('4')
        .MyHandCardIs(3, "Crafty Smuggler")
        .PlayerPickSpanTextEquals("Choose a card to discard ")
        .RunAsync()
      ;
    });
  }
}