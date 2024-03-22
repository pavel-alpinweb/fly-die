import {action, makeObservable, observable} from "mobx";
import {FUEL_CONSUMPTION} from "../configs/gameplay.config.ts";
import {EventBus} from "../utils/EventBus.ts";

export class ResourcesStore {
    maxFuel: number = 100;
    fuel: number = 100;
    rockets: number = 10;
    coins: number = 500;

    constructor() {
        makeObservable(this, {
            fuel: observable,
            rockets: observable,
            coins: observable,
            decreaseFuel: action,
            removeRocket: action,
            setCoins: action,
        })
    }

    get fuelPercentage(): number {
        return this.fuel / (this.maxFuel / 100);
    }

    decreaseFuel() {
        if (this.fuel > 0) {
            this.fuel -= FUEL_CONSUMPTION;
            EventBus.emit('set-fuel', this.fuel);
        }
    }

    removeRocket() {
        if (this.rockets > 0) {
            this.rockets -= 1;
            EventBus.emit('set-rockets', this.rockets);
        }
    }

    setCoins(value: number) {
        this.coins = value;
    }
}

export const resourcesStore = new ResourcesStore();