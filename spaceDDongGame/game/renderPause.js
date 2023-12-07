// 퍼즈 걸었을 떄 관련

// 아이템 창 첫 화면
let selectedIndex = 0; // 선택된 아이템 인덱스
let shopItems = ["우주선", "강아지", "고양이", "거북이"]; // 상점 아이템 목록

// 우주선 눌렀을 때 아이템
let selectedSpaceIndexTrue = false; // 인덱스 0에서 엔터를 눌렀는지 판단
let renderSpaceTogle = false; // 엔터 누를 때마다 토글
let selectedSpaceIndex = 0;
let shopItemsSpace = ["속도", "크기", "순간이동", "분신술"];

// 강아지 눌렀을 때 아이템
let selectedDogIndexTrue = false; // 인덱스 1에서 엔터를 눌렀는지 판단
let renderDogTogle = false; // 토글 불리언값마다 보였다 안보였다하게
let selectedDogIndex = 0;
let shopItemsDog = ["보호속도", "보호거리"];

// 고양이 눌렀을 때 아이템
let selectedCatIndexTrue = false; // 인덱스 2에서 엔트를 눌렀는지 판단
let renderCatTogle = false;
let selectedCatIndex = 0;
let shopItemsCat = ["이동속도", "크기"];

// 거북이 눌렀을 때 아이템
let selectedTurtleIndexTrue = false; // 3
let renderTurtleTogle = false;
let selectedTurtleIndex = 0;
let shopItemsTurtle = ["이동속도", "총알속도"];

// 우주선 업그레이드 초기 비용
let playSpeedUpgradeCost = 10;
let playSizeUpgradeCost = 5;

// 강아지 업그레이드 초기 비용
let dogAngleUpgradeCost = 10;
let dogRadiusUpgradeCost = 10;
// let dogMovingUpgradeCost = 10; // 발사 사용 안함

// 고양이 업그레이드 초기 비용
let catSpeedUpgradeCost = 10;
let catSizeUpgradeCost = 10;

// 거북이 업그레이드 초기 비용
let turtleSpeedUpgradeCost = 20;
let turtleBulletUpgradeCost = 20;

