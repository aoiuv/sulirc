import { myContainer } from "./inversify.config";
import { TYPES } from "./types";
import { Warrior } from "./interfaces";

const ninja = myContainer.get<Warrior>(TYPES.Warrior);

console.log('ninja fight:', ninja.fight());
console.log('ninja sneak:', ninja.sneak());