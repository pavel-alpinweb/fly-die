import {createBrowserRouter} from "react-router-dom";
import StartScreen from "../screens/start/Start.screen.tsx";
import GameScreen from "../screens/game/Game.screen.tsx";

export const router = createBrowserRouter([
    {
        path: import.meta.env.BASE_URL,
        element: <StartScreen />,
    },
    {
        path: `${import.meta.env.BASE_URL}game`,
        element: <GameScreen />,
    }
]);