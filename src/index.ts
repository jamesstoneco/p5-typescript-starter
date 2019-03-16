import * as p5 from "p5";
import * as gl from "gl-matrix";
import * as R from "ramda";
import map from "ramda/es/map";

const numberOfParticles = 100;

interface Vector {
  x: number;
  y: number;
}

interface Particle {
  loc: Vector;
  vel: Vector;
}

const particles: Array<Particle> = R.map(() => {
  return {
    loc: { x: 0, y: 0 },
    vel: { x: Math.random() - 0.5, y: Math.random() - 0.5 }
  };
}, Array(numberOfParticles));

let newLocation: Array<Particle> = particles;

const addVec = (a: Vector, b: Vector): Vector => {
  return { x: a.x + b.x, y: a.y + b.y };
};

const sketchP = new p5((p: p5) => {
  p.preload = () => {};

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.translate(p.windowWidth / 2, p.windowHeight / 2);
    p.background(127);
    p.noStroke();
    p.fill(0);

    newLocation = R.map(p => {
      return { loc: addVec(p.loc, p.vel), vel: p.vel };
    }, newLocation);

    // console.log(
    //   R.map(part => {
    //     return { x: part.loc.x, y: part.loc.y };
    //   }, newLocation)[0]
    // );

    R.map(particle => {
      p.ellipse(particle.loc.x, particle.loc.y, 15, 15);
    }, newLocation);
  };
});

export default sketchP;
