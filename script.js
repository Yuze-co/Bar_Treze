document.getElementById('year').textContent = new Date().getFullYear();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- preloader ---------- */
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
let progress = 0;
const loadTimer = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadTimer);
    setTimeout(() => loader.classList.add('done'), 250);
  }
  loaderFill.style.width = progress + '%';
}, 120);

/* ---------- scroll progress bar ---------- */
const progressLine = document.getElementById('progressLine');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressLine.style.width = scrolled + '%';
}
window.addEventListener('scroll', updateProgress);
updateProgress();

/* ---------- custom cursor ---------- */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
window.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  dot.style.left=mx+'px'; dot.style.top=my+'px';
});
function animRing(){
  rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a,button,.tilt,input,textarea').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
});

/* ---------- magnetic buttons ---------- */
document.querySelectorAll('.magnetic').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*0.28}px, ${y*0.35}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform = 'translate(0,0)'; });
});

/* ---------- navbar scroll state + mobile toggle ---------- */
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled', window.scrollY>20);
});
const navToggle=document.getElementById('navToggle');
const navLinks=document.getElementById('navLinks');
navToggle.addEventListener('click',()=>navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

/* ---------- reveal on scroll ---------- */
const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in'); });
},{threshold:0.15});
document.querySelectorAll('.reveal,.reveal-fade').forEach(el=>io.observe(el));

/* ---------- timeline step activation ---------- */
const stepIo=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in'); });
},{threshold:0.5});
document.querySelectorAll('.step').forEach(el=>stepIo.observe(el));

/* ---------- 3D tilt cards ---------- */
document.querySelectorAll('.tilt').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r=card.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-0.5;
    const py=(e.clientY-r.top)/r.height-0.5;
    card.style.transform=`perspective(700px) rotateX(${py*-8}deg) rotateY(${px*8}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave',()=>{ card.style.transform='perspective(700px) rotateX(0) rotateY(0)'; });
});

/* ---------- animated counters ---------- */
const counters=document.querySelectorAll('.stat .num');
const countIo=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      const el=en.target;
      const target=parseFloat(el.dataset.count);
      const decimal=parseInt(el.dataset.decimal||0);
      const dur=1400; const start=performance.now();
      function tick(now){
        const p=Math.min((now-start)/dur,1);
        const eased=1-Math.pow(1-p,3);
        const val=target*eased;
        el.textContent = decimal ? val.toFixed(decimal) : Math.round(val);
        if(p<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countIo.unobserve(el);
    }
  });
},{threshold:0.6});
counters.forEach(c=>countIo.observe(c));

/* ---------- testimonial slider ---------- */
const track=document.getElementById('tTrack');
const slides=track.children.length;
const dotsWrap=document.getElementById('tDots');
let active=0;
for(let i=0;i<slides;i++){
  const b=document.createElement('button');
  if(i===0) b.classList.add('active');
  b.addEventListener('click',()=>goTo(i));
  dotsWrap.appendChild(b);
}
function goTo(i){
  active=i;
  track.style.transform=`translateX(-${i*100}%)`;
  [...dotsWrap.children].forEach((d,idx)=>d.classList.toggle('active', idx===i));
}
let tInterval = setInterval(()=>{ goTo((active+1)%slides); }, 5500);

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.faq-item').forEach(item=>{
  const q=item.querySelector('.faq-q');
  const a=item.querySelector('.faq-a');
  q.addEventListener('click',()=>{
    const isOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o=>{o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight=null;});
    if(!isOpen){ item.classList.add('open'); a.style.maxHeight=a.scrollHeight+'px'; }
  });
});

/* ---------- hero canvas: nexus particle network ---------- */
const canvas=document.getElementById('heroCanvas');
const ctx=canvas.getContext('2d');
let W,H,particles=[];
function resize(){
  W=canvas.width=canvas.offsetWidth*devicePixelRatio;
  H=canvas.height=canvas.offsetHeight*devicePixelRatio;
}
function initParticles(){
  const count = Math.min(70, Math.floor(canvas.offsetWidth/16));
  particles=[];
  for(let i=0;i<count;i++){
    particles.push({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-0.5)*0.35*devicePixelRatio, vy:(Math.random()-0.5)*0.35*devicePixelRatio,
      r:Math.random()*1.6+0.6
    });
  }
}
let pointer={x:-9999,y:-9999};
canvas.addEventListener('mousemove', e=>{
  const rect=canvas.getBoundingClientRect();
  pointer.x=(e.clientX-rect.left)*devicePixelRatio;
  pointer.y=(e.clientY-rect.top)*devicePixelRatio;
});
canvas.addEventListener('mouseleave',()=>{pointer.x=-9999;pointer.y=-9999;});

function frame(){
  ctx.clearRect(0,0,W,H);
  const maxDist=140*devicePixelRatio;
  for(const p of particles){
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>W) p.vx*=-1;
    if(p.y<0||p.y>H) p.vy*=-1;
    const dx=p.x-pointer.x, dy=p.y-pointer.y, d=Math.hypot(dx,dy);
    if(d<160*devicePixelRatio){
      const f=(160*devicePixelRatio-d)/(160*devicePixelRatio)*0.6;
      p.x+=dx/d*f; p.y+=dy/d*f;
    }
  }
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i], b=particles[j];
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<maxDist){
        const op=(1-d/maxDist)*0.35;
        ctx.strokeStyle=`rgba(120,150,255,${op})`;
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  for(const p of particles){
    ctx.beginPath();
    ctx.fillStyle='rgba(200,215,255,0.85)';
    ctx.arc(p.x,p.y,p.r*devicePixelRatio,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(frame);
}
resize(); initParticles();
window.addEventListener('resize',()=>{resize(); initParticles();});
frame();
