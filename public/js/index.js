"use strict";

// ! Definitions

let app;
let stage;
let renderer;
let stageWidth = 2400;
let stageHeight = 2400;

let numParticles = 500;
let minScale = 0.5;
let maxScale = 2;
let minWind = 0.7;
let maxWind = 0.9;
let minGravity = 0.7;
let maxGravity = 1;

let snowflakes = [];

let elapsedTime = 0;
let lastFrameTime = 0;
let deltaTime = 0;

let snapshotCount = 0;

const saveOutputToImages = false;
const frameRate = 24;
const duration = 8; //seconds

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
  app = new PIXI.Application({ width: stageWidth, height: stageHeight });
  document.body.appendChild(app.view);
  stage = app.stage;
  const graphics = new PIXI.Graphics();
  graphics.beginFill(0x000000);
  graphics.drawRect(0, 0, stageWidth, stageHeight);
  stage.addChild(graphics);

  addParticles();

  lastFrameTime = new Date().getTime();
  app.ticker.add(() => {
    const now = new Date().getTime();
    const deltaTime = now - lastFrameTime;
    lastFrameTime = now;
    elapsedTime += deltaTime;
    console.log(now)
    if (!saveOutputToImages) {
      stepParticles(deltaTime);
    }
  })

  if (saveOutputToImages) {
    saveFrameAsImage();
  }
}

function saveFrameAsImage() {
  const totalFrameCount = duration * frameRate;
  const deltaTime = 1000.0 / frameRate;
  if (snapshotCount < totalFrameCount) {
    stepParticles(deltaTime);
    const canvas = app.renderer.extract.canvas(app.stage, new PIXI.Rectangle(0, 0, stageWidth, stageHeight))
    var a = document.createElement("a");
    document.body.append(a);
    a.download = `${snapshotCount}`;
    a.href = canvas.toDataURL("image/jpeg");
    a.click();
    a.remove();
    snapshotCount += 1
    saveFrameAsImage();
    elapsedTime += deltaTime;
  }
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

    const speed = new PIXI.Point(Math.random() * (maxWind - minWind) + minWind, Math.random() * (maxGravity - minGravity) + minGravity)

    let flake = new snowflake(sprite,
      speed,
      (Math.random() * 0.1) - 0.10,
      Math.random() * Math.PI,
      Math.random() * 1000 + 1000);

    snowflakes.push(flake);
    thisContainer.addChild(sprite);
  }
}

function stepParticles(deltaTime) {
  for (let i in snowflakes) {
    let child = snowflakes[i];
    let sprite = child.sprite;

    sprite.position.x += child.speed.x * deltaTime + Math.sin(child.sineSeed + elapsedTime / child.cycleTime);
    sprite.position.y += child.speed.y * deltaTime;
    sprite.rotation += child.rotation * deltaTime / 1000;

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
