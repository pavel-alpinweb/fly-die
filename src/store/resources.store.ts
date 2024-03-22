import {action, makeObservable, observable} from "mobx";
import {FUEL_CONSUMPTION} from "../configs/gameplay.config.ts";

export class ResourcesStore {
    maxFuel: number = 100;
    fuel: number = 100;
    rockets: number = 15;
    coins: number = 500;

    constructor() {
        makeObservable(this, {
            fuel: observable,
            rockets: observable,
            coins: observable,
            decreaseFuel: action,
            setRockets: action,
            setCoins: action,
        })
    }

    get fuelPercentage(): number {
        return this.fuel / (this.maxFuel / 100);
    }

    decreaseFuel() {
        if (this.fuel > 0) {
            this.fuel -= FUEL_CONSUMPTION;
        }
    }

    setRockets(value: number) {
        this.rockets = value;
    }

    setCoins(value: number) {
        this.coins = value;
    }
}

export const resourcesStore = new ResourcesStore();