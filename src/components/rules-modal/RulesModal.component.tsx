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
            <h1>Правила:</h1>
            <ol>
                <li>Ваша задача добраться до вершины башни</li>
                <li>Для перемещения зажмите клавиши "Влево/Вправо" либо, клавиши A и D</li>
                <li>Для прыжка зажмите клавишу "Вверх" на клавиатуре, либо клавишу W</li>
                <li>Для полета нажмите клавишу "Вверх" на клавиатуре, либо клавишу W</li>
                <li>Для стрельбы нажмите клавишу "Пробел"</li>
                <li>Во время полета тратиться топливо, его можно купить нажав на слот в магазине, либо нажав клавишу 1
                    на клавиатуре
                </li>
                <li>Во время стрельбы тратятся снаряды, их можно купить нажав на слот в магазине, либо нажав клавишу 2
                    на клавиатуре
                </li>
                <li>При получении урона, Вы теряете монеты</li>
                <li>Если получите урон при отсутствии монет, Вы погибните</li>
            </ol>
        </div>
    );
};

export default RulesModalComponent;