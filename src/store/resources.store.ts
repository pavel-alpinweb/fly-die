import {action, makeObservable, observable} from "mobx";
import {FUEL_CONSUMPTION} from "../configs/gameplay.config.ts";
import {EventBus} from "../utils/EventBus.ts";

export class ResourcesStore {
    maxFuel: number = 100;
    fuel: number = 100;
    rockets: number = 10;
    coins: number = 5;

    constructor() {
        makeObservable(this, {
            fuel: observable,
            rockets: observable,
            coins: observable,
            decreaseFuel: action,
            removeRocket: action,
            removeCoin: action,
        })
    }

    get fuelPercentage(): number {
        return this.fuel / (this.maxFuel / 100);
    }

    decreaseFuel() {
        if (this.fuel > 0) {
            this.fuel -= FUEL_CONSUMPTION;
            EventBus.emit('set-resources', {
                fuel: this.fuel,
                rockets: this.rockets,
                coins: this.coins,
            });
        }
    }

    removeRocket() {
        if (this.rockets > 0) {
            this.rockets -= 1;
            EventBus.emit('set-resources', {
                fuel: this.fuel,
                rockets: this.rockets,
                coins: this.coins,
            });
        }
    }

    removeCoin() {
        if (this.coins > 0) {
            this.coins -= 1;
            EventBus.emit('set-resources', {
                fuel: this.fuel,
                rockets: this.rockets,
                coins: this.coins,
            });
        }
    }

    addCoin() {
        this.coins += 1;
        EventBus.emit('set-resources', {
            fuel: this.fuel,
            rockets: this.rockets,
            coins: this.coins,
        });
    }
}

export const resourcesStore = new ResourcesStore();