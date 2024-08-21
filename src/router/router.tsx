import {createHashRouter} from "react-router-dom";
import StartScreen from "../screens/start/Start.screen.tsx";
import GameScreen from "../screens/game/Game.screen.tsx";

export const router = createHashRouter([
    {
        path: import.meta.env.BASE_URL,
        element: <StartScreen />,
        children: [
            {
                path: "game",
                element: <GameScreen />
            },
        ],
    },
    // {
    //     path: `${import.meta.env.BASE_URL}game`,
    //     element: <GameScreen />,
    // }
]);