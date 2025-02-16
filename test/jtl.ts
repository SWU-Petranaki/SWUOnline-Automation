import {NightwatchTests} from 'nightwatch';

import { player1Window, player2Window } from './utils/util';
import { init } from './utils/gamestart';


import { PilotJTLCases } from './cases/pilots';
import { IndirectDamageCases } from './cases/indirect-damage';
import { SpecificJTLCases } from './cases/specific/jtl';
import { WhenPlayedCases } from './cases/when-played';

const home: NightwatchTests = {
  before: init,
//regression suite
    'When Played: Leia JTL lets Pilot attack': WhenPlayedCases['When Played: Leia JTL lets Pilot attack'],
    'When Played: Leia JTL lets Piloted space unit attack': WhenPlayedCases['When Played: Leia JTL lets Piloted space unit attack'],
    ...PilotJTLCases,
    ...IndirectDamageCases,
    ...SpecificJTLCases,
//end regression suite
  after: async (browser, done) => {
    await browser.window.switchTo(player2Window).window.close();
    await browser.window.switchTo(player1Window).window.close();

    done();
  }
};

export default home;