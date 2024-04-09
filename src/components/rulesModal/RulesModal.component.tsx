import React from 'react';
import classes from './RulesModal.module.css';

const RulesModalComponent = () => {
    return (
        <div className={classes.rulesModal}>
            Modal
            <button className={classes.closeBtn}>
                <img width={50} src="/assets/ui/CloseBtn.png" alt="MenuBtn"/>
            </button>
        </div>
    );
};

export default RulesModalComponent;