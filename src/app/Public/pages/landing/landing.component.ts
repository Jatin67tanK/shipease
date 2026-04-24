import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector:    'app-landing',
  templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('heroCard') heroCardRef!: ElementRef<HTMLDivElement>;
  @ViewChild('bgCanvas') bgCanvasRef!: ElementRef<HTMLCanvasElement>;

  scrolled = false;

  features = [
    { icon: 'fa-bolt', title: 'Fast Booking',       desc: 'Book your shipment in seconds. No paperwork, just digital speed.' },
    { icon: 'fa-box-open', title: 'Real-Time Tracking', desc: 'Track your package live with accurate delivery updates at every step.' },
    { icon: 'fa-lock', title: 'Secure Payments',    desc: 'Safe, encrypted transactions. We protect your data and your cargo.' },
  ];

  private animFrame = 0;
  private mouse     = { x: -9999, y: -9999 };

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initCanvas();
    window.addEventListener('scroll', this.onScroll);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrame);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('scroll',    this.onScroll);
  }

  goToLogin():    void { this.router.navigate(['/login']);    }
  goToRegister(): void { this.router.navigate(['/register']); }
  goToTrack():    void { this.router.navigate(['/track']);    }

  handleBookParcel(): void {
    this.authService.isLoggedIn()
      ? this.router.navigate(['/customer/book'])
      : this.router.navigate(['/login']);
  }

  goToTrackWithId(id: string): void {
    const value = (id ?? '').trim();
    value
      ? this.router.navigate(['/track'], { queryParams: { trackingId: value } })
      : this.router.navigate(['/track']);
  }

  tiltCard(e: MouseEvent): void {
    const card = this.heroCardRef?.nativeElement; if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.transform = `rotateX(${-((e.clientY-r.top-r.height/2)/28)}deg) rotateY(${((e.clientX-r.left-r.width/2)/28)}deg) scale(1.02)`;
  }

  resetCard(): void {
    const card = this.heroCardRef?.nativeElement;
    if (card) card.style.transform = 'rotateY(-8deg) rotateX(4deg)';
  }

  tiltFeature(e: MouseEvent): void {
    const card = e.currentTarget as HTMLElement, r = card.getBoundingClientRect();
    card.style.transform = `translateY(-8px) rotateX(${-(((e.clientY-r.top)/r.height)-.5)*10}deg) rotateY(${(((e.clientX-r.left)/r.width)-.5)*10}deg)`;
  }

  resetFeature(e: MouseEvent): void { (e.currentTarget as HTMLElement).style.transform = ''; }

  private onScroll    = () => { this.scrolled = window.scrollY > 20; };
  private onMouseMove = (e: MouseEvent) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; };

  private initCanvas(): void {
    const canvas = this.bgCanvasRef?.nativeElement; if (!canvas) return;
    const ctx = canvas.getContext('2d')!; let W=0,H=0;
    const resize=()=>{ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; };
    resize(); window.addEventListener('resize',resize); window.addEventListener('mousemove',this.onMouseMove);
    class Pt{x=0;y=0;vx=0;vy=0;r=0;alpha=0;c='';constructor(){this.reset(true);}
      reset(i:boolean){this.x=Math.random()*W;this.y=i?Math.random()*H:(Math.random()>.5?-10:H+10);this.vx=(Math.random()-.5)*.55;this.vy=(Math.random()-.5)*.45;this.r=Math.random()*2.2+.8;this.alpha=Math.random()*.45+.18;this.c=Math.random()>.55?'34,197,94':'134,239,172';}
      update(mx:number,my:number){this.x+=this.vx;this.y+=this.vy;if(this.x<-10||this.x>W+10||this.y<-10||this.y>H+10)this.reset(false);const dx=this.x-mx,dy=this.y-my,d=Math.hypot(dx,dy);if(d<110){this.x+=dx/d*1.8;this.y+=dy/d*1.8;}}
      draw(c:CanvasRenderingContext2D){c.beginPath();c.arc(this.x,this.y,this.r,0,Math.PI*2);c.fillStyle=`rgba(${this.c},${this.alpha})`;c.fill();}}
    class Box3D{x:number;y:number;s:number;vx:number;vy:number;rot:number;vr:number;a:number;
      constructor(){this.x=Math.random()*W;this.y=Math.random()*H;this.s=Math.random()*28+14;this.vx=(Math.random()-.5)*.4;this.vy=(Math.random()-.5)*.35;this.rot=Math.random()*Math.PI*2;this.vr=(Math.random()-.5)*.009;this.a=Math.random()*.14+.05;}
      update(){this.x+=this.vx;this.y+=this.vy;this.rot+=this.vr;if(this.x<-60)this.x=W+60;if(this.x>W+60)this.x=-60;if(this.y<-60)this.y=H+60;if(this.y>H+60)this.y=-60;}
      draw(c:CanvasRenderingContext2D){const{x,y,s,rot,a}=this,h2=s*.5,o=s*.26;c.save();c.translate(x,y);c.rotate(rot);c.strokeStyle=`rgba(34,197,94,${a*2.8})`;c.lineWidth=1;c.fillStyle=`rgba(34,197,94,${a*1.5})`;c.beginPath();c.moveTo(0,-h2);c.lineTo(o,-h2+o*.55);c.lineTo(0,-h2+o*1.1);c.lineTo(-o,-h2+o*.55);c.closePath();c.fill();c.stroke();c.fillStyle=`rgba(34,197,94,${a})`;c.beginPath();c.moveTo(-o,-h2+o*.55);c.lineTo(0,-h2+o*1.1);c.lineTo(0,h2);c.lineTo(-o,h2-o*.55);c.closePath();c.fill();c.stroke();c.fillStyle=`rgba(22,163,74,${a*1.2})`;c.beginPath();c.moveTo(o,-h2+o*.55);c.lineTo(0,-h2+o*1.1);c.lineTo(0,h2);c.lineTo(o,h2-o*.55);c.closePath();c.fill();c.stroke();c.restore();}}
    const pts=Array.from({length:130},()=>new Pt()),boxes=Array.from({length:12},()=>new Box3D());
    const draw=()=>{ctx.clearRect(0,0,W,H);const{x:mx,y:my}=this.mouse;
      for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.hypot(dx,dy);if(d<115){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(34,197,94,${(1-d/115)*.16})`;ctx.lineWidth=.7;ctx.stroke();}}const md=Math.hypot(pts[i].x-mx,pts[i].y-my);if(md<150){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(mx,my);ctx.strokeStyle=`rgba(34,197,94,${(1-md/150)*.38})`;ctx.lineWidth=1;ctx.stroke();}}
      pts.forEach(p=>{p.update(mx,my);p.draw(ctx);});boxes.forEach(b=>{b.update();b.draw(ctx);});this.animFrame=requestAnimationFrame(draw);};
    draw();
  }
}
