import {
  com, p,
  player1Window, player2Window,
  gameName
} from '@utils/util';
import { GameState } from '@utils/gamestate';
import { cards } from '@utils/cards';

export const SmuggleCases = {
  Smuggle_works_even_with_no_cards_in_deck: async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.SHD.JabbasPalace)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.DarthVader, 3)
      .FillResources(1, cards.SHD.LomPyke, 2)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.MyResources)
      .moveToElement(com.MyResources, 0, 0).pause(p.Move)
      .click(com.MyResources)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ResourcePopupImgOption(4)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ResourcePopupCloseButton).pause(p.ButtonPress)
    ;
    //assert
    await browser.assert.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.textEquals(com.MyResources, '0/4');
  },
}