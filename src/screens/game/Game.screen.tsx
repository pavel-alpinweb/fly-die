import React from 'react';
import classes from "./Game.module.css";
import {useEffect} from "react";
import {useLevelOneLevel} from "../../levels/01.level.ts";

const GameScreen = () => {
    useEffect(() => {
        useLevelOneLevel();
    }, []);

    return (
        <div className={classes.gameScreen}>
            <div className={classes.gameScreenWidgets}>
                Widgets
            </div>
            <div id="game" className={classes.gameWrapper}></div>
        </div>
    );
};

export default GameScreen;