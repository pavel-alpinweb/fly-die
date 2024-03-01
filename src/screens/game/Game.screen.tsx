import React from 'react';
import classes from "./Game.module.css";
import {useEffect} from "react";
import {useLevelOneLevel} from "../../levels/01.level.ts";

const GameScreen = () => {
    useEffect(() => {
        useLevelOneLevel();
    }, []);

    return (
        <div id="game" className={classes.gameScreen}></div>
    );
};

export default GameScreen;