// 우주선 업그레이드 배열
let spaceUpgrades = [
  {
    // 속도
    type: "speedUpgrade",
    cost: playSpeedUpgradeCost,
    description: "속도",
    apply: () => buyPlayerSpeedUpgrade(),
  },
  {
    // 크기 줄이기
    type: "sizeUpgrade",
    cost: playSizeUpgradeCost,
    description: "크기 줄이기",
    apply: () => buyPlayerSizeUpgrade(),
  },
  {
    // 순간이동
    type: "backKey",
    cost: 160,
    description: "순간이동",
    apply: () => buyPlayerBackTeleport("playerBackTeleport", 160),
  },
  {
    // 분신술
    type: "clone",
    cost: 360,
    description: "분신술",
    apply: () => buyPlayerClone("playerClone", 320),
  },
];
// 우주선 업그레이드
let buyPlayer = () => {
  if (selectedSpaceIndex < 0 || selectedSpaceIndex >= spaceUpgrades.length) {
    alert("잘못된 선택입니다.");
    return;
  }
  let selectedUpgrade = spaceUpgrades[selectedSpaceIndex];
  if (point >= selectedUpgrade.cost) {
    selectedUpgrade.apply();
    isPaused = false;
    selectedSpaceIndexTrue = false;
  } else {
    alert(`필요한 비용은 ${selectedUpgrade.cost} Coin 입니다.`);
    isPaused = false;
    selectedSpaceIndexTrue = false;
  }
};
// 우주선 속도
let buyPlayerSpeedUpgrade = (type) => {
  if (point >= playSpeedUpgradeCost) {
    if (playerSpeed < playerSpeedMAX) {
      point -= playSpeedUpgradeCost;
      playerSpeed += 1;
      alert(
        `우주선의 속도가 증가했습니다. 현재 속도는 ${Math.floor(
          playerSpeed
        )}입니다.`
      );
      playSpeedUpgradeCost *= 2; // 2배씩 증가
    } else {
      alert("더이상 증가시킬 수 없습니다.");
    }
  } else {
    alert(`필요한 비용은 ${playSpeedUpgradeCost} Coin 입니다.`);
  }
};
// 우주선 크기
let buyPlayerSizeUpgrade = (type) => {
  if (point >= playSizeUpgradeCost) {
    if (spaceshipSize > spaceshipSizeMAX) {
      point -= playSizeUpgradeCost;
      spaceshipSize -= 1;
      alert(
        `우주선의 크기가 -1 만큼 감소했습니다. 현재 크기는 ${spaceshipSize}입니다.`
      );
      playSizeUpgradeCost *= 2;
    } else {
      alert("더이상 감소시킬 수 없습니다.");
    }
  } else {
    alert(`필요한 비용은 ${playSizeUpgradeCost} Coin입니다.`);
  }
};
// 우주선 스킬 : 뒤로 순간이동
let buyPlayerBackTeleport = (type, cost) => {
  if (point >= cost) {
    point -= cost;
    playerSkeyActive = true;
    alert(
      `뒤로 순간이동 스킬이 활성화 되었습니다. 이제 s키를 누르면 뒤로 ${Math.floor(
        playerSpeed
      )}만큼 순간이동 합니다.`
    );
  } else {
    alert("비용이 부족합니다.");
  }
};
// 우주선 스킬 : 분신술
class Clone {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.actions = []; // 따라하는 행동
  }
  update() {
    const action = this.actions.shift(); //shift:첫 번째 요소 제거하고 반환
    if (action) {
      this.x = action.x;
      this.y = action.y;
    }
  }
  addAction(action) {
    this.actions.push(action);
  }
}
// 분신술 구현 함수
let useCloneSkill = () => {
  const newClone = new Clone(spaceshipX, spaceshipY);
  newClone.actions = [...playerActions]; // updata파일에서 복사된 플레이어 좌표
  clones.push(newClone); // 분신술 스킬 그릴때 사용
  return newClone;
};
// 우주선 스킬 : 분신술 구매
let buyPlayerClone = (type, cost) => {
  if (point >= cost) {
    point -= cost;
    const newClone = useCloneSkill(); // 생성된 분신 변수에 저장
    // 5초 후에 분신 제거
    setTimeout(() => {
      const index = clones.indexOf(newClone); // indexOf로 newClone이 있는지 확인
      if (index > -1) {
        // 분산이 있으면
        clones.splice(index, 1); // 분신 1개 제거(하나의 움직임만 따라하기 떄문에 다 제거됌)
      }
    }, 10000); // 10초 유지
  } else {
    alert("비용이 부족합니다.");
  }
};
// 강아지 업그레이드
let dogUpgrades = [
  {
    // 보호 속도
    type: "IsAngle",
    cost: dogAngleUpgradeCost,
    description: "보호속도",
    apply: () => buyPetUpgradeIsAngle(),
  },
  {
    // 보호 거리
    type: "radius",
    cost: dogRadiusUpgradeCost,
    description: "보호거리",
    apply: () => buyPetUpgradeRadius(),
  },
];

// 강아지 업그레이드
let buyPet = () => {
  if (selectedDogIndex < 0 || selectedDogIndex >= dogUpgrades.length) {
    alert("잘못된 선택입니다.");
    return;
  }
  let selectedUpgrade = dogUpgrades[selectedDogIndex];
  if (point >= selectedUpgrade.cost) {
    selectedUpgrade.apply();
    isPaused = false;
    selectedDogIndexTrue = false;
  } else {
    alert(`필요한 비용은 ${selectedUpgrade.cost} Coin 입니다.`);
    isPaused = false;
    selectedDogIndexTrue = false;
  }
};
// 강아지 업그레이드 (보호속도)
let buyPetUpgradeIsAngle = (type) => {
  if (point >= dogAngleUpgradeCost) {
    point -= dogAngleUpgradeCost;
    angleSpeed += 0.01;
    alert("강아지가 플레이어 주위를 도는 속도가 빨라집니다.");
    dogAngleUpgradeCost *= 2;
  } else {
    alert(`필요한 비용은 ${dogAngleUpgradeCost} Coin입니다.`);
  }
};
// 강아지 업그레이드 (보호거리)
let buyPetUpgradeRadius = (type) => {
  if (point >= dogRadiusUpgradeCost) {
    point -= dogRadiusUpgradeCost;
    radius += 10;
    alert("강아지가 플레이어 주위에서 조금씩 멀어집니다.");
    dogRadiusUpgradeCost *= 2;
  } else {
    alert(`필요한 비용은 ${dogRadiusUpgradeCost} Coin입니다.`);
  }
};

