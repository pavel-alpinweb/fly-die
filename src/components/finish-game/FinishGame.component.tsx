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
                { isWin ? 'Победа!' : 'Поражение!' }
            </h1>
            <h2 className={classes.FinishGameSubTitle}>Для того, чтобы начать заново нажмите клавишу F5</h2>
        </div>
    );
};

export default FinishGameComponent;