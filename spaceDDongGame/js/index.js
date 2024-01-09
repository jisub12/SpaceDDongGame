// 방향키, 렌더 관련

function generateRandomValue(min, max) {
  // min,max = 최대값 최소값 미리 정해준것 / 화면 밖에서 생성되면 안되므로
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min; // 공식
  return randomNum;
}

// 플레이어 방향키를 누르면 생기는 이벤트
let keysDown = {};
const setupKeyboardListener = () => {
  document.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
    if (event.keyCode == 32) {
      // 스페이스 바
      clonePositions.forEach((clonePos) => {
        fireBullet(clonePos.x, clonePos.y);
      });
      clonePositions = []; // 분신 위치 다시 초기화
    }
    if (
      (event.key === "s" || event.key === "S" || event.key === "ㄴ") &&
      playerSkeyActive
    ) {
      // s키
      spaceshipY += playerSpeed * 20;
    }
    // if((event.key === 'w' || event.key === 'W' || event.key === 'ㅈ') && petBuy) {

    //   petIsMoving = false;
    // }
  });

  // 키 뗏을 때
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
    if (event.keyCode == 32) {
      // 스페이스 바
      // createBullet(spaceshipX, spaceshipY);
    }
    if (
      (event.key === "w" || event.key === "W" || event.key === "ㅈ") &&
      petBuy
    ) {
      petIsMoving = true;
    }
  });
};

function main() {
  render(); // 그려줌

  if (!gameOver) {
    if (!isPaused) {
      update(); // 좌표 값 업데이트
    }

    if (isPaused) {
      renderPause();
    }

    // 백그라운드 동작 및 비활성화시 중지(성능 최적화)
    // 최대 1ms(1/1000s)로 제한되며 1초에 60번 동작
    // 다수의 애니메이션에도 각각 타이머 값을 생성 및 참조하지 않고 내부의 동일한 타이머 참조
    requestAnimationFrame(main);
  } else {
    // 게임 종료 이미지
    ctx.drawImage(enemyImage, 150, 150, 500, 500);
  }
}

loadImage();
createEnemy();
setupKeyboardListener();
main();