// 강아지 업그레이드 (일자 발사)
// let buyPetUpgradeIsMoving = (type) => {
//     if(point >= dogMovingUpgradeCost && petCreated) {
//         if(!petBuy){
//             point -= dogMovingUpgradeCost;
//             petBuy = true;
//             alert("이제 w키를 누르면, 강아지가 앞으로 발사 되고 다시 돌아옵니다.");
//         }else{
//             point -= dogMovingUpgradeCost;
//             petYSpeed += 1;
//             alert(`발사 속도가 증가합니다. 현재 발사속도는 ${petYSpeed}입니다.`)
//             dogMovingUpgradeCost *= 2;
//         }
//     }else {
//         alert(`필요한 비용은 ${dogMovingUpgradeCost}Coin입니다.`);
//     };
// };

// 고양이 업그레이드 배열
let catUpgrades = [
  {
    // 이동속도
    type: "catSpeed",
    cost: catSpeedUpgradeCost,
    description: "이동속도",
    apply: () => buyCatMovingSpeed(),
  },
  {
    // 크기
    type: "catSize",
    cost: catSizeUpgradeCost,
    description: "크기",
    apply: () => buyCatSizeUpgrade(),
  },
];

// 고양이 구매
let buyCat = (type, cost) => {
  if (selectedCatIndex < 0 || selectedCatIndex >= catUpgrades.length) {
    alert("잘못된 선택입니다.");
    return;
  }
  let selectedUpgrade = catUpgrades[selectedCatIndex];
  if (point >= selectedUpgrade.cost) {
    selectedUpgrade.apply();
    isPaused = false;
    selectedCatIndexTrue = false;
  } else {
    alert(`필요한 비용은 ${selectedUpgrade.cost} Coin 입니다.`);
    isPaused = false;
    selectedCatIndexTrue = false;
  }
};
// 고양이 이동 속도 업그레이드
let buyCatMovingSpeed = (type) => {
  if (point >= catSpeedUpgradeCost) {
    if (!catIsMoving) {
      point -= catSpeedUpgradeCost;
      catIsMoving = true;
      alert("고양이가 우주에 방생됩니다.");
    } else {
      if (
        Math.abs(catSpeedX) < catSpeedXMAX &&
        Math.abs(catSpeedY) < catSpeedYMAX
      ) {
        if (goingRight) {
          catSpeedX = Math.abs(catSpeedX) + 1;
          catSpeedY = Math.abs(catSpeedY) + 1;
        } else {
          catSpeedX = Math.abs(catSpeedX) + 1;
          catSpeedY = Math.abs(catSpeedY) + 1;
        }
        point -= catSpeedUpgradeCost;
        alert(`속도가 ${Math.abs(catSpeedX)}로 증가했습니다.`);
        catSpeedUpgradeCost *= 2;
      } else {
        alert("더이상 증가시킬 수 없습니다.");
      }
    }
  } else {
    alert(`필요한 비용은 ${catSpeedUpgradeCost}Coin입니다.`);
  }
};
// 고양이 크기 업그레이드
let buyCatSizeUpgrade = (type) => {
  if (point >= catSizeUpgradeCost) {
    if (!catIsMoving) {
      point -= catSizeUpgradeCost;
      catIsMoving = true;
      alert("고양이가 우주에 방생됩니다.");
    } else {
      if (catSize < catSizeMAX) {
        point -= catSizeUpgradeCost;
        catSize += 5;
        alert(`고양이의 크기가 증가합니다. 현재 크기는 ${catSize}입니다.`);
        catSizeUpgradeCost *= 2;
      } else {
        alert("더이상 벌크업할 수 없습니다.");
      }
    }
  } else {
    alert(`필요한 비용은 ${catSizeUpgradeCost}Coin입니다.`);
  }
};

