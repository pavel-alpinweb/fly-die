import React from 'react';
import classes from "./StoreBox.module.css";

const StoreBoxComponent = ({type, keyButton}) => {
    const icon = (): null | string => {
        let iconName = null;
        switch (type) {
            case 'rockets':
                iconName = 'bullet.png'
                break;
            case 'fuel':
                iconName = 'fuel.png'
                break;
            default:
                break;
        }

        return iconName;
    }

    return (
        <div className={classes.storeBox}>
            { icon() ? <img width={80} height={80} src={`/assets/ui/${icon()}`} alt="bullet"/> : '' }
            <div className={classes.price}>
                <div className={classes.priceValue}>1</div>
                <img width={40} src="/assets/ui/coin.png" alt="coin"/>
            </div>
            <button className={classes.buyBtn}>Buy ({keyButton})</button>
        </div>
    );
};

export default StoreBoxComponent;