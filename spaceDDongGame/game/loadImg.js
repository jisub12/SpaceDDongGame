// 캔버스 세팅, 이미지 관련

// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 750;
canvas.style.marginTop = "35px";
document.body.appendChild(canvas);

// 이미지 가져오기
let backgroundImage,
  spaceshipImage,
  bulletImage,
  enemyImage,
  gameOverImage,
  enemyBoss1Image,
  enemyBoss2Image,
  enemyBoss3Image,
  enemyBoss4Image,
  petImage,
  catImage,
  turtleImage,
  gemImage,
  speedImage,
  radiusImg,
  backjumpImg,
  cloneImg,
  catfoodImg,
  sizedownImg

// 게임의 상태 값
let gameOver = false;
let boss1Created = false; // 보스1
let boss2Created = false; // 보스2
let boss3Created = false; // 보스3
let boss4Created = false;

let highestScore = localStorage.getItem("highestScore") || 0; // 최고 점수
let recentScore = localStorage.getItem('recentScore') || 0; // 최근 점수
let score = 0; // 스코어
let point = 0; // 포인트

// 플레이어 관련
let spaceshipX = canvas.width / 2 - 30; // 왼쪽 제일 위가 0 , 넓이 = 가로 넓이 2로 나누고 우주선 크기에 절반
let spaceshipY = canvas.height - 60; // 왼쪽 제일 위가 0 , 길이 = 세로 넓이 - 우주선크기

let spaceshipSize = 60; // 플레이어 초기 크기
let spaceshipSizeMAX = 30;
let playerSpeed = 3; // 플레이어 기본 스피드 값
let playerSpeedMAX = 6;
let playerSkeyActive = false; // s 키 활성화
let playHp = 5; // 플레이어 HP
let initialPlayHp = 5; // HP와 비교 값, hp감소마다 사이즈 줄이기 위해 적용
let invincible = false; // 플레이어 무적 상태 값
let visible = true; // hp 닳았을 때 반짝거리는 효과

// 분신 관련
let clonePositions = []; // 분신들 포지션 좌표
let playerActions = []; // 클론 액션 따라하게 될 플레이어 좌표 복사
let clones = []; // 분신술 렌더할 때 사용

// 적 관련
let enemySpeed = 2; // 적 내려오는 스피드 값
let enemySpawnSpeed = 1000; // 적 생성 속도
let interval; // 적군 인터벌

let isPaused = true; // 일시정지 기능

let bulletList = []; // 총알들을 저장하는 리스트

let imageSize = 0;

// 펫 관련
let angle = 0; // 펫의 원형 경로를 따라 움직이기 위한 각도

// 강아지
let petSize = 48;
let petCreated = true;
let petX = canvas.width / 2 - 55;
let petY = canvas.height;
let petBuy = false;
let petIsMoving = false;
let petIsAngle = true;
let angleSpeed = 0.05; // 강아지가 원형으로 도는 속도
let radius = 70; // 강아지가 플레이어로부터 얼마나 떨어져 있을지 설정.
let petYSpeed = 7; // 강아지 발사 속도

// 고양이
let catSize = 20;
let catSizeMAX = 80;
let catCreated = true;
let catX = canvas.width / 2 - 55;
let catY = canvas.height;
let catIsMoving = false;
let catSpeedX = 1;
let catSpeedY = 1;
let catSpeedXMAX = 10;
let catSpeedYMAX = 10;

// 거북이
let turtleSize = 50;
let turtleCreated = true;
let turtleX = canvas.width / 2 - 25;
let turtleY = canvas.height - 50;
let turtleIsMoving = true;
let turtleSpeedX = 1;
let turtleSpeedXMAX = 10;
let goingRight = true;
let intervalId; // setInterval 담아놓을 변수
let shotsPerSecond = 1; // 초당 발사 빈도

// 적군
let enemyList = [];

// 보석
let gemList = [];
const dropGemPercent = Math.random(); // 보석 나올 확률 랜덤

