// 잔몹 관련

class Enemy {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.init = function (x, y, speed) {
      this.y = y || 0;
      this.x = x || generateRandomValue(0, canvas.width - 80); // 48 = 적군 이미지 사이즈
      this.speed = Math.abs(speed) || enemySpeed;
      enemyList.push(this);
    };
    this.update = function (i) {
      this.y += this.speed; // 적군의 속도 조절

      // 바닥에 떨어지면 스코어와 포인트 증가
      if (this.y >= canvas.height - 48) {
        enemyList.splice(i, 1);
        score++;
        point++;
      }
    };
  }
}

// 잔몹 생성
function createEnemy() {
  setInterval(function () {
    if (score >= 10 && score !== 0 && !boss1Created) {
      createEnemyBoss1();
    } else if (score >= 100 && !boss2Created) {
      createEnemyBoss2();
    } else if (score >= 500 && !boss3Created) {
      createEnemyBoss3();
    } else if (score >= 1000 && !boss4Created) {
      createEnemyBoss4();
    } else if (score >= 1500) {
      createEnemyBoss1();
      createEnemyBoss2();
    } else if (score >= 2000) {
      createEnemyBoss3();
      createEnemyBoss4();
    } else if (score >= 2500) {
      createEnemyBoss4();
      createEnemyBoss4();
    } else if (score >= 3000) {
      createEnemyBoss4();
      createEnemyBoss4();
      createEnemyBoss4();
    } else {
      if (!isPaused) {
        let e = new Enemy();
        e.init();
      }
    }
  }, enemySpawnSpeed);
}
