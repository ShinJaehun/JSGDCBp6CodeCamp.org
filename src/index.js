// 강의에서는 이런 식으로 하라는데 이상하게 codesandbox 환경에서는 코드가 실행되지 않는다.
// 그래서 이전 예제에서도 그런지 animate()가 실행되면 컨텐츠를 로딩하는 시간이 좀 걸리지 않았나...
// 결국 local에서 코딩하니까 모두 정상적으로 출력되는 것을 확인했음.
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 800;

  class Game {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.enemyInterval = 500;
      this.enemyTimer = 0;
      //console.log(this.enemies);

      this.enemyTypes = ['worm', 'ghost', 'spider'];
    }
    update(deltaTime) {
      //object filtering
      this.enemies = this.enemies.filter(object => !object.markedForDeletion);

      if (this.enemyTimer > this.enemyInterval){
        this.#addNewEnemy();
        this.enemyTimer = 0;
        //console.log(this.enemies);
      } else {
        //this.enemyTimer++;
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach(object => object.update(deltaTime));
    }
    draw() {
      this.enemies.forEach(object => object.draw(this.ctx));
    }
    // codesandbox에서는 '#'으로 시작하는 method를 사용할 수 없음!
    #addNewEnemy() {
      // random하게 enemy를 생성해보자
      const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];

      if (randomEnemy == 'worm') this.enemies.push(new Worm(this));
      else if (randomEnemy == 'ghost') this.enemies.push(new Ghost(this));
      else if (randomEnemy == 'spider') this.enemies.push(new Spider(this));

      //global variable인 Game을 this로 넘겨서 Enemy에서 처리
      //this.enemies.push(new Enemy(this));

      //Worm
      //this.enemies.push(new Worm(this));
      //각 object가 순서대로 정렬되어야 layer 관련 문제를 해결할 수 있는거야?(정확히 못 들음)
      //근데 또 worm이랑 ghost랑 같이 등장할 때 sort를 comment out 처리함
      // this.enemies.sort(function(a,b){
      //   return a.y - b.y;
      // });
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      //console.log(this.game);
      // 결국 얘네는 각 enemy 별로 다 달라야 하니까
      // this.x = this.game.width;
      // this.y = Math.random() * this.game.height;
      // this.width = 100;
      // this.height = 100;
      this.markedForDeletion = false;

      // 애니메이션 처리
      this.frameX = 0;
      this.maxFrame = 5; // 모두 5개의 프레임으로 그렸기 때문에...
      this.frameInterval = 100;
      this.frameTimer = 0;
    }
    update(deltaTime) {
      //this.x--;
      //각각 random한 다른 속력으로
      //this.x -= this.vx
      //결국 deltaTime이 있어야 성능에 상관 없이 같은 속력 유지 가능
      this.x -= this.vx * deltaTime;

      // remove object
      if(this.x < 0 - this.width) this.markedForDeletion = true;

      // 애니메이션 처리
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = 0;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }
    draw(ctx) {
      //ctx.strokeRect(this.x, this.y, this.width, this.height);
      //ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
  }

  class Worm extends Enemy {
    constructor(game){
      super(game);
      this.spriteWidth = 229;
      this.spriteHeight = 171
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      //this.y = Math.random() * this.game.height;
      //이제 worm은 바닥으로만 기어다니게...
      this.y = this.game.height - this.height;
      //이게 신기한게 getElementById 없이 그냥 사용할 수 있데!!
      this.image = worm;
      //console.log(this.image);
      this.vx = Math.random() * 0.1 + 0.1;
    }
  }

  class Ghost extends Enemy {
    constructor(game){
      super(game);
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.6;
      //이게 신기한게 getElementById 없이 그냥 사용할 수 있데!!
      this.image = ghost;
      //console.log(this.image);
      this.vx = Math.random() * 0.2 + 0.1;
      // sin wave
      this.angle = 0;
      this.curve = Math.random() * 3;
    }
    update(deltaTime) {
      super.update(deltaTime);
      // sin wave
      this.y += Math.sin(this.angle) * 1 * this.curve;
      this.angle += 0.04;
    }
    draw(){
      /* 이렇게 해서 일부 값을 조정하는 것 보다
      ctx.globalAlpha = 0.5;
      //ghost는 투명하게 보여주기 위해서 오버라이드
      super.draw(ctx);
      ctx.globalAlpha = 1;
      */
      //요게 더 일반적이라고 함
      ctx.save();
      ctx.globalAlpha = 0.7;
      //ghost는 투명하게 보여주기 위해서 오버라이드
      super.draw(ctx);
      ctx.restore();
    }
  }

  class Spider extends Enemy {
    constructor(game){
      super(game);
      this.spriteWidth = 310;
      this.spriteHeight = 175;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = Math.random() * this.game.width;
      this.y = 0 - this.height;
      this.image = spider;
      this.vx = 0;
      this.vy = Math.random() * 0.1 + 0.1;
      this.maxLength = Math.random() * this.game.height;
    }
    update(deltaTime){
      super.update(deltaTime)
      //spider는 왼쪽으로 진행하지 않기 때문에 다르게 체크해서 없애야 함
      //아래로 내려왔다가 다시 올라가서 없어지는거니까 이렇게 계산함
      if(this.y < 0 - this.height * 2) this.markedForDeletion = true;

      this.y += this.vy * deltaTime;
      if (this.y > this.maxLength) this.vy *= -1;
    }
    draw(ctx){
      // to draw the spider web
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, 0);
      ctx.lineTo(this.x + this.width / 2, this.y + 10);
      ctx.stroke();
      super.draw(ctx);

    }
  }

  const game = new Game(ctx, canvas.width, canvas.height);
  let lastTime = 1;
  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    //console.log(deltaTime);

    //game.update();
    //deltaTime을 계산한 결과를 가지고 시간 흐름에 따른 동작을 구현해보자!
    //컴퓨터 성능에 따라 다 다르게 표현되지 않고 일정하게 보여주기 위함
    game.update(deltaTime);
    game.draw();

    requestAnimationFrame(animate);
  }

  //animate();
  //timeStamp를 이용하기 위해서...
  animate(0);

});


