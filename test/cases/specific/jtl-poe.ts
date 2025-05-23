import { cards } from '../../utils/cards';
import { GameAssert } from '../../utils/gameassert';
import { GamePlay } from '../../utils/gameplay';
import { GameState } from '../../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  customAsserts
} from '../../utils/util';

export const JTLPoeCases = {
  Poe_Leader_no_resources_cant_jump: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .AddResource(1, cards.SOR.BFMarine, false)
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
    GameAssert.LastLogEqualsAsync(browser, "Not enough resources to pay for that. Reverting gamestate.");
  },
  Poe_Leader_deploy_defeat_cant_deploy_next_turn: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader, false, true)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .AddCardToDeck(1, cards.SOR.BFMarine, 4)
      .AddCardToDeck(2, cards.SOR.DSStormTrooper, 4)
      .FillResources(1, cards.SOR.BFMarine, 4)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(2, cards.SOR.PalpUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      //deploy fails
      .WaitForMyLeader().ClickMyLeader()
      .RunAsync()
    ;
    //assert
    await GameAssert.LastLogEqualsAsync(browser, "You don't control enough resources to deploy that leader; reverting the game state.", 2);
    //act
    await gameplay
      .WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      //new round
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      //now really deploy
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2)
      //enemy Palp one shots
      .SwitchPlayerWindow().WaitForMyGroundUnit(1).ClickMyGroundUnit(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn()
      //next round
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow().WaitForMyHand().ClickHandCard(1)
      //try to deploy again
      .SwitchPlayerWindow().WaitForMyLeader().ClickMyLeader()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsGone(1)
      .TheirGroundUnitIsThere(1)
      .MySpaceUnitIsThere(1)
      .MySpaceUnitPieceEquals(1, 1, 'POE DAMERON')
      .RunAsync()
    ;
  },
  Poe_Leader_mass_testing_interactions: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader, true)
      .AddCardToDeck(1, cards.SOR.BFMarine, 20)
      .AddCardToDeck(2, cards.SOR.BFMarine, 20)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(1, cards.JTL.XWing, false, false, 0)
      .AddUnit(1, cards.JTL.XWing, false, true, 0, gameState.SubcardBuilder().AddPilot(cards.JTL.R2D2, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.IG88, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.PalpUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act - Poe Hops on ship 2
    await browser
      .waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(2), 1), 'POE DAMERON')
    //act - Poe hops off ship 2 and auto-hops onto ship 1
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'POE DAMERON');
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .pause(p.WaitForEffect)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.AllySpaceUnit(1));
    //act
    await browser
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //pre-assert
    await browser.assert.not.elementPresent(com.Leader(1));
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      //TODO: remove when we figure out how to autopass layers
      .click(com.PassButton).moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.Leader(1));
    //act
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.Leader(1));
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.Leader(1));
    //act
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(2), 1), 'R2-D2');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), '2');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 2), '2');
    //act
    await browser
      .waitForElementPresent(com.ClaimButton)
      .moveToElement(com.ClaimButton, 0, 0).pause(p.Move)
      .click(com.ClaimButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'POE DAMERON');
  },
  Poe_Leader_eject_combo: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader, true)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.JTL.Eject)
      .FillResources(1, cards.SOR.BFMarine, 3)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(1, cards.JTL.XWing, false, false, 0)
      .AddUnit(1, cards.JTL.XWing, false, true, 0, gameState.SubcardBuilder().AddPilot(cards.JTL.R2D2, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.IG88, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.PalpUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
      await browser
      .waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 1), 'POE DAMERON')
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ChooseButton(1, 1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.textEquals(com.MyBaseDamage, '9');
    await browser.assert.textEquals(com.TheirBaseDamage, '9');
  },
  Poe_Leader_eject_combo_defeated_still_deploys: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.RedBase)
      .AddLeader(2, cards.JTL.AsajjLeader, true)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.JTL.Eject)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(1, cards.JTL.XWing, false, false, 0)
      .AddUnit(1, cards.JTL.XWing, false, true, 0, gameState.SubcardBuilder().AddPilot(cards.JTL.R2D2, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.IG88, 1).Build())
      .AddUnit(2, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.PalpUnit)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
      await browser
      .waitForElementPresent(com.Leader(1))
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(2), 1), 'POE DAMERON')
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.PassButton, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllySpaceUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ChooseButton(1, 1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Leader(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
    await customAsserts.UnitIs(browser, cards.JTL.PoeLeaderUnit, com.AllyGroundUnit(1));
  },
  Leia_JTL_Poe_on_ejected_ground_unit: async function () {
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
  Leia_JTL_Poe_on_deployed_ground_unit: async function () {
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
  Leia_JTL_Poe_on_space_unit: async function () {
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
  Poe_Leader_Merc_Gunship_interactions:  async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.SOR.ECL).AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.GreenBase).AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .FillResources(2, cards.SOR.BFMarine, 13)
      .AddCardToDeck(1, cards.SOR.BFMarine, 2)
      .AddCardToDeck(2, cards.SOR.BFMarine, 2)
      .AddCardToHand(2, cards.SOR.Traitorous)
      .AddCardToHand(2, cards.TWI.SlyMoore)
      .AddUnit(1, cards.SHD.MercenaryGunship, false, false)
      .AddUnit(1, cards.SHD.MercenaryGunship)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(2, cards.SHD.MercenaryGunship)
      .AddUnit(2, cards.JTL.XWing)
      .AddUnit(2, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).TargetMySpaceUnit(1)
      .SwitchPlayerWindow()
      .WaitForTheirSpaceUnit(1).ClickTheirSpaceUnit(1)
      .SwitchPlayerWindow()
      .WaitForTheirSpaceUnit(4).ClickTheirSpaceUnit(4).MultiChoiceButton(2).TargetMySpaceUnit(1)
      .SwitchPlayerWindow()
      .WaitForMyHand().ClickHandCard(1).TargetTheirSpaceUnit(1)
      .SwitchPlayerWindow()
      .WaitForTheirSpaceUnit(5).ClickTheirSpaceUnit(5)
      .SwitchPlayerWindow()
      .WaitForMySpaceUnit(3).ClickMySpaceUnit(3).TargetTheirSpaceUnit(2)
      .SwitchPlayerWindow()
      .WaitForMySpaceUnit(2).ClickMySpaceUnit(2).TargetTheirBase()
      .SwitchPlayerWindow()
      .WaitForTheirSpaceUnit(2).ClickTheirSpaceUnit(2)
      .SwitchPlayerWindow()
      .WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow()
      .WaitForPassButton().PassTurn()
      .SwitchPlayerWindow()
      .WaitForPassButton().Pass()
      .SwitchPlayerWindow()
      .WaitForPassButton().Pass()
      .SwitchPlayerWindow()
      .WaitForTheirSpaceUnit(4).ClickTheirSpaceUnit(4).MultiChoiceButton(2)
      .SwitchPlayerWindow()
      .WaitForMyHand().ClickHandCard(1)
      .SwitchPlayerWindow()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirSpaceUnitIsNotPlayable(4)
      .TheirBaseDamageEquals('10')
      .MyBaseDamageEquals('9')
      .RunAsync()
    ;
  },
  Poe_Controlled_Defeat: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 5")
      .AddBase(1, cards.generic.BlueBase)
      .AddLeader(1, cards.JTL.PoeLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .FillResources(2, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.SOR.Takedown)
      .AddCardToHand(2, cards.SOR.Traitorous)
      .AddUnit(1, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1)
      .SwitchPlayerWindow().ClickMyLeader().MultiChoiceButton(2).MultiChoiceButton(2)
      .SwitchPlayerWindow().PassTurn()
      .SwitchPlayerWindow().PlayFromHand(1).TargetTheirSpaceUnit(1)
      .SwitchPlayerWindow().PlayFromHand(1)
      .SwitchPlayerWindow().ClickMyGroundUnit(1)
      .SwitchPlayerWindow().ClickMyLeader()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MyGroundUnitIsThere(1)
      .TheirGroundUnitIsThere(1)
      .MyBaseDamageEquals('13')
      .RunAsync()
    ;
  }
}