// 이미지 관련
function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.avif";

  spaceshipImage = new Image();
  spaceshipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.png";

  enemyBoss1Image = new Image();
  enemyBoss1Image.src = "images/enemyBoss1.png";

  enemyBoss2Image = new Image();
  enemyBoss2Image.src = "images/enemyBoss2.png";

  enemyBoss3Image = new Image();
  enemyBoss3Image.src = "images/enemyBoss3.png";

  enemyBoss4Image = new Image();
  enemyBoss4Image.src = "images/enemyBoss4.png";

  petImage = new Image();
  petImage.src = "images/pet.png";

  catImage = new Image();
  catImage.src = "images/cat.png";

  turtleImage = new Image();
  turtleImage.src = "images/turtle.png";

  gemImage = new Image();
  gemImage.src = "images/gem.png";


  speedImage = new Image();
  speedImage.src = 'images/speed.png';


  radiusImg = new Image();
  radiusImg.src = 'images/radius.png';

  backjumpImg = new Image();
  backjumpImg.src = 'images/backjump.png';

  cloneImg = new Image();
  cloneImg.src = 'images/clone.png';

  catfoodImg = new Image();
  catfoodImg.src = 'images/catfood.png';

  sizedownImg = new Image();
  sizedownImg.src = 'images/sizedown.png';
}

// 이미지 캔버스에 그려주기
function render() {
  // 맵 생성
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  // 플레이어 생성

  if (visible) {
    ctx.drawImage(
      spaceshipImage,
      spaceshipX,
      spaceshipY,
      spaceshipSize,
      spaceshipSize
    );
  }
  // 강아지 생성
  if (petCreated) {
    ctx.drawImage(petImage, petX, petY, petSize, petSize);
  }
  // 고양이 생성
  if (catCreated) {
    ctx.drawImage(catImage, catX, catY, catSize, catSize);
  }
  // 거북이 생성
  if (turtleCreated) {
    ctx.drawImage(turtleImage, turtleX, turtleY, turtleSize, turtleSize);
  }
  // 총알 생성
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }
  // 보스 생성
  for (let i = 0; i < enemyList.length; i++) {
    if (enemyList[i].type === "boss1") {
      ctx.drawImage(enemyBoss1Image, enemyList[i].x, enemyList[i].y);
    } else if (enemyList[i].type === "boss2") {
      ctx.drawImage(enemyBoss2Image, enemyList[i].x, enemyList[i].y);
    } else if (enemyList[i].type === "boss3") {
      ctx.drawImage(enemyBoss3Image, enemyList[i].x, enemyList[i].y);
    } else if (enemyList[i].type === "boss4") {
      ctx.drawImage(enemyBoss4Image, enemyList[i].x, enemyList[i].y);
    }
    // 잔몹 생성
    else {
      ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
  }
  // 보석 생성
  gemList.forEach((gem) => gem.draw(ctx));

  // 최고 점수 표시
  ctx.fillStyle = "red";
  ctx.fillText(`Best : ${highestScore}`, 75, 30);
  // 스코어 표시
  ctx.fillStyle = "green";
  ctx.fillText(`Score : ${score}`, 280, 30);

  // 포인트 표시
  ctx.fillStyle = "yellow";
  ctx.fillText(`Coin : ${point}`, 500, 30);

  // 플레이어 hp 표시
  ctx.fillStyle = "white";
  ctx.fillText(`Hp : ${playHp}`, 720, 30);

  // hp가 감소할때마다 -5씩 사이즈 감소
  // spaceshipSize -= (initialPlayHp - playHp) * 5;

  // 초기 상태: initialPlayHp = 5, playHp = 5, spaceshipSize = 60
  // playHp가 4로 감소.
  // initialPlayHp(5) - playHp(4) = 1, 따라서 spaceshipSize는 1 * 5 = 5만큼 감소.
  // spaceshipSize = 60 - 5 = 55
  if (playHp < initialPlayHp) {
    spaceshipSize -= (initialPlayHp - playHp) * 5;
    initialPlayHp = playHp; // initialPlayHp를 현재 hp로 업데이트
    // 이렇게 하면 계속 1 * 5가 되니까 사이즈 5씩 감소

    // 반짝거리는 효과 시작
    const blinkingInterval = setInterval(() => {
      visible = !visible; // 보이고 숨기고 반복
    }, 100); // 0.1초마다 반짝가리게 설정

    // 3초 후 반짝거리는 효과 중지
    setTimeout(() => {
      clearInterval(blinkingInterval); // 반짝이 중지
    }, 3000); // 3초 후 중지
  }
  // 최고 점수 기록
  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestScore", highestScore);
  }
  // 게임 종료 로직
  if (playHp <= 0 || score < 0 || point < 0) {
    gameOver = true;
    recentScore = score;
    localStorage.setItem('recentScore', recentScore);
    console.log(gameOver);
    alert('게임이 종료되었습니다. 메인페이지로 이동합니다.');
    window.location.href = '../main/main.html';
  }
}
