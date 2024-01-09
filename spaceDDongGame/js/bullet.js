// 드랍 랜덤
// 총알 관련

// 총알
class Bullet {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.init = function (x, y) {
      this.x = x + 18;
      this.y = y;
      this.alive = true; // true 면 살아있는 총알 false면 죽은 총알
      bulletList.push(this);
    };
    this.update = function () {
      this.y -= 7;
    };
    this.checkHit = function () {
      for (let i = 0; i < enemyList.length; i++) {
        // 총알이 닿았다.
        if (
          this.y <= enemyList[i].y + 48 &&
          this.y >= enemyList[i].y &&
          this.x >= enemyList[i].x &&
          this.x <= enemyList[i].x + 48
        ) {
          if (enemyList[i] instanceof Boss) {
            continue;
          }
          // 점수 획득, 총알 사라짐, 닿는 적군 1개씩 제거
          score++;
          point++;
          this.alive = false;

          const enemyX = enemyList[i].x;
          const enemyY = enemyList[i].y;

          // 보석 생성
          if (Math.random() < 0.001) {
            // 0.1%
            const gem = new Gem(enemyX, enemyY);
            gemList.push(gem);
          }

          enemyList.splice(i, 1);
          i--;
        }
      }
    };
  }
}

// 총알 생성
function createBullet(x, y) {
  let b = new Bullet(); // 총알 하나 생성
  b.init(x, y);
}

// 거북이 미사일 생성
function turtleShoot(x, y) {
  let newBullet = new Bullet();
  if (turtleCreated) {
    newBullet.init(x, y);
  }
}

// 분신 미사일 생성
function fireBullet(x, y) {
  let newBullet = new Bullet();
  newBullet.init(x, y);
}
