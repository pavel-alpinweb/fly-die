/* BASE ENGINE SETTINGS */
export const LEVEL_GRAVITY = 1500;
export const LEVEL_WIDTH = 1200;
export const LEVEL_HEIGHT = 700;

/* TILES SETTINGS */
export const BACKGROUND_LAYER_WIDTH = 2019;
export const BACKGROUND_LAYER_HEIGHT = 1020;
export const BACKGROUND_SCROLLS= [0.6, 0.5, 0.4, 0.3, 0.1, 0];
export const TILE_SIZE = 138;

/* PLAYER SETTINGS */
export const PLAYER_START_POSITION = {
    x: 378,
    y: 27200,
}
export const PLAYER_SIZE = {
    width: 115,
    height: 108,
}
export const SMOKE_POSITION_MARGIN = {
    VERTICAL: 120,
    RIGHT: 35,
    LEFT: 45,
};
export const PLAYER_FLY_VELOCITY = -750;
export const PLAYER_WALK_VELOCITY = 650;
export const PLAYER_JUMP_VELOCITY = 400;

/* GAMEPLAY SETTINGS */
export const PLATFORM_REBOUND_VELOCITY = -500;
export const BULLETS_VELOCITY = {
    x: 2500,
    y: -150,
};
export const ENEMY_FIRE_DELAY = 500;
export const ENEMY_START_FIRE_DELAY = 500;
export const ENEMY_WALK_VELOCITY = 300;
export const ENEMY_DISTANCE_START_FIRE = TILE_SIZE * 3;
export const FUEL_CONSUMPTION = 2;
export const COIN_VELOCITY = 800;
export const COIN_BOUNCE = 0.5;
export const FIRE_BUTTON = 'space';
export const FLY_BUTTON_DURATION = 200;

/* START RESOURCES */
export const START_FUEL = 100;
export const MAX_FUEL = 100;
export const START_ROCKETS = 5;
export const START_COINS = 5;
export const ADD_FUEL = 25;