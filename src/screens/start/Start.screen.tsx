import React from 'react';
import classes from "./Start.module.css";

const StartScreen = () => {
    return (
        <div className={classes.startScreen}>
            <form className={classes.startForm}>
                <input className={classes.startInput} type="text" placeholder="Enter your name"/>
                <button className={classes.startBtn}>
                    Play
                </button>
            </form>
        </div>
    );
};

export default StartScreen;