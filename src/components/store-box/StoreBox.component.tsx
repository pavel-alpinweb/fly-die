import React from 'react';
import classes from "./StoreBox.module.css";

const StoreBoxComponent = ({type}) => {
    return (
        <div className={classes.storeBox}>
            <h1>Store Box: {type}</h1>
        </div>
    );
};

export default StoreBoxComponent;