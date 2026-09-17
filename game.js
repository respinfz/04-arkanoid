const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;

const BLOCK_COLS = 15;
const BLOCK_ROWS = 7;
const BLOCK_W = 32;
const BLOCK_H = 16;

// Filas de arriba hacia abajo con su puntaje asociado.
const ROW_COLORS = [ 'green', 'hotpink', 'magenta', 'cyan', 'yellow', 'red', 'gray' ];
const COLOR_POINTS = { gray: 1, red: 2, yellow: 3, cyan: 4, magenta: 5, hotpink: 6, green: 7 };

function createBlocks() {
  const blocks = [];
  for ( let row = 0; row < BLOCK_ROWS; row++ ) {
    const color = ROW_COLORS[ row ];
    for ( let col = 0; col < BLOCK_COLS; col++ ) {
      blocks.push( {
        x: col * BLOCK_W,
        y: row * BLOCK_H,
        w: BLOCK_W,
        h: BLOCK_H,
        color,
        points: COLOR_POINTS[ color ],
        alive: true,
      } );
    }
  }
  return blocks;
}

const state = {
  status: 'start', // 'start' | 'playing' | 'paused' | 'gameover' | 'win'
  score: 0,
  lives: 3,
  highScore: 0,

  paddle: { x: 159, y: 600, w: 162, h: 14, speed: 6 },

  ball: {
    x: 240, y: 592, w: 16, h: 16,
    vx: 0, vy: 0,
    attached: true,
  },

  blocks: createBlocks(),

  explosions: [],
};

const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

function drawStaticScene() {
  ctx.clearRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

  for ( const block of state.blocks ) {
    if ( !block.alive ) continue;
    drawSprite( ctx, `block_${ block.color }`, block.x, block.y, block.w, block.h );
  }

  drawSprite( ctx, 'paddle', state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h );
  drawSprite( ctx, 'ball', state.ball.x, state.ball.y, state.ball.w, state.ball.h );
}

loadSpritesheet( drawStaticScene );