let turtleUpgades = [
  {
    // 이동속도
    type: "speedUpgrade",
    cost: turtleSpeedUpgradeCost,
    description: "이동 속도",
    apply: () => buyTurtleUpgradeTurtleIsMoving(),
  },
  {
    // 총알속도
    type: "bulletUpgrade",
    cost: turtleBulletUpgradeCost,
    description: "총알 속도",
    apply: () => buyTurtleUpgradeTuttleShot(),
  },
];
// 거북이 구매
let buyTurtle = (type, cost) => {
  if (selectedTurtleIndex < 0 || selectedTurtleIndex >= turtleUpgades.length) {
    alert("잘못된 선택입니다.");
    return;
  }
  let selectedUpgrade = turtleUpgades[selectedTurtleIndex];
  if (point >= selectedUpgrade.cost) {
    selectedUpgrade.apply();
    isPaused = false;
    selectedTurtleIndexTrue = false;
  } else {
    alert(`필요한 비용은 ${selectedUpgrade.cost} Coin 입니다.`);
    isPaused = false;
    selectedTurtleIndexTrue = false;
  }
};
// 거북이 총알 업그레이드
let buyTurtleUpgradeTuttleShot = (type) => {
  if (point >= turtleBulletUpgradeCost && turtleCreated) {
    if (!intervalId) {
      point -= turtleBulletUpgradeCost;
      intervalId = setInterval(
        () => turtleShoot(turtleX, turtleY),
        1000 / shotsPerSecond
      );
      alert(`이제 거북이가 총알을 발사합니다. 초당 ${shotsPerSecond}발`);
    } else {
      point -= turtleBulletUpgradeCost;
      clearInterval(intervalId);
      shotsPerSecond++;
      intervalId = setInterval(
        () => turtleShoot(turtleX, turtleY),
        1000 / shotsPerSecond
      );
      alert(`거북이의 총알이 초당${shotsPerSecond}발 씩 발사합니다.`);
      turtleBulletUpgradeCost *= 2;
    }
  } else {
    alert(`필요한 비용은 ${turtleBulletUpgradeCost}Coin입니다.`);
  }
};
// 거북이 속도 업그레이드
let buyTurtleUpgradeTurtleIsMoving = (type) => {
  if (point >= turtleSpeedUpgradeCost && turtleCreated) {
    if (!turtleIsMoving) {
      point -= turtleSpeedUpgradeCost;
      // turtleIsMoving = true;
      alert(
        `거북이가 이제 좌우로 움직입니다. 한번 더 구매하면 속도가 올라갑니다.`
      );
    } else {
      if (Math.abs(turtleSpeedX) < turtleSpeedXMAX) {
        point -= turtleSpeedUpgradeCost;
        if (goingRight) {
          turtleSpeedX = Math.abs(turtleSpeedX) + 1;
        } else {
          turtleSpeedX = Math.abs(turtleSpeedX) - 1;
        }
        alert(`거북이의 속도가 ${Math.abs(turtleSpeedX)}가 되었습니다.`);
        turtleSpeedUpgradeCost *= 2;
      } else {
        alert("더이상 증가시킬 수 없습니다.");
      }
    }
  } else {
    alert(`필요한 비용은 ${turtleSpeedUpgradeCost}Coin입니다.`);
  }
};

/////////////일시정지 관련///////////

// 일시정지 기능 추가

// 일시정지 토글
function togglePause() {
  isPaused = !isPaused;
}

// 일시정지 키 입력 (esc나 p 누르면 일시정지)
window.addEventListener("keydown", function (event) {
  if (
    event.key === "p" ||
    event.key === "P" ||
    event.key === "ㅔ" ||
    event.key === "ㅖ" ||
    event.keyCode === 27
  ) {
    togglePause();
  }
});

