import React from 'react';
import classes from "./Game.module.css";
import {useEffect} from "react";
import {useLevelOneLevel} from "../../levels/01.level.ts";
import FuelComponent from "../../components/fuel/Fuel.component.tsx";

const GameScreen = () => {
    useEffect(() => {
        useLevelOneLevel();
    }, []);

    return (
        <div className={classes.gameScreen}>
            <div className={classes.gameScreenWidgets}>
                <FuelComponent />
            </div>
            <div id="game" className={classes.gameWrapper}></div>
        </div>
    );
};

export default GameScreen;