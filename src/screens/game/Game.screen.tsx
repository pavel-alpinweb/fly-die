import React from 'react';
import classes from "./Game.module.css";
import {useEffect} from "react";
import {useMainScene} from "../../scenes/Main.scene.ts";

const GameScreen = () => {
    useEffect(() => {
        useMainScene();
    }, []);

    return (
        <div id="game" className={classes.gameScreen}></div>
    );
};

export default GameScreen;