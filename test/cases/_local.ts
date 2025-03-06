import { cards } from "../utils/cards";
import { GamePlay } from "../utils/gameplay";
import { GameState } from "../utils/gamestate";
import { com, cs, gameName, p } from "../utils/util";

export const LocalTestCase = {
  'Local Run': !Number.isInteger(Number.parseInt(process.env.LOCAL_RUN || '')) ? '' : async function() {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("9 16")
      .AddBase(1, cards.generic.YellowBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.YellowBase)
      .AddLeader(2, cards.JTL.AsajjLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .AddCardToDeck(1, cards.SOR.BFMarine, 20)
      .AddUnit(1, cards.JTL.TieFighter, false, true, 0,
        gameState.SubcardBuilder().AddPilot("0086781673", 1).Build())
      .AddUnit(1, cards.JTL.Bossk)
      .AddUnit(2, cards.JTL.TieFighter)
      //.AddCardToHand(1, "0598830553")
      .AddCardToHand(1, "0979322247")
      //.AddCardToHand(1, "9624333142")
      // .AddUnit(1, cards.JTL.XWing, true, 1,
      //   gameState.SubcardBuilder().AddUpgrade(cards.JTL.Chewbacca, 1, true).Build())
      //.AddCardToDeck(2, cards.SOR.BFMarine)
      // .AddUnit(1, cards.SOR.Snowspeeder,
      //   true, 5, gameState.SubcardBuilder().AddUpgrade(cards.JTL.KidAnakin, 1, true).Build())
      // .AddUnit(1, cards.JTL.XWing, true, 0, gameState.SubcardBuilder().AddUpgrade("2283726359", 1, true).Build(), 1)
      // .AddUnit(2, cards.JTL.XWing, true, 0, gameState.SubcardBuilder().AddUpgrade("2283726359", 2, true).Build(), 2)
      // .AddUnit(2, cards.JTL.XWing, true, 1, "-", 2)
      // .AddUnit(2, "5966087637", false, 1, "-", 1)
      // .AddUnit(2, cards.JTL.XWing, false, 1,//player, card, ready, damage
      //   gameState.SubcardBuilder().AddUpgrade(cards.JTL.Chewbacca, 2, true).Build(),
      //   2, false, 1, 1)//owner, carbonite, numUses, turns in play
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      //.___Debug() //uncomment to pause locally for debug
      //.___LongPause() //uncomment to pause locally for longer debug
      .RunAsync()
    ;
    //assert
  }
}