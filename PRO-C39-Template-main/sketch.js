
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;


var sky, invisibleGround;

var obstaclesGroup, obstacle1,obstacle2;

var score = 0;

var gameOver, restart;

function preload() {
 cloudman_flying = loadAnimation(
   "assets/man_1.png",
   "assets/man_2.png"
  );

  skyImage = loadImage('assets/bg.png');
  water = loadImage('assets/water.png');
  obstacle1 = loadImage('assets/thunder.png');
  obstacle2 = loadImage('assets/angry-cloud.png');
  
  gameOverImg = loadImage('assets/gameOver.png');
  restartImg = loadImage('assets/restart.png');
  
}

function setup() {
  createCanvas(800, 400);

  sky = createSprite(400, 100, 400, 20);
  sky.addImage('sky', skyImage);
  sky.scale = 0.9;
  sky.x = width / 2;

  cloudman = createSprite(50, 200, 30, 50);
  cloudman.addAnimation('running', cloudman_flying);
 
  cloudman.scale = 0.45;
  cloudman.setCollider('circle', 0, 0, 100);
  cloudman.debug = true

  invisibleGround = createSprite(400, 350, 1600, 10);
  invisibleGround.visible = false;

  gameOver = createSprite(400, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(550, 140);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  waterGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background(255);

  // cloudman.x = camera.position.x - 270;
  // cloudman.y = camera.position.y - 70;

  if (gameState === PLAY) {
    sky.velocityX = -3;

    if (sky.x < 400) {
      sky.x = 450
    }
    console.log(cloudman.y);
    if (keyDown('space')) {
    
      cloudman.y = cloudman.y - 15;
    }
    cloudman.y = cloudman.y + 5;
    spawnWater();
    spawnObstacles();

   

    if (cloudman.y >= 300) {
    
      gameState = END;
    }

    if (obstaclesGroup.isTouching(cloudman)) {
      
      gameState = END;
    }
    if (waterGroup.isTouching(cloudman)) {
      score = score + 1;
      waterGroup.destroyEach();
    }
  } else if (gameState === END) {
    gameOver.x = camera.position.x;
    restart.x = camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    cloudman.velocityY = 0;
    sky.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    waterGroup.setVelocityXEach(0);
   
   

    obstaclesGroup.setLifetimeEach(-1);
    waterGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  } else if (gameState === WIN) {
    sky.velocityX = 0;
    cloudman.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    waterGroup.setVelocityXEach(0);

    

    obstaclesGroup.setLifetimeEach(-1);
    waterGroup.setLifetimeEach(-1);
  }

  drawSprites();

  textSize(20);
  stroke(3);
  fill('black');
  text('Score: ' + score, camera.position.x, 50);

  if (score >= 5) {
    cloudman.visible = false;
    textSize(30);
    stroke(3);
    fill('black');
    text('Congragulations!! You win the game!! ', 70, 200);
    gameState = WIN;
  }
}

function spawnWater() {
  if (frameCount % 120 === 0) {
    var waterSprite = createSprite(camera.position.x + 300, 330, 40, 10);
    waterSprite.y = Math.round(random(10,350))

    waterSprite.velocityX = -(6 + (3 * score) / 100);
    waterSprite.scale = 0.6;
    waterSprite.addImage(water);

    

    waterSprite.scale = 0.6;
    waterSprite.lifetime = 400;

    waterSprite.setCollider('rectangle', 0, 0, waterSprite.width / 2, waterSprite.height / 2);
    waterGroup.add(waterSprite);
  }
}

function spawnObstacles() {
  if (frameCount % 120 === 0) {
    var obstacle = createSprite(camera.position.x + 400, 330, 40, 40);
    obstacle.y = Math.round(random(50,350));
    obstacle.setCollider('rectangle', 0, 0, 100, 100);
    obstacle.debug = true
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      default:
        break;
    }
    

    obstacle.velocityX = -(6 + (3 * score) / 100);
    obstacle.scale = 0.15;

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
  }
}



function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  cloudman.visible = true;
  cloudman.changeAnimation('running', cloudman_flying);
  cloudman.y = 50;
  obstaclesGroup.destroyEach();
  waterGroup.destroyEach();
}

