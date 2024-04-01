import React from 'react';
import {observer} from "mobx-react-lite";
import {resourcesStore} from "../../store/resources.store.ts";
import classes from "./Game.module.css";
import {useEffect} from "react";
import {useLevelOneLevel} from "../../levels/01.level.ts";
import FuelComponent from "../../components/fuel/Fuel.component.tsx";
import RocketsComponent from "../../components/rockets/Rockets.component.tsx";
import CoinsComponent from "../../components/coins/Coins.component.tsx";
import StoreBoxComponent from "../../components/store-box/StoreBox.component.tsx";
import {EventBus} from "../../utils/EventBus.ts";

const GameScreen = observer(() => {
    const resources: Resources = {
        fuel: resourcesStore.fuel,
        rockets: resourcesStore.rockets,
        coins: resourcesStore.rockets,
    };
    useEffect(() => {
        useLevelOneLevel(resources);
        EventBus.on('decrease-fuel', () => {
            resourcesStore.decreaseFuel();
        });
        EventBus.on('remove-rocket', () => {
            resourcesStore.removeRocket();
        });
        EventBus.on('remove-coin', () => {
            resourcesStore.removeCoin();
        });
        EventBus.on('collect-coin', () => {
            resourcesStore.addCoin();
        })
    }, []);

    return (
        <div className={classes.gameScreen}>
            <div className={classes.gameScreenWidgets}>
                <CoinsComponent />
                <FuelComponent />
                <RocketsComponent />
            </div>
            <div className={classes.gameStore}>
                <StoreBoxComponent />
                <StoreBoxComponent />
            </div>
            <div id="game" className={classes.gameWrapper}></div>
        </div>
    );
});

export default GameScreen;