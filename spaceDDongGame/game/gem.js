// 보석 드롭 관련
class Gem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 48;
  }
  draw(ctx) {
    ctx.drawImage(gemImage, this.x, this.y, this.size, this.size);
  }
}
