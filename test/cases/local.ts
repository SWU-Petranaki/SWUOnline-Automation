import { cards } from "@utils/cards";
import { GameState } from "@utils/gamestate";
import { com, gameName, p } from "@utils/util";

export const LocalTestCase = {
  'Local Run': !Number.isInteger(Number.parseInt(process.env.LOCAL_RUN || '')) ? '' : async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 16")
      .AddBase(1, cards.SOR.EchoBase)
      .AddLeader(1, cards.JTL.BobaFettLeader)
      .AddBase(2, cards.SOR.EchoBase)
      .AddLeader(2, cards.JTL.HanSoloLeader)
      .FillResources(1, cards.SOR.CraftySmuggler, 5)
      //.FillResources(2, cards.SOR.BFMarine, 7)
      .AddCardToHand(1,"9985638644")
      //.AddCardToHand(2, cards.SOR.AdmiralAckbar)
      //.AddCardToDeck(1, cards.SOR.CraftySmuggler, 10)
      //.AddCardToDeck(2, cards.SOR.BFMarine, 10)
      // .AddUnit(1, cards.JTL.XWing, true, 1,
      //   new SubcardBuilder().AddUpgrade(cards.JTL.Chewbacca, 1, true).Build())
      .AddUnit(1, cards.SHD.HylobonEnforcer)
      .AddUnit(2, cards.SHD.HylobonEnforcer)
      // .AddUnit(2, cards.JTL.XWing, false, 1,//player, card, ready, damage
      //   new SubcardBuilder().AddUpgrade(cards.JTL.Chewbacca, 2, true).Build(),
      //   2, false, 1, 1)//owner, carbonite, numUses, turns in play
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    //await browser.pause(p.Debug); //uncomment to pause locally for debug
    //await browser.pause(p.Indefinite); //uncomment to pause locally for longer debug
  }
}