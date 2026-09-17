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

const HIGH_SCORE_KEY = 'arkanoid:highScore:v1';

function loadHighScore() {
  try {
    const raw = localStorage.getItem( HIGH_SCORE_KEY );
    if ( !raw ) return 0;
    const parsed = JSON.parse( raw );
    return typeof parsed.value === 'number' ? parsed.value : 0;
  } catch ( e ) {
    return 0;
  }
}

state.highScore = loadHighScore();

const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

function drawScene() {
  ctx.clearRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

  for ( const block of state.blocks ) {
    if ( !block.alive ) continue;
    drawSprite( ctx, `block_${ block.color }`, block.x, block.y, block.w, block.h );
  }

  drawSprite( ctx, 'paddle', state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h );
  drawSprite( ctx, 'ball', state.ball.x, state.ball.y, state.ball.w, state.ball.h );
}

function drawStartOverlay() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';

  ctx.font = 'bold 32px sans-serif';
  ctx.fillText( 'ARKANOID', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40 );

  ctx.font = '18px sans-serif';
  ctx.fillText( 'Presiona ESPACIO para empezar', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 );

  ctx.font = '16px sans-serif';
  ctx.fillText( `High score: ${ state.highScore }`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30 );
}

const keys = {};

function updatePaddle() {
  if ( keys[ 'ArrowLeft' ] ) state.paddle.x -= state.paddle.speed;
  if ( keys[ 'ArrowRight' ] ) state.paddle.x += state.paddle.speed;

  state.paddle.x = Math.max( 0, Math.min( CANVAS_WIDTH - state.paddle.w, state.paddle.x ) );
}

const BALL_SPEED = 5;

function launchBall() {
  state.ball.attached = false;
  state.ball.vx = 0;
  state.ball.vy = -BALL_SPEED;
}

function updateBall() {
  const ball = state.ball;

  if ( ball.attached ) {
    ball.x = state.paddle.x + state.paddle.w / 2 - ball.w / 2;
    ball.y = state.paddle.y - ball.h;
    return;
  }

  ball.x += ball.vx;
  ball.y += ball.vy;

  if ( ball.x <= 0 ) {
    ball.x = 0;
    ball.vx *= -1;
  } else if ( ball.x + ball.w >= CANVAS_WIDTH ) {
    ball.x = CANVAS_WIDTH - ball.w;
    ball.vx *= -1;
  }

  if ( ball.y <= 0 ) {
    ball.y = 0;
    ball.vy *= -1;
  }
}

function update() {
  if ( state.status === 'playing' ) {
    updatePaddle();
    updateBall();
  }
}

function render() {
  drawScene();

  if ( state.status === 'start' ) {
    drawStartOverlay();
  }
}

function loop() {
  update();
  render();
  requestAnimationFrame( loop );
}

window.addEventListener( 'keydown', ( e ) => {
  keys[ e.code ] = true;

  if ( e.code === 'Space' && state.status === 'start' ) {
    state.status = 'playing';
  } else if ( e.code === 'Space' && state.status === 'playing' && state.ball.attached ) {
    launchBall();
  }
} );

window.addEventListener( 'keyup', ( e ) => {
  keys[ e.code ] = false;
} );

loadSpritesheet( () => requestAnimationFrame( loop ) );
