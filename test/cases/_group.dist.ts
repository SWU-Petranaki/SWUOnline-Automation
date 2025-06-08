import { NightwatchTests } from "nightwatch";
import { Wrapper } from "../../local/_wrapper";
import { DamageCases } from "@cases/mechanics/damage";
import { RoundEffectCases } from "@cases/mechanics/round-effects";
import { PilotJTLCases } from '@cases/mechanics/pilots';
import { IndirectDamageCases } from '@cases/mechanics/indirect-damage';
import { SpecificJTLCases } from '@cases/specific/jtl';
import { JTLPoeCases } from '@cases/specific/jtl-poe';
import { LeaderAbilityJTLCases } from '@cases/leaders/4jtl/leader-ability-jtl';
import { CoreMechanicsCases } from "@cases/mechanics/core";
import { SpecificLOFCases } from "@cases/specific/lof";
import { SpecificSORCases } from "@cases/specific/sor";
import { BoardWipeCases } from "@cases/mechanics/boardwipe";
import { ExhaustCases } from "@cases/mechanics/exhaust";
import { SpecificTWICases } from "@cases/specific/twi";

const home: NightwatchTests = Wrapper({
  //...BoardWipeCases,
  //...RoundEffectCases,
  //..SpecificTWICases,
});

export default home;