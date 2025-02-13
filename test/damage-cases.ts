import {NightwatchTests} from 'nightwatch';

import { player1Window, player2Window } from './utils/util';
import { init } from './utils/gamestart';

import { DamageCases } from './cases/damage';
import { IndirectDamageCases } from './cases/indirect-damage';

const home: NightwatchTests = {
  before: init,
//regression suite
  ...DamageCases,
  ...IndirectDamageCases,
//end regression suite
  after: async (browser, done) => {
    await browser.window.switchTo(player2Window).window.close();
    await browser.window.switchTo(player1Window).window.close();

    done();
  }
};

export default home;