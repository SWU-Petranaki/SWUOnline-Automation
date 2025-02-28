import { cards } from '../../utils/cards';
import { GamePlay } from '../../utils/gameplay';
import { GameState } from '../../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '../../utils/util';


export const SpecificJTLCases = {
  'Eject: epic action pilot leader unit defeated cant deploy next turn': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.WedgeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .AddCardToDeck(1, cards.SOR.BFMarine, 5)
      .AddCardToDeck(2, cards.SOR.DSStormTrooper, 5)
      .AddCardToHand(1, cards.JTL.Eject)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(2, cards.TWI.SavageOpress)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader()
      .ClickMyLeader()
      .MultiChoiceButton(3)
      .SwitchPlayerWindow()
      .WaitForPassButton()
      .PassTurn()
      .SwitchPlayerWindow()
      .WaitForMyHand()
      .ClickHandCard(1)
      .ChooseButton(1, 1)
      .SwitchPlayerWindow()
      .WaitForMyGroundUnit(1)
      .ClickMyGroundUnit(1)
      .TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    await browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .TheirLeaderHasUsedEpicAction()
        .RunAsync()
      ;
    });
    //act
    await gameplay
      .SwitchPlayerWindow()
      .WaitForClaimButton()
      .ClaimInitiative()
      .SwitchPlayerWindow()
      .WaitForPassButton()
      .PassTurn()
      //next round
      .SwitchPlayerWindow()
      .WaitForMyHand()
      .ClickHandCard(1)
      .SwitchPlayerWindow()
      .WaitForMyHand()
      .ClickHandCard(1)
      .SwitchPlayerWindow()
      .WaitForMyLeader()
      .ClickMyLeader()
      .RunAsync()
    ;
    //assert
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .MyLeaderHasUsedEpicAction()
        .MyGroundUnitIsGone(1)
        .RunAsync()
    });
  },
  'JTL: epic action pilot leader upgrade defeated cant deploy next turn': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.WedgeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .AddCardToDeck(1, cards.SOR.BFMarine, 2)
      .AddCardToDeck(2, cards.SOR.DSStormTrooper, 2)
      .AddCardToHand(2, cards.SOR.DisablingFF)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.BFMarine, 3)
      .AddUnit(1, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(3)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .TargetTheirSpaceUnit(1).ChooseButton(1, 1)
      .RunAsync()
    ;
    //assert
    await browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .TheirLeaderHasUsedEpicAction()
        .RunAsync()
      ;
    });
    //act
    await gameplay
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      //next round
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader()
      .RunAsync()
    //assert
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .NoMultiChoicePopup()
        .RunAsync()
      ;
    });
  },
  'JTL: Leia Poe ejected ground unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader, true)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.JTL.Leia)
      .AddUnit(1, cards.JTL.PoeLeaderUnit, false)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .TargetMyGroundUnit(1)
      .TargetTheirBase()
      .RunAsync()
    ;
    //assert
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .TheirBaseDamageEquals('10')
        .MyBaseDamageEquals('8')
        .RunAsync()
      ;
    });
  },
  'JTL: Leia Poe deployed ground unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader, true)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.JTL.Leia)
      .AddUnit(1, cards.JTL.PoeLeaderUnit, true)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .TargetMyGroundUnit(1)
      .TargetTheirBase()
      .RunAsync()
    ;
    //assert
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .TheirBaseDamageEquals('10')
        .MyBaseDamageEquals('8')
        .RunAsync()
      ;
    });
  },
  'JTL: Leia Poe space unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader, true)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.JTL.Leia)
      .AddUnit(1, cards.JTL.XWing, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.PoeLeaderUnit, 1).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .ClickHandCard(1)
      .TargetMySpaceUnit(1)
      .TargetTheirBase()
      .RunAsync()
    ;
    //assert
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .TheirBaseDamageEquals('10')
        .MyBaseDamageEquals('8')
        .RunAsync()
      ;
    });
  },
  'JTL: Sabines Masterpiece': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(2, cards.SOR.BFMarine, 1)
      .AddUnit(1, cards.JTL.SabinesMP)
      .AddUnit(1, cards.SOR.Yoda)
      .AddUnit(1, cards.SOR.AdmiralAckbar)
      .AddUnit(1, cards.SOR.SabineUnit)
      .AddUnit(1, cards.SOR.MillenniumFalcon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMySpaceUnit(1)
      .ClickMySpaceUnit(1)
      .TargetTheirBase()
      .TargetMyGroundUnit(2)
      .TargetTheirBase()
      .MultiChoiceButton(1)
      .RunAsync()
    ;
    //assert
    return browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .TheirBaseDamageEquals('9')
        .MyBaseDamageEquals('7')
        .MyGroundUnitPieceEquals(2, 1, 'EXPERIENCE')
        .TheirResourcesEquals('0/1')
        .RunAsync()
      ;
    });
  },
}