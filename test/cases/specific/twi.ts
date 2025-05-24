import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
    com, p,
    player1Window, player2Window,
    customAsserts,
    src,
    gameName
} from '@utils/util';

const ShadowedIntentionsGameStateAsync = async () =>{
  const gameState = new GameState(gameName);
  await gameState.LoadGameStateLinesAsync();
  await gameState.ResetGameStateLines()
    .AddBase(1, cards.generic.RedBase)
    .AddLeader(1, cards.TWI.CadBane)
    .AddBase(2, cards.SOR.ChopperBase)
    .AddLeader(2, cards.SOR.SabineLeader)
    .FillResources(1, cards.SOR.CraftySmuggler, 3)
    .FillResources(2, cards.SOR.CraftySmuggler, 3)
    .AddCardToHand(1, cards.TWI.SanctioneerShuttle)
    .AddCardToHand(1, cards.TWI.EliteP)
    .AddCardToHand(1, cards.TWI.MercilessContest)
    .AddCardToHand(1, cards.SOR.Waylay)
    .AddUnit(1, cards.SOR.Greedo, false, true, 0,
      gameState.SubcardBuilder().AddExperience(1, 1).AddUpgrade(cards.TWI.ShadowedIntentions, 1).Build())
    .AddUnit(1, cards.SHD.LurkingTie)
    .AddUnit(2, cards.SOR.Greedo, false, true, 0,
      gameState.SubcardBuilder().AddExperience(1, 1).AddUpgrade(cards.TWI.ShadowedIntentions, 2).Build()
    )
    .AddUnit(2, cards.SHD.LurkingTie)
    .FlushAsync(com.BeginTestCallback)
  ;
}

