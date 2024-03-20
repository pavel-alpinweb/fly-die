import {action, makeObservable, observable} from "mobx";

export class ResourcesStore {
    fuel: number = 0;
    rockets: number = 0;
    coins: number = 0;

    constructor() {
        makeObservable(this, {
            fuel: observable,
            rockets: observable,
            coins: observable,
            setFuel: action,
            setRockets: action,
            setCoins: action,
        })
    }

    setFuel(value: number) {
        this.fuel = value;
    }

    setRockets(value: number) {
        this.rockets = value;
    }

    setCoins(value: number) {
        this.coins = value;
    }
}

export const resourcesStore = new ResourcesStore();