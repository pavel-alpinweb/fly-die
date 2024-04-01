import React from 'react';
import classes from "./Coins.module.css";
import {observer} from "mobx-react-lite";
import {resourcesStore} from "../../store/resources.store.ts";

const CoinsComponent = observer(() => {
    return (
        <div className={classes.coins}>
            <img width={60} src="/assets/ui/coin.png" alt="coin"/>
            <div className={classes.coinsNumber}>{resourcesStore.coins}</div>
        </div>
    );
});

export default CoinsComponent;