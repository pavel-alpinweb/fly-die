import React from 'react';
import classes from "./Game.module.css";

const GameScreen = () => {
    return (
        <div className={classes.gameScreen}>
            <canvas className={classes.gameScreenCanvas} id="game"></canvas>
        </div>
    );
};

export default GameScreen;