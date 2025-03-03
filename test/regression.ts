import {NightwatchTests} from 'nightwatch';

import { player1Window, player2Window } from './utils/util';
import { init } from './utils/gamestart';

import { CoreMechanicsCases } from './cases/core';
import { WhenPlayedCases } from './cases/when-played';
import { WhenDefeatCases } from './cases/when-defeat';
import { AmbushCases } from './cases/ambush';
import { NamedCardCases } from './cases/named-card';
import { WhenTheyPlayCases } from './cases/when-they-play';
import { OnAttackCases } from './cases/on-attack';
import { RoundEffectCases } from './cases/round-effects';
import { BounceCases } from './cases/bounce';
import { DamageCases } from './cases/damage';
import { RemovalCases } from './cases/removal';
import { ReadyCases } from './cases/ready';
import { BoardWipeCases } from './cases/boardwipe';
import { ControlCases } from './cases/control';
import { DefeatUpgradeCases } from './cases/defeat-upgrade';
import { RareBasesCases } from './cases/rare-bases';
import { LeaderAbilitySORCases } from './cases/leader-ability-sor';
import { LeaderUnitSORCases } from './cases/leader-unit-sor';
import { SpecificSORCases } from './cases/specific/sor';
import { LeaderAbilitySHDCases } from './cases/leader-ability-shd';
import { LeaderUnitSHDCases } from './cases/leader-unit-shd';
import { SpecificSHDCases } from './cases/specific/shd';
import { BountyCases } from './cases/bounty';
import { SmuggleCases } from './cases/smuggle';
import { ExploitCases } from './cases/exploit';
import { CloneCases } from './cases/clone';
import { LeaderUnitTWICases } from './cases/leader-unit-twi';
import { LeaderAbilityTWICases } from './cases/leader-ability-twi';
import { SpecificTWICases } from './cases/specific/twi';
import { PilotJTLCases } from './cases/pilots';
import { IndirectDamageCases } from './cases/indirect-damage';
import { SpecificJTLCases } from './cases/specific/jtl';
import { JTLPoeCases } from './cases/specific/jtl-poe';
import { LeaderAbilityJTLCases } from './cases/leader-ability-jtl';

import { LocalTestCase } from './cases/_local';

const home: NightwatchTests = {
  before: init,
//regression suite
  ...(process.env.LOCAL_RUN ? LocalTestCase : {}),
  ...CoreMechanicsCases,
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
  ...ReadyCases,
  ...BoardWipeCases,
  ...ControlCases,
  ...DefeatUpgradeCases,
  ...RareBasesCases,
  ...BountyCases,
  ...SmuggleCases,
  ...ExploitCases,
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
  ...PilotJTLCases,
  ...IndirectDamageCases,
  ...SpecificJTLCases,
  ...JTLPoeCases,
  ...LeaderAbilityJTLCases,
//end regression suite
  after: async (browser, done) => {
    await browser.window.switchTo(player2Window).window.close();
    await browser.window.switchTo(player1Window).window.close();

    done();
  }
};

export default home;