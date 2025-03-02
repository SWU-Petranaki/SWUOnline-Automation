import { cards } from '../../utils/cards';
import { GamePlay } from '../../utils/gameplay';
import { GameState } from '../../utils/gamestate';
import {
    com, p,
    player1Window, player2Window,
    customAsserts,
    src,
    gameName
} from '../../utils/util';

const ShadowedIntentionsGameStateAsync = async () =>{
  const gameState = new GameState(gameName);
  await gameState.LoadGameStateLinesAsync();
  await gameState.ResetGameStateLines()
    .AddBase(1, cards.generic.RedBase)
    .AddLeader(1, cards.TWI.JangoLeader)
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
  Sneak_Attack_RR_Jango_exhaust_readies: async function() {
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
    await browser.assert.doesNotThrow(async () => {
      await gameplay.Assert()
        .TheirGroundUnitIsThere(1)
        .TheirGroundUnitIsNotExhausted(1)
        .RunAsync()
      ;
    });
  },
  'Exploit: Red Dooku TWI and triggers': process.env.FULL_REGRESSION !== "true" ? '' : async function() {
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

    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.Checkbox(1)).pause(p.CheckBox)
      .click(com.Checkbox(2)).pause(p.CheckBox)
      .click(com.SubmitButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.PassButton).pause(p.ButtonPress)
      .click(com.PassButton).pause(p.ButtonPress)
      .click(com.YesNoButton('NO')).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.YesNoButton('YES')).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.ClaimButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ClaimButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
  },
  'On Attack: Darth Maul TWI': async function () {
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
  'On Attack: Darth Maul TWI single target available': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
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
  'On Attack: Darth Maul TWI single target choice': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
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
  'On Attack: Darth Maul TWI sentinels': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
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
  'On Attack: Darth Maul TWI single sentinel': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
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
  'Shadowed Intentions: avoids enemy capture': process.env.FULL_REGRESSION !== "true" ? '' : async function() {
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
  'Shadowed Intentions: enemy damage': process.env.FULL_REGRESSION !== "true" ? '' : async function() {
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
  'Shadowed Intentions: defeats (merciless contest)': process.env.FULL_REGRESSION !== "true" ? '' : async function() {
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
  'Shadowed Intentions: damaged by self': process.env.FULL_REGRESSION !== "true" ? '' : async function() {
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
  'Shadowed Intentions: bounced by enemy': process.env.FULL_REGRESSION !== "true" ? '' : async function() {
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
  'Shadowed Intentions: bounced by self': process.env.FULL_REGRESSION !== "true" ? '' : async function() {
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
}