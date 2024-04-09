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
        <div className={rootClasses.join(' ')} onClick={switchOpenHandler}>
            Modal
            <button className={classes.closeBtn}>
                <img width={50} src="/assets/ui/CloseBtn.png" alt="MenuBtn"/>
            </button>
        </div>
    );
};

export default RulesModalComponent;