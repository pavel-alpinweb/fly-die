import React, {useMemo} from 'react';
import {resourcesStore} from "../../store/resources.store.ts";
import {observer} from "mobx-react-lite";
import classes from "./Fuel.module.css";

const FuelComponent = observer(() => {

    const color = useMemo(() => {
        let color = '';
        if (resourcesStore.fuelPercentage >= 60) {
            color = '#95c11f';
        } else if (resourcesStore.fuelPercentage >= 40 && resourcesStore.fuelPercentage <= 59) {
            color = '#ffff00';
        } else if (resourcesStore.fuelPercentage <= 39) {
            color = '#8a0000';
        }
        return color;
    }, [resourcesStore.fuelPercentage]);

    return (
        <div className={classes.fuel}>
            <div className={classes.fuelIcon}>
                <img width={50} height={50} src="/assets/ui/fuel.png" alt="fuel"/>
            </div>
            <div className={classes.fuelBarWrapper}>
                <div className={classes.fuelBar} style={
                    {
                        width: `${resourcesStore.fuelPercentage}%`,
                        background: color,
                    }
                }></div>
            </div>
        </div>
    );
});

export default FuelComponent;