export const SpecificTWICases = {
  Sneak_Attack_RR_Jango_exhaust_readies: ''+async function() {//Jango banned
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.KestroCity)
      .AddLeader(1, cards.TWI.JangoLeader)
      .AddBase(2, cards.SOR.KestroCity)
      .AddLeader(2, cards.SHD.MandoLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 5)
      .AddCardToHand(1, cards.SOR.SneakAttack)
      .AddCardToHand(1, cards.SOR.RuthlessRaider)
      .AddCardToDeck(1, cards.SOR.Waylay, 2)
      .AddCardToDeck(2, cards.SOR.Waylay, 2)
      .AddUnit(2, cards.SOR.Snowspeeder)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetMyHandCard(1).ChooseNo()
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForPassButton().PassTurn().ChooseYes()
      .SwitchPlayerWindow().WaitForPassButton().Pass()
      .SwitchPlayerWindow().WaitForPassButton().Pass()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsGone(1)
      .TheirGroundUnitIsThere(1)
      .TheirGroundUnitIsNotExhausted(1)
      .RunAsync()
    ;
  },
  Red_Dooku_triggers: process.env.FULL_REGRESSION !== "true" ? '' : async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.KestroCity)
      .AddLeader(1, cards.TWI.CountDookuLeader)
      .AddBase(2, cards.SOR.KestroCity)
      .AddLeader(2, cards.SHD.CadBaneLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 4)
      .FillResources(2, cards.SOR.CraftySmuggler, 4)
      .AddCardToHand(1, cards.TWI.DookuFallenJedi)
      .AddCardToDeck(1, cards.SOR.OB)
      .AddCardToHand(2, cards.SOR.ISBAgent)
      .AddCardToHand(2, cards.SHD.DaringRaid)
      .AddCardToDeck(2, cards.SOR.Waylay)
      .AddUnit(1, cards.TWI.EliteP)
      .AddUnit(1, cards.SOR.Greedo)
      .AddUnit(2, cards.TWI.EliteP)
      .AddUnit(2, cards.SOR.Greedo)
      .FlushAsync(com.BeginTestCallback)
    ;

    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).TargetMyGroundUnit(1).TargetMySpaceUnit(1)
      .TargetTheirGroundUnit(1).TargetTheirSpaceUnit(1).Pass().ChooseNo().Pass()
      .SwitchPlayerWindow().ChooseYes().TargetTheirGroundUnit(1).TargetTheirGroundUnit(1)
      .WaitForMyHand().TargetMyHandCard(1).TargetMyHandCard(1).TargetTheirGroundUnit(1)
      .SwitchPlayerWindow().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).TargetTheirGroundUnit(1)
      .RunAsync()
    ;

    gameplay.Assert()
      .TheyHaveNoGroundUnits()
      .TheyHaveNoSpaceUnits()
      .RunAsync()
    ;
  },
  Darth_Maul_attacks_two_units: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddUnit(1, cards.TWI.DarthMaul)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ButtonMultiChoice(2)).pause(p.ButtonPress)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .click(com.PassButton).pause(p.ButtonPress)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '2');
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(3));
    await customAsserts.EnemyGroundUnitIsBattleDroid(browser, 1);
    await customAsserts.EnemyGroundUnitIsBattleDroid(browser, 2);
  },
  Darth_Maul_single_target: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddUnit(1, cards.TWI.DarthMaul)
      .AddUnit(2, cards.SOR.DSStormTrooper)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '3');
  },
  Darth_Maul_choose_one: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
   //arrange
   const gameState = new GameState(gameName);
   await gameState.LoadGameStateLinesAsync();
   await gameState.ResetGameStateLines()
     .AddBase(1, cards.SOR.ChopperBase)
     .AddLeader(1, cards.SOR.SabineLeader)
     .AddBase(2, cards.SOR.DagobahSwamp)
     .AddLeader(2, cards.SOR.SabineLeader)
     .AddUnit(1, cards.TWI.DarthMaul)
     .AddUnit(2, cards.SOR.DSStormTrooper)
     .AddUnit(2, cards.SOR.DSStormTrooper)
     .FlushAsync(com.BeginTestCallback)
   ;
   //act
    await browser.waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(2)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(2));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '3');
  },
  Darth_Maul_sentinels: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddUnit(1, cards.TWI.DarthMaul)
      .AddUnit(2, cards.SHD.PhaseIIIDarkTrooper)
      .AddUnit(2, cards.SHD.PhaseIIIDarkTrooper)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
  },
  Darth_Maul_single_sentinel: process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddUnit(1, cards.TWI.DarthMaul)
      .AddUnit(2, cards.SHD.PhaseIIIDarkTrooper)
      .AddUnit(2, cards.TWI.WTTradeOfficial)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(2));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '3');
  },
  Shadowed_Intentions_avoids_enemy_capture: process.env.FULL_REGRESSION !== "true" ? '' : async function() {
    //arrange
    await ShadowedIntentionsGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1)[0];
    await browser.assert.equal(lastLog, 'Greedo Slow on the Draw avoided capture.');
  },
  Shadowed_Intentions_enemy_damage: process.env.FULL_REGRESSION !== "true" ? '' : async function() {
    //arrange
    await ShadowedIntentionsGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 5), '1');
  },
  Shadowed_Intentions_defeats_merciless_contest: process.env.FULL_REGRESSION !== "true" ? '' : async function() {
    //arrange
    await ShadowedIntentionsGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(3))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
    ;

    await browser.window.switchTo(player1Window).refresh();

    await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1)[0];
    await browser.assert.equal(lastLog, 'Greedo Slow on the Draw cannot be defeated by enemy card effects.');
  },
  Shadowed_Intentions_damaged_by_self: process.env.FULL_REGRESSION !== "true" ? '' : async function() {
    //arrange
    await ShadowedIntentionsGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 5), '1');
  },
  Shadowed_Intentions_avoids_bounce_by_enemy: process.env.FULL_REGRESSION !== "true" ? '' : async function() {
    //arrange
    await ShadowedIntentionsGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.textEquals(com.TheirHand, '');
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1)[0];
    await browser.assert.equal(lastLog, 'Greedo Slow on the Draw avoided bounce.');
  },
  Shadowed_Intentions_bounced_by_self: process.env.FULL_REGRESSION !== "true" ? '' : async function() {
    //arrange
    await ShadowedIntentionsGameStateAsync();
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.elementsCount(com.MyHandDivs, 4);
  },
  Cad_Bane_with_shield_opponent_rescues: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.DagobahSwamp)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 4)
      .FillResources(2, cards.SOR.CraftySmuggler, 4)
      .AddCardToDeck(1, cards.SOR.CraftySmuggler, 2)
      .AddUnit(1, cards.TWI.CadBane, false, true, 0,
        gameState.SubcardBuilder().AddShield(1).AddCaptive(cards.SOR.LukeSkywalker, 2).Build()
      )
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyGroundUnit(1).AttackWithMyGroundUnit(1).Pass()
      .SwitchPlayerWindow().ChooseButton(1, 1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheirGroundUnitIsThere(1, true)
      .MyGroundUnitIsThere(1, true)
      .TheirGroundUnitPieceIsShieldToken(1, 3)
      .MyBaseDamageEquals("7")
      .TheirBaseDamageEquals("0")
      .TheirHandSizeIs(2)
      .RunAsync()
    ;
  },
}