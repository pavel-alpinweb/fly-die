import {createBrowserRouter} from "react-router-dom";
import StartScreen from "../screens/start/Start.screen.tsx";
import GameScreen from "../screens/game/Game.screen.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <StartScreen />,
    },
    {
        path: '/game',
        element: <GameScreen />,
    }
]);