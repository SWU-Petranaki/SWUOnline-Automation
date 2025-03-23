import { cards } from '../utils/cards';
import { GamePlay } from '../utils/gameplay';
import { GameState } from '../utils/gamestate';
import {
  com, src, p,
  gameName
} from '../utils/util';

export const IndirectDamageCases = {
  Planetary_Bombardment_pings_simultaneously: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .AddUnit(2, cards.SOR.SLT)
      .AddUnit(2, cards.JTL.TieFighter, false, false, 0,
        gameState.SubcardBuilder().AddExperience(2).Build())
      .AddUnit(2, cards.SHD.Dengar, false, false, 0,
        gameState.SubcardBuilder().AddShield(2).Build())
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .ChooseOpponent()
      .SwitchPlayerWindow().Ok()
      .ClickMyGroundUnitDmgInc(1)
      .ClickMyGroundUnitDmgInc(2)
      .ClickMySpaceUnitDmgInc(1)
      .ClickMyBaseDmgInc(5)
      .Confirm()
      .RunAsync()
    ;
    //assert
    await browser
      .assert.textEquals(com.MyBaseDamage, '10')
      .assert.textEquals(com.MyResources, '1/1')
      .assert.textEquals(com.UnitDivPiece(com.AllySpaceUnit(1), 4), '1')
      .assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '1')
      .assert.attributeContains(com.UnitDivPiece(com.AllyGroundUnit(1), 4), 'style', src.ShieldToken)
      .assert.not.elementPresent(com.AllyGroundUnit(2))
    ;
  },
  Planetary_Bombardment_no_units: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .ChooseOpponent()
      .SwitchPlayerWindow().Ok()
      .RunAsync()
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '13');
  },
  PBnDev_pings_simultaneously: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .AddUnit(2, cards.SOR.SLT)
      .AddUnit(2, cards.JTL.TieFighter, false, false, 0,
        gameState.SubcardBuilder().AddExperience(2).Build())
      .AddUnit(2, cards.SHD.Dengar, false, false, 0,
        gameState.SubcardBuilder().AddShield(2).Build())
      .AddUnit(1, cards.JTL.Devastator)
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .ChooseOpponent()
      .SwitchPlayerWindow().Ok()
      .SwitchPlayerWindow()
      .ClickTheirGroundUnitDmgInc(1)
      .ClickTheirGroundUnitDmgInc(2)
      .ClickTheirSpaceUnitDmgInc(1)
      .ClickTheirBaseDmgInc(9)
      .Confirm()
      .RunAsync()
    ;
    //assert
    await browser
      .assert.textEquals(com.TheirBaseDamage, '14')
      .assert.textEquals(com.TheirResources, '1/1')
      .assert.textEquals(com.UnitDivPiece(com.EnemySpaceUnit(1), 4), '1')
      .assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '1')
      .assert.attributeContains(com.UnitDivPiece(com.EnemyGroundUnit(1), 4), 'style', src.ShieldToken)
      .assert.not.elementPresent(com.EnemyGroundUnit(2))
    ;
  },
  PBnDev_no_units: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("5 5")
      .AddBase(1, cards.generic.RedBase)
      .AddLeader(1, cards.JTL.AsajjLeader)
      .AddBase(2, cards.generic.GreenBase)
      .AddLeader(2, cards.JTL.BobaFettLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.JTL.PlanetBomb)
      .AddUnit(1, cards.JTL.Devastator)
      .FlushAsync(com.BeginTestCallback);
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyHand().PlayFromHand(1)
      .ChooseOpponent()
      .SwitchPlayerWindow().Ok()
      .RunAsync()
    ;
    //assert
    await browser.assert.textEquals(com.MyBaseDamage, '17');
  },
}