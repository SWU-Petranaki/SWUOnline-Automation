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
      .MultiChoiceButton(2)
      .MultiChoiceButton(1)
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
    await gameplay.Assert()
      .TheirLeaderHasUsedEpicAction()
      .RunAsync()
    ;
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
    gameplay.Assert()
      .MyLeaderHasUsedEpicAction()
      .MyGroundUnitIsGone(1)
      .RunAsync()
    ;
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
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2).MultiChoiceButton(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .TargetTheirSpaceUnit(1).ChooseButton(1, 1)
      .RunAsync()
    ;
    //assert
    await gameplay.Assert()
      .TheirLeaderHasUsedEpicAction()
      .RunAsync()
    ;
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
    gameplay.Assert()
      .NoMultiChoicePopup()
      .RunAsync()
    ;
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
    gameplay.Assert()
      .TheirBaseDamageEquals('10')
      .MyBaseDamageEquals('8')
      .RunAsync()
    ;
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
    gameplay.Assert()
      .TheirBaseDamageEquals('10')
      .MyBaseDamageEquals('8')
      .RunAsync()
    ;
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
    gameplay.Assert()
      .TheirBaseDamageEquals('10')
      .MyBaseDamageEquals('8')
      .RunAsync()
    ;
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
      //TODO: remove when we figure out how to autopass layers
      .Pass()
      .TargetTheirBase()
      .TargetMyGroundUnit(2)
      .TargetTheirBase()
      .MultiChoiceButton(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirBaseDamageEquals('9')
      .MyBaseDamageEquals('7')
      .MyGroundUnitPieceEquals(2, 1, 'EXPERIENCE')
      .TheirResourcesEquals('0/1')
      .RunAsync()
    ;
  },
  Kazuda_Millennium_Falcon: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.KazudaLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddUnit(1, cards.SOR.MillenniumFalcon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).TargetMySpaceUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMySpaceUnit(1).ClickMySpaceUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('15')
      .TheirBaseDamageEquals('17')
      .MySpaceUnitIsThere(1)
      .MyResourcesEquals('3/3')
      .RunAsync()
    ;
  },
  Kazuda_Fireball: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("1 2")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.KazudaLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.DarthVaderLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .AddCardToHand(1, cards.JTL.Fireball)
      .AddUnit(2, cards.JTL.TieBomber)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().ClickHandCard(1).ChooseYes()
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).PassTurn()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyBaseDamageEquals('7')
      .TheirBaseDamageEquals('8')
      .MyResourcesEquals('2/2')
      .MySpaceUnitPieceIsOverlay(1, 3)
      .TheirSpaceUnitPieceEquals(1, 3, '3')
      .RunAsync()
    ;
  },
  Kazuda_upgrade_bounties: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("10 12")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.KazudaLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.DarthVaderLeader)
      .AddResource(2, cards.SOR.Devastator, false)
      .AddCardToDeck(2, cards.SOR.OB, 2)
      .AddUnit(1, cards.SOR.BFMarine, false, true, 0,
        gameState.SubcardBuilder()
          .AddUpgrade(cards.SHD.PriceOnYourHead, 2)
          .AddUpgrade(cards.SHD.DeathMark, 2)
          .AddUpgrade(cards.SHD.GuildTarget, 2)
          .AddUpgrade(cards.SHD.Wanted, 2)
          .AddUpgrade(cards.SHD.TopTarget, 2)
          .Build())
      .AddUnit(2, cards.SOR.EscortSkiff, false, false, 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1)
      .TargetMyGroundUnit(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsGone(1)
      .TheirGroundUnitIsGone(1)
      .TheirResourcesEquals('0/1')
      .TheirBaseDamageEquals('12')
      .MyBaseDamageEquals('10')
      .RunAsync()
    ;
  }
}