import React from 'react';
import classes from './RulesModal.module.css';

interface RulesModalComponentProps {
    isOpen?: any,
    switchOpenHandler?: any
}

const RulesModalComponent = ({isOpen, switchOpenHandler}: RulesModalComponentProps) => {
    const rootClasses = [classes.rulesModal];
    if (isOpen) {
        rootClasses.push(classes.visible);
    }
    return (
        <div className={rootClasses.join(' ')}>
            <button className={classes.closeBtn} onClick={switchOpenHandler}>
                <img width={50} src="/assets/ui/CloseBtn.png" alt="MenuBtn"/>
            </button>
            <h1>Rules:</h1>
            <ol>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. </li>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. </li>
            </ol>
        </div>
    );
};

export default RulesModalComponent;