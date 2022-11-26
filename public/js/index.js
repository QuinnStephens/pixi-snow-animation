"use strict";

// ! Definitions

let stage;
let renderer;
let stageWidth = 2400;
let stageHeight = 2400;

let farClouds, nearClouds, background;
let panSpeed = 1;

let numParticles = 500;
let minScale = 0.25;
let maxScale = 1;
let minWind = 0;
let maxWind = -4;
let minGravity = 1;
let maxGravity = 2;

let snowflakes = [];

let elapsedTime = 0;
let lastFrameTime = 0;
let deltaTime = 0;

let inputContainer;
let inputField;
let inputTypes;
let inputValues;
let currentInput;
let currentStory;
let previousStories = [];

let audioContext;

// ! Classes

function snowflake(sprite, speed, rotation, sineSeed, cycleTime) {
  this.sprite = sprite;
  this.speed = speed;
  this.rotation = rotation;
  this.sineSeed = sineSeed;
  this.cycleTime = cycleTime; // sine cycle in milliseconds
}

// ! Setup
setupPixi();

function setupPixi() {
  let app = new PIXI.Application({ width: stageWidth, height: stageHeight });
  document.body.appendChild(app.view);
  stage = app.stage;

  addParticles();

  app.ticker.add((deltaTime) => {
    elapsedTime += deltaTime;
    stepParticles();
  })
}

function addParticles() {
  let snowContainer1 = new PIXI.Sprite();
  let snowContainer2 = new PIXI.Sprite();
  let snowContainer3 = new PIXI.Sprite();
  stage.addChild(snowContainer1);
  stage.addChild(snowContainer2);
  stage.addChild(snowContainer3);

  for (let i = 0; i < numParticles; i++) {
    let random = Math.floor((Math.random() * 3) + 1);
    let spriteName, thisContainer;

    if (random == 1) { spriteName = "snowflake1.png"; thisContainer = snowContainer1 }
    if (random == 2) { spriteName = "snowflake2.png"; thisContainer = snowContainer2 }
    if (random == 3) { spriteName = "snowflake3.png"; thisContainer = snowContainer3 }

    let sprite = PIXI.Sprite.from("/public/img/" + spriteName)
    sprite.position.x = Math.floor(Math.random() * stageWidth);
    sprite.position.y = Math.floor(Math.random() * stageHeight);
    sprite.scale = new PIXI.Point(
      minScale + (Math.random() * (maxScale - minScale)),
      minScale + (Math.random() * (maxScale - minScale)));
    sprite.rotation = Math.random() * 2 * Math.PI;
    sprite.anchor = new PIXI.Point(0.5, 0.5);

    let flake = new snowflake(sprite,
      new PIXI.Point(Math.random() * (maxWind - minWind) + minWind, Math.random() * (maxGravity - minGravity) + minGravity),
      (Math.random() * 0.1) - 0.10,
      Math.random() * Math.PI,
      Math.random() * 1000 + 1000);

    snowflakes.push(flake);
    thisContainer.addChild(sprite);
  }
}

function stepParticles() {
  for (let i in snowflakes) {
    let child = snowflakes[i];
    let sprite = child.sprite;

    sprite.position.x += child.speed.x + Math.sin(child.sineSeed + elapsedTime / child.cycleTime);
    sprite.position.y += child.speed.y;
    sprite.rotation += child.rotation;

    if (sprite.position.y > stageHeight || (sprite.position.x < 0 && minWind < 0) || (sprite.position.x > stageWidth && minWind > 0)) {
      let top = Math.random() > 0.5;
      if (top) {
        sprite.position.x = Math.floor(Math.random() * stageWidth);
        sprite.position.y = -10;
      }
      else {
        sprite.position.x = minWind > 0 ? -10 : stageWidth + 10;
        sprite.position.y = Math.floor(Math.random() * stageHeight);
      }
    }
  }
}
