// 보스 관련

class Boss {
  constructor(speed, imageSize, type, enemySpawnInterval) {
    this.x = 0;
    this.y = 0;
    this.speed = speed;
    this.imageSize = imageSize;
    this.type = type;
    this.enemySpawnInterval = enemySpawnInterval;
    this.lastSpawnTime = 0;
    this.alive = true;
    this.init();
  }

  generateRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // 보스에서 나오는 적
  spawnEnemy() {
    let enemy = new Enemy();
    enemy.init(
      this.x + this.imageSize / 2,
      this.y + this.imageSize,
      this.speed
    ); 
  }

  init() {
    this.y = 0;
    this.x = this.generateRandomValue(0, canvas.width - this.imageSize);
    enemyList.push(this);
  }

  update() {
    this.x += this.speed;
    if (this.x <= 0 && this.speed < 0) {
      this.speed = -this.speed;
    } else if (this.x >= canvas.width - this.imageSize && this.speed > 0) {
      this.speed = -this.speed;
    }
    // 적 생성 시간
    let currentTime = Date.now();
    if (currentTime - this.lastSpawnTime > this.enemySpawnInterval) {
      this.spawnEnemy();
      this.lastSpawnTime = currentTime;
    }
  }
}

// 보스1 생성
function createEnemyBoss1() {
  // if (!boss1Created) {
  let boss1 = new Boss(1, 80, "boss1", 500);
  enemyList.push(boss1);
  boss1Created = true;
  // }
}
// 보스2 생성
function createEnemyBoss2() {
  // if (!boss2Created) {
  let boss2 = new Boss(2, 80, "boss2", 400);
  enemyList.push(boss2);
  boss2Created = true;
  // }
}
// 보스3 생성
function createEnemyBoss3() {
  // if (!boss3Created) {
  let boss3 = new Boss(4, 80, "boss3", 300);
  enemyList.push(boss3);
  boss3Created = true;
  // }
}
// 보스4 생성
function createEnemyBoss4() {
  // if (!boss4Created) {
  let boss4 = new Boss(6, 80, "boss4", 200);
  enemyList.push(boss4);
  boss4Created = true;
  // }
}
