import * as R from "ramda";
import * as PIXI from "pixi.js";

const numberOfParticles = 10;

interface Vector {
  x: number;
  y: number;
}

interface Particle {
  loc: Vector;
  vel: Vector;
}

interface ParticleGraphic extends Particle {
  g: PIXI.Graphics;
}

const stageWidth = 400;
const stageHeight = 400;

const particles: Array<Particle> = R.map(() => {
  return {
    loc: {
      x: (Math.random() - 0.5) * stageWidth,
      y: (Math.random() - 0.5) * stageHeight
    },
    vel: { x: Math.random() - 0.5, y: Math.random() - 0.5 }
  };
}, Array(numberOfParticles));

let app = new PIXI.Application({
  width: stageWidth,
  height: stageHeight,
  antialias: true,
  transparent: false,
  resolution: 1
});

let count = 0;

app.ticker.add(function() {
  count += 0.1;
  const moveParticle = (p: ParticleGraphic) => {
    const { g } = p;
    g.moveTo(g.position.x + count, g.position.y + count);
  };
  R.map(moveParticle, pgs);

  // TODO: nothing moves?
});

const centerRect = (x: number, y: number, size: number): PIXI.Graphics => {
  const g = new PIXI.Graphics();
  g.beginFill(0x5cafe2);
  g.x = app.renderer.width / 2;
  g.y = app.renderer.height / 2;
  g.drawRect(x + -size / 2, y + -size / 2, x + size, x + size);
  return g;
};

document.body.appendChild(app.view);

// pointfree functions to be used below
const buildParticleGraphic = (p: Particle): ParticleGraphic => {
  const { loc, vel } = p;
  return { loc, vel, g: centerRect(loc.x, loc.y, 5) };
};

const addToStage = (obj: ParticleGraphic) => {
  app.stage.addChild(obj.g);
  return obj;
};

// R.map(addToStage, R.map(buildParticleGraphic, particles));

const trace = (msg: string) => (val: any) => console.log(msg, " : ", val);

const pgs = R.map(
  R.compose(
    R.tap(trace("end")),
    addToStage,
    R.tap(trace("middle")),
    buildParticleGraphic,
    R.tap(trace("begin"))
  ),
  particles
);

// so pipe is unconventional in functional languages, because it doesn't follow the mathematical model
// R.map(
//   R.pipe(
//     buildParticleGraphic,
//     addToStage
//   ),
//   particles
// );
