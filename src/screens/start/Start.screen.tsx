import React, {FormEvent} from 'react';
import {useNavigate} from "react-router-dom";
import classes from "./Start.module.css";

const StartScreen = () => {
    const navigate = useNavigate();

    const goToGame = (event: FormEvent) => {
        event.preventDefault();
        navigate(`${import.meta.env.BASE_URL}game`);
    }

    return (
        <div className={classes.startScreen}>
            <form className={classes.startForm} onSubmit={(event) => goToGame(event)}>
                <button className={classes.startBtn}>
                    Play
                </button>
            </form>
        </div>
    );
};

export default StartScreen;