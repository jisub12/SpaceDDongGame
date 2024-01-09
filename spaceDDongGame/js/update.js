// 이동, 충동 업데이트 관련

function update() {
  // 플레이어 이동
  if (39 in keysDown) {
    spaceshipX += playerSpeed; // 오른쪽
    playerActions.push({ x: spaceshipX, y: spaceshipY });
  }
  if (37 in keysDown) {
    spaceshipX -= playerSpeed; // 왼쪽
    playerActions.push({ x: spaceshipX, y: spaceshipY });
  }
  if (38 in keysDown) {
    spaceshipY -= playerSpeed; // 위
    playerActions.push({ x: spaceshipX, y: spaceshipY });
  }
  if (40 in keysDown) {
    spaceshipY += playerSpeed; // 아래
    playerActions.push({ x: spaceshipX, y: spaceshipY });
  }

  // 강아지 발사
  if (petIsMoving && petBuy) {
    // 강아지 위로
    petY -= petYSpeed;
    if (petY < 60) {
      // 상단 벽에 도달하면
      petY = -spaceshipY;
      petX = -spaceshipX;
      petIsMoving = false;
      petIsAngle = true;
    }
  }
  // 강아지가 플레이어 주위를 원형 경로로 돌도록.
  if (petIsAngle && !petIsMoving) {
    petX = spaceshipX + radius * Math.cos(angle); // angle 각도
    petY = spaceshipY + radius * Math.sin(angle); // radius 거리
    angle += angleSpeed; // 도는 속도 증가
  }
  // 고양이 위치
  if (!catIsMoving) {
    catX = spaceshipX + 30;
    catY = spaceshipY + 30;
  }
  // 펫 맵 밖으로 나가지 않게
  if (petX <= 0) {
    petX = 0;
  }
  if (petX >= canvas.width - petSize) {
    petX = canvas.width - petSize;
  }
  if (petY >= canvas.height - petSize) {
    petY = canvas.height - petSize;
  }
  if (petY <= 60) {
    petY = 60;
  }
  if (catX <= 0) {
    catX = 0;
  }
  if (catX >= canvas.width - catSize) {
    catX = canvas.width - catSize;
  }
  if (catY >= canvas.height - catSize) {
    catY = canvas.height - catSize;
  }
  if (catY <= 60) {
    catY = 60;
  }
  // 고양이 움직임 처리
  if (catIsMoving) {
    catX += catSpeedX;
    catY += catSpeedY;
    // 고양이가 캔버스의 왼쪽 또는 오른쪽 경계에 도달하면 x축 속도 방향 반전
    if (catX <= 0 || catX >= canvas.width - catSize) {
      catSpeedX = -catSpeedX;
    }
    // 고양이가 캔버스의 상단 또는 하단 경계에 도달하면 y축 속도 방향 반전
    if (catY <= 60 || catY >= canvas.height - catSize) {
      catSpeedY = -catSpeedY;
    }
  }

  // 거북이 움직임 처리
  if (turtleIsMoving) {
    turtleX += turtleSpeedX;
    if (turtleX <= 0 || turtleX >= canvas.width - turtleSize) {
      turtleSpeedX = -turtleSpeedX;
    }
  }

  // 우주선의 좌표값이 무한대로 업데이트가 되는 게 아닌, 경기장 안에서만 있게
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 60) {
    spaceshipX = canvas.width - 60;
  }
  if (spaceshipY >= canvas.height - 60) {
    spaceshipY = canvas.height - 60;
  }
  if (spaceshipY <= 60) {
    spaceshipY = 60;
  }
  // 총알의 y 좌표 업데이트 하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }
  ////////////// 충돌 //////////////

  // 우주선 몸으로 적군 부수는 함수
  function checkSpaceshipCollision(enemy) {
    // 보스 충돌되도 사라지지 않게
    if (enemy instanceof Boss) {
      return false;
    }
    return (
      spaceshipX < enemy.x + spaceshipSize &&
      spaceshipX + spaceshipSize > enemy.x &&
      spaceshipY < enemy.y + spaceshipSize &&
      spaceshipY + spaceshipSize > enemy.y
    );
  }

  // 강아지와 적군의 충돌 감지 함수
  function checkPetCollision(enemy) {
    if (enemy instanceof Boss) {
      return false;
    }
    return (
      petX < enemy.x + petSize &&
      petX + petSize > enemy.x &&
      petY < enemy.y + petSize &&
      petY + petSize > enemy.y
    );
  }

  // 고양이와 적군의 충돌 감지 함수
  function checkCatCollision(enemy) {
    if (enemy instanceof Boss) {
      return false;
    }
    return (
      catX < enemy.x + catSize &&
      catX + catSize > enemy.x &&
      catY < enemy.y + catSize &&
      catY + catSize > enemy.y
    );
  }

  // 거북이와 적군의 충돌 감지 함수
  function checkTurtleCollision(enemy) {
    if (enemy instanceof Boss) {
      return false;
    }

    return (
      turtleX < enemy.x + turtleSize &&
      turtleX + turtleSize > enemy.x &&
      turtleY < enemy.y + turtleSize &&
      turtleY + turtleSize > enemy.y
    );
  }
  // 보석을 먹으면 필살기가 실행되는 함수
  for (let i = 0; i < gemList.length; i++) {
    if (checkSpaceshipCollision(gemList[i])) {
      gemList.splice(i, 1);
      i--;
      const newClone = useCloneSkill(); // 생성된 분신 변수에 저장
      // 5초 후에 분신 제거
      setTimeout(() => {
        const index = clones.indexOf(newClone); // indexOf로 newClone을 찾음
        if (index > -1) {
          // 분산이 있으면
          clones.splice(index, 1); // 분신 1개 제거
        }
      }, 10000);
    }
  }

  // 적군 잔몹들 아래로 내려오는 함수 // 움직임
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update(i);

    // 플레이어와 잔몹이 충돌했는지 확인
    if (checkSpaceshipCollision(enemyList[i])) {
      if (!invincible && clones.length === 0) { // 분신, hp깍였을 때 무적 상태
        playHp--;
        invincible = true; // 충돌 후 무적 상태 돌입
        setTimeout(() => {
          invincible = false; // 3초 후에 무적 상태 해제
        }, 3000); // 3초 무적
      }
      enemyList.splice(i, 1); // 적 제거
      i--; // 인덱스 조정
    }
  }
  // 강아지와 잔몹이 충돌했는지 확인
  for (let i = 0; i < enemyList.length; i++) {
    if (checkPetCollision(enemyList[i])) {
      score++; // 스코어 증가
      point++;

      const enemyX = enemyList[i].x;
      const enemyY = enemyList[i].y;

      // 보석 생성
      if (Math.random() < 0.005) {
        // 0.5%
        const gem = new Gem(enemyX, enemyY);
        gemList.push(gem);
      }

      enemyList.splice(i, 1); // 적 제거
      i--; // 인덱스 조정
    }
  }
  // 고양이와 잔몹이 충돌했는지 확인
  for (let i = 0; i < enemyList.length; i++) {
    if (checkCatCollision(enemyList[i])) {
      score++;
      point++;

      const enemyX = enemyList[i].x;
      const enemyY = enemyList[i].y;

      // 보석 생성
      if (Math.random() < 0.005) {
        // 0.5%
        const gem = new Gem(enemyX, enemyY);
        gemList.push(gem);
      }

      enemyList.splice(i, 1);
      i--;
    }
  }
  // 거북이와 잔몹이 충돌했는지 확인
  for (let i = 0; i < enemyList.length; i++) {
    if (checkTurtleCollision(enemyList[i])) {
      score++;
      point++;

      const enemyX = enemyList[i].x;
      const enemyY = enemyList[i].y;

      // 보석 생성
      if (Math.random() < 0.005) {
        const gem = new Gem(enemyX, enemyY);
        gemList.push(gem);
      }

      enemyList.splice(i, 1);
      i--;
    }
  }
  /////////////////////////////////////////

  // 분신술 스킬 그리기
  clones.forEach((clone) => {
    // 분신이 4개라 좌표값을 다 따로 정해야해서 clone 변수 사용안함
    let cloneX1 = spaceshipX + 100;
    let cloneY1 = spaceshipY;
    let cloneX2 = spaceshipX - 100;
    let cloneY2 = spaceshipY;
    let cloneX3 = spaceshipX;
    let cloneY3 = spaceshipY - 100;
    let cloneX4 = spaceshipX;
    let cloneY4 = spaceshipY + 100;
    // 분신 4개
    ctx.drawImage(
      spaceshipImage,
      cloneX1,
      cloneY1,
      spaceshipSize,
      spaceshipSize
    );
    ctx.drawImage(
      spaceshipImage,
      cloneX2,
      cloneY2,
      spaceshipSize,
      spaceshipSize
    );
    ctx.drawImage(
      spaceshipImage,
      cloneX3,
      cloneY3,
      spaceshipSize,
      spaceshipSize
    );
    ctx.drawImage(
      spaceshipImage,
      cloneX4,
      cloneY4,
      spaceshipSize,
      spaceshipSize
    );
    // 분신 4개 포지션
    clonePositions = [
      { x: cloneX1, y: cloneY1 },
      { x: cloneX2, y: cloneY2 },
      { x: cloneX3, y: cloneY3 },
      { x: cloneX4, y: cloneY4 },
    ];
    // 분신과 적군의 충돌 감지 함수
    function checkCloneCollision(enemy, cloneX, cloneY) {
      if (enemy instanceof Boss) {
        return false;
      }
      return (
        cloneX < enemy.x + spaceshipSize &&
        cloneX + spaceshipSize > enemy.x &&
        cloneY < enemy.y + spaceshipSize &&
        cloneY + spaceshipSize > enemy.y
      );
    }
    // 분신과 잔몹이 충돌했는지 확인
    for (let i = 0; i < enemyList.length; i++) {
      clonePositions.forEach((clonePos) => {
        if (
          enemyList[i] &&
          checkCloneCollision(enemyList[i], clonePos.x, clonePos.y)
        ) {
          enemyList.splice(i, 1); // 적 제거
          score++; // 스코어 증가
          point++;
          i--; // 인덱스 조정
        }
      });
    }
  }); // 분신술 스킬 그리기 끝
} // update() 끝
