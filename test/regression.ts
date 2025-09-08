import {NightwatchTests} from 'nightwatch';

import { player1Window, player2Window } from '@utils/util';
import { init } from '@utils/gamestart';

import { CoreMechanicsCases } from '@cases/mechanics/core';
import { AttackEventsCases } from '@cases/interactions/attack-events';
import { WhenPlayedCases } from '@cases/interactions/when-played';
import { WhenDefeatCases } from '@cases/interactions/when-defeat';
import { AmbushCases } from '@cases/mechanics/ambush';
import { NamedCardCases } from '@cases/mechanics/named-card';
import { WhenTheyPlayCases } from '@cases/interactions/when-they-play';
import { OnAttackCases } from '@cases/interactions/on-attack';
import { RoundEffectCases } from '@cases/mechanics/round-effects';
import { BounceCases } from '@cases/mechanics/bounce';
import { DamageCases } from '@cases/mechanics/damage';
import { RemovalCases } from '@cases/mechanics/removal';
import { ReadyCases } from '@cases/mechanics/ready';
import { BoardWipeCases } from '@cases/mechanics/boardwipe';
import { ControlCases } from '@cases/mechanics/control';
import { DefeatUpgradeCases } from '@cases/mechanics/defeat-upgrade';
import { DebuffCases } from '@cases/mechanics/debuff';
import { RareBasesCases } from '@cases/rare-bases';
import { LeaderAbilitySORCases } from '@cases/leaders/1sor/leader-ability-sor';
import { LeaderUnitSORCases } from '@cases/leaders/1sor/leader-unit-sor';
import { SpecificSORCases } from '@cases/specific/sor';
import { LeaderAbilitySHDCases } from '@cases/leaders/2shd/leader-ability-shd';
import { LeaderUnitSHDCases } from '@cases/leaders/2shd/leader-unit-shd';
import { SpecificSHDCases } from '@cases/specific/shd';
import { BountyCases } from '@cases/mechanics/bounty';
import { SmuggleCases } from '@cases/mechanics/smuggle';
import { ExploitCases } from '@cases/mechanics/exploit';
import { CloneCases } from '@cases/mechanics/clone';
import { LeaderUnitTWICases } from '@cases/leaders/3twi/leader-unit-twi';
import { LeaderAbilityTWICases } from '@cases/leaders/3twi/leader-ability-twi';
import { SpecificTWICases } from '@cases/specific/twi';
import { PilotJTLCases } from '@cases/mechanics/pilots';
import { IndirectDamageCases } from '@cases/mechanics/indirect-damage';
import { SpecificJTLCases } from '@cases/specific/jtl';
import { JTLPoeCases } from '@cases/specific/jtl-poe';
import { LeaderAbilityJTLCases } from '@cases/leaders/4jtl/leader-ability-jtl';
import { SpecificLOFCases } from '@cases/specific/lof';
import { ExhaustCases } from '@cases/mechanics/exhaust';
import { LeaderAbilityLOFCases } from '@cases/leaders/5lof/leader-ability';
import { RestockCases } from '@cases/mechanics/restock';
import { ForceTokenCases } from '@cases/mechanics/force-token';
import { HiddenCases } from '@cases/mechanics/hidden';
import { LeaderAbilitySECCases } from '@cases/leaders/6sec/leader-ability-sec';
import { SpecificSECCases } from '@cases/specific/sec';


const home: NightwatchTests = {
  before: init,
//regression suite
  ...CoreMechanicsCases,
  ...RestockCases,
  ...AttackEventsCases,
  ...WhenPlayedCases,
  ...WhenDefeatCases,
  ...AmbushCases,
  ...NamedCardCases,
  ...WhenTheyPlayCases,
  ...OnAttackCases,
  ...RoundEffectCases,
  ...BounceCases,
  ...DamageCases,
  ...RemovalCases,
  ...ExhaustCases,
  ...ReadyCases,
  ...BoardWipeCases,
  ...ControlCases,
  ...DefeatUpgradeCases,
  ...DebuffCases,
  ...RareBasesCases,
  ...BountyCases,
  ...SmuggleCases,
  ...ExploitCases,
  ...PilotJTLCases,
  ...HiddenCases,
  ...CloneCases,
  ...LeaderAbilitySORCases,
  ...LeaderUnitSORCases,
  ...SpecificSORCases,
  ...LeaderAbilitySHDCases,
  ...LeaderUnitSHDCases,
  ...SpecificSHDCases,
  ...LeaderAbilityTWICases,
  ...LeaderUnitTWICases,
  ...SpecificTWICases,
  ...IndirectDamageCases,
  ...SpecificJTLCases,
  ...JTLPoeCases,
  ...LeaderAbilityJTLCases,
  ...ForceTokenCases,
  ...SpecificLOFCases,
  ...LeaderAbilityLOFCases,
  ...LeaderAbilitySECCases,
  ...SpecificSECCases,
//end regression suite
  after: async (browser, done) => {
    await browser.window.switchTo(player2Window).window.close();
    await browser.window.switchTo(player1Window).window.close();

    done();
  }
};

export default home;