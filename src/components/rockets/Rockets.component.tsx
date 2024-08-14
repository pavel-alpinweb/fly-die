import React from 'react';
import {resourcesStore} from "../../store/resources.store.ts";
import {observer} from "mobx-react-lite";
import classes from "./Rockets.module.css";

const RocketsComponent = observer(() => {
    return (
        <div className={classes.rockets}>
            <img width={50} src={`${import.meta.env.BASE_URL}assets/ui/bullet.png`} alt="bullet"/>
            <div className={classes.rocketsNumber}>{resourcesStore.rockets}</div>
        </div>
    );
});

export default RocketsComponent;