// pause 그리기
function renderPause() {
  // 일시정지 시, 반투명 검은색 레이어
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 상점 아이템 표시
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("업그레이드 상점", canvas.width / 2, 70);

  // 우주선
  ctx.drawImage(spaceshipImage, 150, 100, 70, 70);
  // 강아지
  ctx.drawImage(petImage, 300, 100, 70, 70);
  // 고양이
  ctx.drawImage(catImage, 450, 100, 70, 70);
  // 거북이
  ctx.drawImage(turtleImage, 600, 100, 70, 70);

  // 첫 창
  if (selectedIndex === 0) {
    ctx.strokeStyle = "red"; // 테두리 색깔
    ctx.lineWidth = 5; // 테두리 두께
    ctx.strokeRect(145, 95, 80, 80); // 선택 표시 레이아웃
  }
  if (selectedIndex === 1) {
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 5;
    ctx.strokeRect(295, 95, 80, 80);
  }
  if (selectedIndex === 2) {
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 5;
    ctx.strokeRect(445, 95, 80, 80);
  }
  if (selectedIndex === 3) {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;
    ctx.strokeRect(595, 95, 80, 80);
  }
  // 우주선 UI
  if (selectedIndex === 0 && selectedSpaceIndexTrue) {
    renderPlayerSpeedUpgradeImg(); // 스피드 이미지
    renderPlayerSizeUpgradeImg(); // 사이즈 이미지
    renderPlayerbackKeyUpgradeImg(); // 순간이동 이미지
    renderPlayerCloneUpgradeImg(); // 분신술 이미지

    // 인덱스 0번(우주선) 엔터 누르고 나서 우주선 업그레이드 레이아웃
    if (selectedSpaceIndex === 0 && selectedSpaceIndexTrue) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 5;
      ctx.strokeRect(145, 195, 80, 80);
      // 비용 텍스트 그리기
      ctx.font = "12px Arial"; // 글자 크기와 글꼴 설정
      ctx.fillStyle = "white"; // 글자 색상 설정       +90 , +50
      ctx.fillText(`필요비용 ${playSpeedUpgradeCost}`, 235, 245); // 텍스트와 위치 설정
    }
    if (selectedSpaceIndex === 1 && selectedSpaceIndexTrue) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 5;
      ctx.strokeRect(145, 295, 80, 80);

      ctx.font = "12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`필요비용 ${playSizeUpgradeCost}`, 235, 345);
    }
    if (selectedSpaceIndex === 2 && selectedSpaceIndexTrue) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 5;
      ctx.strokeRect(145, 395, 80, 80);

      ctx.font = "12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`필요비용 160`, 235, 445);
    }
    if (selectedSpaceIndex === 3 && selectedSpaceIndexTrue) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 5;
      ctx.strokeRect(145, 495, 80, 80);

      ctx.font = "12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`필요비용 320`, 235, 545);
    }
  }
  // 강아지 UI
  if (selectedIndex === 1 && selectedDogIndexTrue) {
    renderPetUpgradeIsAngleImg();
    renderPetUpgradeRadiusImg();

    // 강아지 레이아웃
    if (selectedDogIndex === 0 && selectedDogIndexTrue) {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 5;
      ctx.strokeRect(295, 195, 80, 80);

      ctx.font = "12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`필요비용 ${dogAngleUpgradeCost}`, 385, 245);
    }
    if (selectedDogIndex === 1 && selectedDogIndexTrue) {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 5;
      ctx.strokeRect(295, 295, 80, 80);

      ctx.font = "12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`필요비용 ${dogRadiusUpgradeCost}`, 385, 345);
    }
  }

  // 고양이 UI
  if (selectedIndex === 2 && selectedCatIndexTrue) {
    renderCatUpgradeSpeedImg();
    renderCatUpgradeSizeImg();

    // 고양이 레이아웃
    if (selectedCatIndex === 0 && selectedCatIndexTrue) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 5;
      ctx.strokeRect(445, 195, 80, 80);

      ctx.font = "12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`필요비용 ${catSpeedUpgradeCost}`, 535, 245);
    }
    if (selectedCatIndex === 1 && selectedCatIndexTrue) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 5;
      ctx.strokeRect(445, 295, 80, 80);

      ctx.font = "12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`필요비용 ${catSizeUpgradeCost}`, 535, 345);
    }
  }

  // 거북이 UI
  if (selectedIndex === 3 && selectedTurtleIndexTrue) {
    renderTurtleUpgradebulletImg();
    renderTurtleUpgradeSpeedImg();

    // 거북이 레이아웃
    if (selectedTurtleIndex === 0 && selectedTurtleIndexTrue) {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 5;
      ctx.strokeRect(595, 195, 80, 80);

      ctx.font = "12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`필요비용 ${turtleBulletUpgradeCost}`, 685, 245);
    }
    if (selectedTurtleIndex === 1 && selectedTurtleIndexTrue) {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 5;
      ctx.strokeRect(595, 295, 80, 80);

      ctx.font = "12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`필요비용 ${turtleSpeedUpgradeCost}`, 685, 345);
    }
  }
  // 상점 아이템 표시
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("업그레이드 상점", canvas.width / 2, 70);

  // 게임 간략 설명
  ctx.fillStyle = "yellow";
  // ctx.fillText('=1.떨어지는 똥에 닿으면 hp가 감소한다.', canvas.width / 2, 250);
}

