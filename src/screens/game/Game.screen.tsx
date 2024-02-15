import React from 'react';
import classes from "./Game.module.css";
import {useEffect} from "react";

const GameScreen = () => {
    useEffect(() => {
        const canvas = document.getElementById('game');
        console.log('Game ready!', canvas);
    }, []);

    return (
        <div className={classes.gameScreen}>
            <canvas className={classes.gameScreenCanvas} id="game"></canvas>
        </div>
    );
};

export default GameScreen;