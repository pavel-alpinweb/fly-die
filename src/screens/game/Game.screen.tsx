import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {resourcesStore} from "../../store/resources.store.ts";
import classes from "./Game.module.css";
import {useEffect} from "react";
import {useLevelOneLevel} from "../../levels/01.level.ts";
import FuelComponent from "../../components/fuel/Fuel.component.tsx";
import RocketsComponent from "../../components/rockets/Rockets.component.tsx";
import CoinsComponent from "../../components/coins/Coins.component.tsx";
import RulesModalComponent from "../../components/rulesModal/RulesModal.component.tsx";
import StoreBoxComponent from "../../components/store-box/StoreBox.component.tsx";
import FinishGameComponent from "../../components/finish-game/FinishGame.component.tsx";
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
        EventBus.on('buy-rocket', () => {
            resourcesStore.buyRockets();
        });
        EventBus.on('buy-fuel', () => {
            resourcesStore.buyFuel();
        });
    }, []);

    const [isOpen, switchOpen] = useState(false);

    return (
        <div className={classes.gameScreen}>
            <div className={classes.gameScreenWidgets}>
                <CoinsComponent />
                <FuelComponent />
                <RocketsComponent />
            </div>
            <div className={classes.gameStore}>
                <StoreBoxComponent type={'rockets'} keyButton={'1'} />
                <StoreBoxComponent type={'fuel'} keyButton={'2'} />
            </div>
            <button className={classes.infoBtn} onClick={() => switchOpen(true)}>
                <img width={50} src="/assets/ui/MenuBtn.png" alt="MenuBtn"/>
            </button>
            <RulesModalComponent isOpen={isOpen} switchOpenHandler={() => switchOpen(false)} />
            <FinishGameComponent />
            <div id="game" className={classes.gameWrapper}></div>
        </div>
    );
});

export default GameScreen;