// 키보드 이벤트
window.addEventListener("keydown", (e) => {
  if (isPaused) {
    if (e.key === "ArrowRight") {
      selectedIndex = (selectedIndex + 1) % shopItems.length;
    }
    if (e.key === "ArrowLeft") {
      selectedIndex = (selectedIndex - 1 + shopItems.length) % shopItems.length;
    }
    if (e.key === "ArrowDown") {
      // 인덱스랑 shop 똑같게 설정 우주선,강아지,고양이,거북이
      selectedSpaceIndex = (selectedSpaceIndex + 1) % shopItemsSpace.length;
      selectedDogIndex = (selectedDogIndex + 1) % shopItemsDog.length;
      selectedCatIndex = (selectedCatIndex + 1) % shopItemsCat.length;
      selectedTurtleIndex = (selectedTurtleIndex + 1) % shopItemsTurtle.length;
    }
    if (e.key === "ArrowUp") {
      // 우주선
      selectedSpaceIndex =
        (selectedSpaceIndex - 1 + shopItemsSpace.length) %
        shopItemsSpace.length;
      // 강아지
      selectedDogIndex =
        (selectedDogIndex - 1 + shopItemsDog.length) % shopItemsDog.length;
      // 고양이
      selectedCatIndex =
        (selectedCatIndex - 1 + shopItemsCat.length) % shopItemsCat.length;
      // 거북이
      selectedTurtleIndex =
        (selectedTurtleIndex - 1 + shopItemsTurtle.length) %
        shopItemsTurtle.length;
    }

    // 해당 아이템 셀렉, 구입 비용
    if (e.key === "Enter") {
      // 우주선 엔터 부분
      if (selectedIndex === 0) {
        selectedSpaceIndexTrue = true; // 엔터 눌러야 넘어감

        if (selectedSpaceIndexTrue && renderSpaceTogle) {
          // 토글 구현 부분
          renderSpaceTogle = false;
          buyPlayer();
        } else {
          renderSpaceTogle = true;
          renderPlayerSpeedUpgradeImg();
          renderPlayerSizeUpgradeImg();
          renderPlayerbackKeyUpgradeImg();
          renderPlayerCloneUpgradeImg();
        }
      }

      // 강아지 엔터 부분
      if (selectedIndex === 1) {
        selectedDogIndexTrue = true;

        if (selectedDogIndexTrue && renderDogTogle) {
          renderDogTogle = false;
          buyPet();
        } else {
          renderDogTogle = true;
          renderPetUpgradeIsAngleImg();
          renderPetUpgradeRadiusImg();
        }
      }

      // 고양이 엔터 부분
      if (selectedIndex === 2) {
        selectedCatIndexTrue = true;

        if (selectedCatIndexTrue && renderCatTogle) {
          renderCatTogle = false;
          buyCat();
        } else {
          renderCatTogle = true;
          renderCatUpgradeSpeedImg();
          renderCatUpgradeSizeImg();
        }
      }
      // 거북이 엔터 부분
      if (selectedIndex === 3) {
        selectedTurtleIndexTrue = true;

        if (selectedTurtleIndexTrue && renderTurtleTogle) {
          renderTurtleTogle = false;
          buyTurtle();
        } else {
          renderTurtleTogle = true;
          renderTurtleUpgradebulletImg();
          renderTurtleUpgradeSpeedImg();
        }
      }
    }
  }
});

// 우주선 업그레이드 이미지
const renderPlayerSpeedUpgradeImg = () => {
  if (renderSpaceTogle)
    // 토글 true, false 상태에 따라 렌더링
    ctx.drawImage(speedImage, 150, 200, 70, 70);
};
const renderPlayerSizeUpgradeImg = () => {
  if (renderSpaceTogle) ctx.drawImage(sizedownImg, 150, 300, 70, 70);
};
const renderPlayerbackKeyUpgradeImg = () => {
  if (renderSpaceTogle) ctx.drawImage(backjumpImg, 150, 400, 70, 70);
};
const renderPlayerCloneUpgradeImg = () => {
  if (renderSpaceTogle) ctx.drawImage(cloneImg, 150, 500, 70, 70);
};

// 강아지 업그레이드 이미지
const renderPetUpgradeIsAngleImg = () => {
  if (renderDogTogle) ctx.drawImage(speedImage, 300, 200, 70, 70);
};
const renderPetUpgradeRadiusImg = () => {
  if (renderDogTogle) ctx.drawImage(radiusImg, 300, 300, 70, 70);
};

// 고양이 업그레이드 이미지
const renderCatUpgradeSpeedImg = () => {
  if (renderCatTogle) ctx.drawImage(speedImage, 450, 200, 70, 70);
};
const renderCatUpgradeSizeImg = () => {
  if (renderCatTogle) ctx.drawImage(catfoodImg, 450, 300, 70, 70);
};
// 거북이 업그레이드 이미지
const renderTurtleUpgradebulletImg = () => {
  if (renderTurtleTogle) ctx.drawImage(speedImage, 600, 200, 70, 70);
};
const renderTurtleUpgradeSpeedImg = () => {
  if (renderTurtleTogle) ctx.drawImage(bulletImage, 600, 300, 70, 70);
};
