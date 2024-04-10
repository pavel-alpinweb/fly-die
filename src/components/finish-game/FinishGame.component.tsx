import React from 'react';
import classes from "./FinishGame.module.css";

interface FinishGameComponentProps {
    isEnd?: boolean,
    isWin?: boolean
}

const FinishGameComponent = ({isEnd, isWin}: FinishGameComponentProps) => {
    const rootClasses = [classes.FinishGame];
    if (isEnd) {
        rootClasses.push(classes.visible);
    }

    return (
        <div className={rootClasses.join(' ')}>
            <h1 className={classes.FinishGameTitle} style={ { color: isWin ? '#95c11f' : '#8a0000' } }>
                { isWin ? 'You win!' : 'You lose!' }
            </h1>
            <h2 className={classes.FinishGameSubTitle}>Press F5 for restart game</h2>
        </div>
    );
};

export default FinishGameComponent;