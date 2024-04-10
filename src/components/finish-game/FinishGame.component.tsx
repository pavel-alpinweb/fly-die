import React from 'react';
import classes from "./FinishGame.module.css";

interface FinishGameComponentProps {
    isEnd?: boolean,
    isWin?: boolean
}

const FinishGameComponent = ({isEnd, isWin}: FinishGameComponentProps) => {
    return (
        <div className={classes.FinishGame}>
            <h1 className={classes.FinishGameTitle}>You lose!</h1>
            <h2 className={classes.FinishGameSubTitle}>Press F5 for reload game</h2>
        </div>
    );
};

export default FinishGameComponent;