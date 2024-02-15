import React, {FormEvent} from 'react';
import {useNavigate} from "react-router-dom";
import classes from "./Start.module.css";

const StartScreen = () => {
    const navigate = useNavigate();

    const goToGame = (event: FormEvent) => {
        event.preventDefault();
        navigate('/game');
    }

    return (
        <div className={classes.startScreen}>
            <form className={classes.startForm} onSubmit={(event) => goToGame(event)}>
                <input className={classes.startInput} type="text" placeholder="Enter your name"/>
                <button className={classes.startBtn}>
                    Play
                </button>
            </form>
        </div>
    );
};

export default StartScreen;