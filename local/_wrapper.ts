import { NightwatchTests } from "nightwatch";
import { init } from "../test/utils/gamestart";
import { player1Window, player2Window } from "../test/utils/util";

export function Wrapper(cases: Object) {
  const wrapped: NightwatchTests = {
    before: init,
  ...cases,
  after: async (browser, done) => {
      await browser.window.switchTo(player2Window).window.close();
      await browser.window.switchTo(player1Window).window.close();

      done();
    }
  };

  return wrapped;
}