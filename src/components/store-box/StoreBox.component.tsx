import React, {useEffect} from 'react';
import classes from "./StoreBox.module.css";
import {EventBus} from "../../utils/EventBus.ts";

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

    const buyResource = () => {
        switch (type) {
            case 'rockets':
                EventBus.emit('buy-rocket');
                break;
            case 'fuel':
                EventBus.emit('buy-fuel');
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
            if (e.key === keyButton) {
                buyResource();
            }
        });
    }, []);

    return (
        <div className={classes.storeBox}>
            { icon() ? <img width={40} height={40} src={`/assets/ui/${icon()}`} alt="bullet"/> : '' }
            <div
                className={classes.price}
            >
                <div className={classes.priceValue}>1</div>
                <img width={30} src="/assets/ui/coin.png" alt="coin"/>
            </div>
            <button
                className={classes.buyBtn}
                onClick={buyResource}
            >
                Buy (Key {keyButton})
            </button>
        </div>
    );
};

export default StoreBoxComponent;