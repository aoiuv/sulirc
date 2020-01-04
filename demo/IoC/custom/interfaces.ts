namespace interfaces {
  export type Newable<T> = new (...args: any[]) => T;

  export interface Abstract<T> {
    prototype: T;
  }

  export type ServiceIdentifier<T> = string | symbol | Newable<T> | Abstract<T>;

  export interface Container {
    bind<T>(serviceIdentifier: ServiceIdentifier<T>, to: any): void;
    get<T>(serviceIdentifier: ServiceIdentifier<T>): T;
  }
}

export interface Warrior {
  fight(): string;
  sneak(): string;
}

export interface Weapon {
  hit(): string;
}

export interface ThrowableWeapon {
  throw(): string;
}


export default interfaces;
