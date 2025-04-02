import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  src
} from '../utils/util';

export const CoreMechanicsCases = {
  'Cards go in Discard': async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('9 16')
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.TWI.YodaLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 3)
      .FillResources(2, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(2, cards.SOR.CraftySmuggler)
      .AddCardToHand(1, cards.TWI.PerilousPosition)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.PassButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window)
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.MyHand, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.attributeContains(com.UnitDivPiece(com.AllyGroundUnit(1), 3), 'style', src.ShieldToken);
    //act
    await browser.window.switchTo(player1Window)
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.MyHand, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.textEquals(com.MyDiscardCount, '1');
    await browser.assert.textEquals(com.TheirDiscardCount, '1');
    //act
    await browser.waitForElementPresent(com.MyDiscard)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.MyDiscard).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.attributeEquals(com.MyDiscardCard(1), 'src', src.Concat(cards.TWI.PerilousPosition));
    //act
    await browser.window.switchTo(player2Window)
      .waitForElementPresent(com.MyDiscard)
      .moveToElement(com.MyDiscard, 0, 0).pause(p.Move)
      .click(com.MyDiscard).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.attributeEquals(com.MyDiscardCard(1), 'src', src.Concat(cards.SOR.CraftySmuggler));
  },
  'Unique units trigger unique rule': async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('9 16')
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.TWI.YodaLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 3)
      .AddCardToHand(1, cards.SOR.EzraBridger)
      .AddUnit(1, cards.SOR.CraftySmuggler)
      .AddUnit(1, cards.SOR.CraftySmuggler)
      .AddUnit(1, cards.SOR.EzraBridger)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.MyHand, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.PlayerPickSpan, 'You have two of this unique card; choose one to destroy ');
    //act
    await browser.click(com.AllyGroundUnit(4))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.AllyGroundUnit(4));
    await browser.assert.textEquals(com.MyDiscardCount, '1');
  },
  Leader_upgrade_under_their_control_aspects: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('9 16')
      .AddBase(1, cards.SHD.JabbasPalace)
      .AddLeader(1, cards.JTL.PoeLeader, true)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 2)
      .AddCardToHand(1, cards.SOR.GreenSquadAWing)
      .AddUnit(2, cards.SHD.MercenaryGunship, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.PoeLeader, 1).Build())
      .FlushAsync(com.BeginTestCallback)
      ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand()
      .PlayFromHand(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsThere(1)
      .RunAsync()
    ;
  },
  Piloting_yes_then_no: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('9 16')
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.SHD.FinnLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 8)
      .AddCardToHand(1, cards.JTL.NienNunb)
      .AddCardToHand(1, cards.JTL.PaigeTico)
      .AddCardToHand(1, cards.JTL.Chewbacca)
      .AddUnit(1, cards.JTL.XWing)
      .AddUnit(1, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(1).TargetMySpaceUnit(1)
      .SwitchPlayerWindow().WaitForClaimButton().ClaimInitiative()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).ChooseNo()
      .PlayFromHand(1).ChooseYes().TargetMySpaceUnit(2)
      .TargetMyHandCard(1).ChooseNo()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsThere(1)
      .MySpaceUnitIsThere(2)
      .MyGroundUnitIsThere(1)
      .MyGroundUnitIsThere(2)
      .MyResourcesEquals("0/8")
      .TheirResourcesEquals("0/0")
      .MyDiscardIsEmpty()
      .TheirDiscardIsEmpty()
      .RunAsync()
    ;
  },
  Piloting_yes_then_regular_unit_with_triggers: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('9 16')
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.generic.BlueBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.DSStormTrooper, 3)
      .FillResources(2, cards.SOR.CraftySmuggler, 3)
      .AddCardToHand(1, cards.JTL.BobaFettUnit)
      .AddCardToHand(1, cards.JTL.FOStormTrooper)
      .AddCardToHand(2, cards.TWI.PerilousPosition)
      .AddUnit(1, cards.JTL.TieFighter)
      .AddUnit(1, cards.JTL.TieFighter)
      .AddUnit(2, cards.SOR.CraftySmuggler)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseYes().TargetMySpaceUnit(2).TargetTheirGroundUnit(1)
      .Pass().ChooseNo()
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1).TargetTheirSpaceUnit(2)
      .SwitchPlayerWindow().WaitForMyHand().PlayFromHand(1)
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsThere(1)
      .MySpaceUnitIsThere(2)
      .MyGroundUnitIsThere(1)
      .RunAsync()
      ;
  },
  Piloting_layers: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage('3 10')
      .AddBase(1, cards.generic.GreenBase)
      .AddLeader(1, cards.JTL.KazudaLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.BFMarine, 2)
      .AddCardToDeck(1, cards.SOR.BFMarine)
      .AddCardToHand(1, cards.JTL.HanSoloUnit)
      .AddUnit(2, cards.JTL.XWing, false, false, 0, gameState.SubcardBuilder().AddUpgrade(cards.SHD.BHQuarry, 1).Build())
      .AddUnit(1, cards.JTL.MillenniumFalcon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1).ChooseYes().ChooseYes().TargetTheirSpaceUnit(1).Pass()
      .WaitForCheckboxes().Check(1).Submit()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .MySpaceUnitIsThere(1)
      .TheirSpaceUnitIsGone(1)
      .MyGroundUnitIsThere(1)
      .RunAsync()
    ;
  },
}