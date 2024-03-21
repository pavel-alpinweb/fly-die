import {action, makeObservable, observable} from "mobx";

export class ResourcesStore {
    maxFuel: number = 100;
    fuel: number = 100;
    rockets: number = 15;
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

    get fuelPercentage(): number {
        return this.fuel / (this.maxFuel / 100);
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