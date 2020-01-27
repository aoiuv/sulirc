import "reflect-metadata";
import { injectable, inject, Container } from "inversify";

interface Human {
  name: string;
  age: number;
  gender: "male" | "female";
}

const log = console.log.bind(console);

const TYPE = {
  dracula: Symbol.for("dracula"),
  house: Symbol.for("house")
};

@injectable()
class Dracula<T extends Human> {
  private slaves: T[] = [];
  private name: string;

  constructor() {
    this.name = "Count Dracula";
  }

  transform(slave: T) {
    log(`${this.name} transform ${slave.name} as his slave`);
    this.slaves.push(slave);
  }

  display(condition: (m: T) => boolean) {
    this.slaves.filter(condition).forEach((m: T) => {
      log(`${this.name} has slave: ${m.name}`);
    });
  }
}

@injectable()
class House {
  private dracula: Dracula<Human>;

  constructor(@inject(TYPE.dracula) dracula: Dracula<Human>) {
    this.dracula = dracula;
  }

  join(h: Human) {
    if (h.age >= 18 && h.age < 30) {
      this.dracula.transform(h);
    }
  }

  display(gender: "male" | "female") {
    const condition = (h: Human) => h.gender === gender;
    this.dracula.display(condition);
  }
}

const container = new Container();
container.bind<Dracula<Human>>(TYPE.dracula).to(Dracula);
container.bind<House>(TYPE.house).to(House);

const house: House = container.get(TYPE.house);
const human: Human[] = [
  {
    name: "Alice",
    age: 18,
    gender: "female"
  },
  {
    name: "Doudou",
    age: 24,
    gender: "male"
  },
  {
    name: "Sarah",
    age: 17,
    gender: "female"
  },
  {
    name: "Maya",
    age: 29,
    gender: "female"
  }
];
human.forEach(house.join.bind(house));
house.display("female");