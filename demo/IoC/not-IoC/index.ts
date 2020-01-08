import { Katana, Shuriken, Ninja } from "../custom/entities";

const katana = new Katana();
const shuriken = new Shuriken();
const ninja = new Ninja(katana, shuriken);

console.log(ninja.fight());
console.log(ninja.sneak());
