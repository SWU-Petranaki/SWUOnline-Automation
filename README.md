# SWUOnline Automation
This test suite assumes the SWUOnline repo is sibling to this one.

## Usage
To run the tests, open a terminal at the root and run `npm test`. This will begin the NightwatchJS test tool

## Testing certain suites
Lines of the `regression.ts` file can be commented out to only run specific tests

For Example,
```javascript
const home: NightwatchTests = {
  'Before': async () => {
    await browser
      .url('http://localhost:8080/SWUOnline/MainMenu.php')
      .window.maximize().pause(p.WaitForEffect)
/*...*/
      .click('input.GameLobby_Button[value="Ready"]').pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player1Window)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToBegin);
  },
//regression suite
  //...WhenPlayedCases, //comment these spreads
  //...WhenDefeatCases,
  //...OnAttackCases,
  //...AmbushCases,
  ...LeaderAbilitySORCases,
  ...LeaderUnitCases,
  //...ExploitCases,
// end regression suite
  'After': async () => {
/*...*/
  }
}
```