const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI / 2;
const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

const randomFactor = () => 0.5 + Math.random() * 0.5;
const radToDeg = (rad: number): number => rad * RAD_TO_DEG;
const degToRad = (deg: number): number => deg * DEG_TO_RAD;

class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  static fromAngle(angle: number, length: number = 1): Vector2 {
    return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
  }

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  mult(n: number): Vector2 {
    return new Vector2(this.x * n, this.y * n);
  }

  div(n: number): Vector2 {
    return new Vector2(this.x / n, this.y / n);
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2 {
    const m = this.mag();
    return m !== 0 ? this.div(m) : new Vector2();
  }

  setMag(len: number): Vector2 {
    return this.normalize().mult(len);
  }

  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}

interface AnimationSettings {
    type: 'radial' | 'linear';
    count: number;
    speed: number;
    length: number;
    color: string;
    initialSize: number;
    middleSize: number;
    endSize: number;
    emitterRadius: number;
    emitterX: number;
    emitterY: number;
    angle: number;
  }
  
  class AnimationElement {
    private pos: Vector2;
    private vel: Vector2;
    private randomizedEmitterRadius: number;
    private speed: number;
    private length: number;
    private sizes: number[];
  
    constructor(private canvas: HTMLCanvasElement, private settings: AnimationSettings, isInitial: boolean = false) {
      this.pos = new Vector2();
      this.vel = new Vector2();
      this.randomizedEmitterRadius = 0;
      this.speed = 0;
      this.length = 0;
      this.sizes = [];
      this.initialize(isInitial);
    }

  initialize(isInitial: boolean = false): void {
    const { type, angle, emitterRadius, emitterX, emitterY, speed, length } = this.settings;

    this.randomizedEmitterRadius = emitterRadius * randomFactor();
    this.speed = speed * randomFactor();
    this.length = length * randomFactor();

    const angleRad = type === 'radial' ? Math.random() * TWO_PI : degToRad(angle);

    if (type === 'radial') {
      const maxDistance = Math.max(this.canvas.width, this.canvas.height);
      const initialDistance = isInitial ? Math.random() : (this.speed >= 0 ? 0 : 1);
      const r = this.randomizedEmitterRadius + initialDistance * maxDistance;
      this.pos = Vector2.fromAngle(angleRad, r).add(this.getEmitterPosition());
      this.vel = Vector2.fromAngle(angleRad, Math.abs(this.speed));
    } else {
      this.pos = new Vector2(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
      this.vel = Vector2.fromAngle(angleRad, this.speed);
    }

    this.sizes = ['initialSize', 'middleSize', 'endSize'].map(size => this.settings[size as keyof AnimationSettings] as number * randomFactor());
  }

  update(): void {
    const { type } = this.settings;
    const emitterPos = this.getEmitterPosition();

    if (type === 'linear') {
      this.pos = this.pos.add(this.vel);
      this.wrapPosition();
    } else {
      const toEmitter = emitterPos.sub(this.pos);
      const distance = toEmitter.mag();

      if (this.speed >= 0) {
        this.pos = this.pos.add(this.vel);
        if (distance > Math.max(this.canvas.width, this.canvas.height) / 2) {
          this.initialize();
        }
      } else {
        this.pos = this.pos.sub(this.vel);
        if (distance <= this.randomizedEmitterRadius) {
          this.initialize();
        }
      }
    }
  }

  private wrapPosition(): void {
    if (this.pos.x < 0) this.pos.x = this.canvas.width;
    if (this.pos.x > this.canvas.width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = this.canvas.height;
    if (this.pos.y > this.canvas.height) this.pos.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const { type, color } = this.settings;
    const emitterPos = this.getEmitterPosition();

    const endPos = type === 'radial'
      ? this.pos.add(this.pos.sub(emitterPos).setMag(this.length))
      : this.pos.sub(this.vel.setMag(this.length));

    const midPos = this.pos.add(endPos).div(2);
    const perpAngle = Math.atan2(endPos.y - this.pos.y, endPos.x - this.pos.x) + HALF_PI;
    const perpVector = Vector2.fromAngle(perpAngle);

    ctx.fillStyle = color;
    ctx.beginPath();

    this.drawHalfLine(ctx, this.pos, midPos, endPos, perpVector, 1);
    this.drawHalfLine(ctx, this.pos, midPos, endPos, perpVector, -1);

    ctx.fill();
  }

  private drawHalfLine(ctx: CanvasRenderingContext2D, startPos: Vector2, midPos: Vector2, endPos: Vector2, perpVector: Vector2, sign: number): void {
    const shift = 0.5;

    ctx.moveTo(
      startPos.x + perpVector.x * this.sizes[0] * sign / 2 - perpVector.x * shift,
      startPos.y + perpVector.y * this.sizes[0] * sign / 2 - perpVector.y * shift
    );
    ctx.lineTo(
      midPos.x + perpVector.x * this.sizes[1] * sign / 2 - perpVector.x * shift,
      midPos.y + perpVector.y * this.sizes[1] * sign / 2 - perpVector.y * shift
    );
    ctx.lineTo(
      endPos.x + perpVector.x * this.sizes[2] * sign / 2 - perpVector.x * shift,
      endPos.y + perpVector.y * this.sizes[2] * sign / 2 - perpVector.y * shift
    );
    ctx.lineTo(
      endPos.x - perpVector.x * shift,
      endPos.y - perpVector.y * shift
    );
    ctx.lineTo(
      startPos.x - perpVector.x * shift,
      startPos.y - perpVector.y * shift
    );
  }

  private getEmitterPosition(): Vector2 {
    const { emitterX, emitterY } = this.settings;
    return new Vector2(this.canvas.width * (emitterX / 100), this.canvas.height * (emitterY / 100));
  }
}

export class AnimationClass {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private settings: AnimationSettings;
    private elements: AnimationElement[];
    private boundAnimate: () => void;
    private animationId: number | null = null;
  
    constructor(canvas: HTMLCanvasElement, settings: Partial<AnimationSettings> = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.settings = {
        type: 'radial',
        count: 50,
        speed: 10,
        length: 500,
        color: '#ffffff',
        initialSize: 1,
        middleSize: 10,
        endSize: 1,
        emitterRadius: 100,
        emitterX: 50,
        emitterY: 50,
        angle: 45,
        ...settings
      };
      this.elements = [];
      this.createElements();
      this.boundAnimate = this.animate.bind(this);
    }
  
    private createElements(): void {
      this.elements = Array.from({ length: this.settings.count }, () => new AnimationElement(this.canvas, this.settings, true));
    }
  
    private animate(): void {
      if (!this.ctx) {
        console.error('Canvas context is not available');
        return;
      }
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.elements.forEach(element => {
        element.update();
        element.draw(this.ctx!);
      });
      this.animationId = requestAnimationFrame(this.boundAnimate);
    }
  
    start(): void {
      if (!this.animationId) {
        if (!this.ctx) {
          this.ctx = this.canvas.getContext('2d');
          if (!this.ctx) {
            console.error('Failed to get canvas context');
            return;
          }
        }
        this.animate();
      }
    }
  
    stop(): void {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  
    updateSettings(newSettings: Partial<AnimationSettings>): void {
      Object.assign(this.settings, newSettings);
      this.createElements();
    }
  
    resize(width: number, height: number): void {
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = this.canvas.getContext('2d');
      this.createElements();
    }
  }