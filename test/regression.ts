import {NightwatchTests} from 'nightwatch';

import { player1Window, player2Window } from './utils/util';
import { WhenPlayedCases } from './cases/when-played';
import { WhenDefeatCases } from './cases/when-defeat';
import { OnAttackCases } from './cases/on-attack';
import { AmbushCases } from './cases/ambush';
import { BounceCases } from './cases/bounce';
import { LeaderAbilitySORCases } from './cases/leader-ability-sor';
import { LeaderUnitSORCases } from './cases/leader-unit-sor';
import { LeaderUnitSHDCases } from './cases/leader-unit-shd';
import { LeaderUnitTWICases } from './cases/leader-unit-twi';
import { BountyCases } from './cases/bounty';
import { ExploitCases } from './cases/exploit';
import { SpecificSORCases } from './cases/specific/sor';
import { SpecificSHDCases } from './cases/specific/shd';
import { SpecificTWICases } from './cases/specific/twi';
import { init } from './utils/gamestart';

const home: NightwatchTests = {
  before: init,
//regression suite
  ...WhenPlayedCases,
  ...WhenDefeatCases,
  ...OnAttackCases,
  ...AmbushCases,
  ...BounceCases,
  ...LeaderAbilitySORCases,
  ...LeaderUnitSORCases,
  ...LeaderUnitSHDCases,
  ...LeaderUnitTWICases,
  ...SpecificSORCases,
  ...BountyCases,
  ...SpecificSHDCases,
  ...ExploitCases,
  ...SpecificTWICases,
//end regression suite
  after: async (browser, done) => {
    await browser.window.switchTo(player2Window).window.close();
    await browser.window.switchTo(player1Window).window.close();

    done();
  }
};

export default home;