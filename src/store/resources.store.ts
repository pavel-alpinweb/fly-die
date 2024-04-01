import {action, makeObservable, observable} from "mobx";
import {FUEL_CONSUMPTION, MAX_FUEL, START_COINS, START_FUEL, START_ROCKETS} from "../configs/gameplay.config.ts";
import {EventBus} from "../utils/EventBus.ts";

export class ResourcesStore {
    fuel: number = START_FUEL;
    rockets: number = START_ROCKETS;
    coins: number = START_COINS;

    constructor() {
        makeObservable(this, {
            fuel: observable,
            rockets: observable,
            coins: observable,
            decreaseFuel: action,
            removeRocket: action,
            removeCoin: action,
            buyFuel: action,
            buyRockets: action,
        })
    }

    get fuelPercentage(): number {
        return this.fuel / (MAX_FUEL / 100);
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

    buyFuel() {
        if (this.coins >= 1 && this.fuel < MAX_FUEL) {
            this.coins -= 1;
            this.fuel = 100;
            EventBus.emit('set-resources', {
                fuel: this.fuel,
                rockets: this.rockets,
                coins: this.coins,
            });
        }
    }

    buyRockets() {
        if (this.coins >= 1) {
            this.coins -= 1;
            this.rockets += 1;
            EventBus.emit('set-resources', {
                fuel: this.fuel,
                rockets: this.rockets,
                coins: this.coins,
            });
        }
    }
}

export const resourcesStore = new ResourcesStore();