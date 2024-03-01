import React from 'react';
import classes from "./Game.module.css";
import {useEffect} from "react";
import {useLevelOneScene} from "../../scenes/Level01.scene.ts";

const GameScreen = () => {
    useEffect(() => {
        useLevelOneScene();
    }, []);

    return (
        <div id="game" className={classes.gameScreen}></div>
    );
};

export default GameScreen;