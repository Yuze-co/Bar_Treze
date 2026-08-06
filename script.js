const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('year').textContent = new Date().getFullYear();
const loader=document.getElementById('loader'),fill=document.getElementById('loaderFill');let progress=0;
const loadTimer=setInterval(()=>{progress+=Math.random()*18;if(progress>=100){progress=100;clearInterval(loadTimer);setTimeout(()=>loader.classList.add('done'),250)}fill.style.width=progress+'%'},120);
const progressLine=document.getElementById('progressLine');function updateProgress(){const h=document.documentElement;const total=h.scrollHeight-h.clientHeight;progressLine.style.width=(total? h.scrollTop/total*100:0)+'%'}window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
const dot=document.getElementById('cursorDot'),ring=document.getElementById('cursorRing');let mx=0,my=0,rx=0,ry=0;
if(!reduceMotion&&window.matchMedia('(hover:hover)').matches){window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});(function animRing(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)})();document.querySelectorAll('a,button,.tilt,input,textarea').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('hover'));el.addEventListener('mouseleave',()=>ring.classList.remove('hover'))});document.querySelectorAll('.magnetic').forEach(btn=>{btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.25}px)`});btn.addEventListener('mouseleave',()=>btn.style.transform='')});document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(700px) rotateX(${y*-8}deg) rotateY(${x*8}deg) translateZ(4px)`});card.addEventListener('mouseleave',()=>card.style.transform='')})}
const navbar=document.getElementById('navbar');window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',scrollY>20),{passive:true});const toggle=document.getElementById('navToggle'),links=document.getElementById('navLinks');toggle.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');toggle.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú')}));
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.15});document.querySelectorAll('.reveal,.reveal-fade').forEach(e=>io.observe(e));const stepIo=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.5});document.querySelectorAll('.step').forEach(e=>stepIo.observe(e));
const countIo=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=parseFloat(el.dataset.count),decimal=+el.dataset.decimal||0,start=performance.now();function tick(now){const p=Math.min((now-start)/1400,1),v=target*(1-(1-p)**3);el.textContent=decimal?v.toFixed(decimal):Math.round(v);if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);countIo.unobserve(el)}),{threshold:.6});document.querySelectorAll('.stat .num').forEach(e=>countIo.observe(e));
const track=document.getElementById('tTrack'),dots=document.getElementById('tDots'),slides=track.children.length;let active=0;function goTo(i){active=i;track.style.transform=`translateX(-${i*100}%)`;[...dots.children].forEach((d,n)=>d.classList.toggle('active',n===i))}for(let i=0;i<slides;i++){const b=document.createElement('button');if(!i)b.classList.add('active');b.addEventListener('click',()=>goTo(i));dots.appendChild(b)}if(!reduceMotion)setInterval(()=>goTo((active+1)%slides),5500);
document.querySelectorAll('.faq-item').forEach(item=>item.querySelector('.faq-q').addEventListener('click',()=>{const open=item.classList.contains('open');document.querySelectorAll('.faq-item.open').forEach(o=>{o.classList.remove('open');o.querySelector('.faq-a').style.maxHeight=null});if(!open){item.classList.add('open');const a=item.querySelector('.faq-a');a.style.maxHeight=a.scrollHeight+'px'}}));
const canvas=document.getElementById('heroCanvas'),ctx=canvas.getContext('2d');let W,H,particles=[],pointer={x:-9999,y:-9999};function resize(){W=canvas.width=canvas.offsetWidth*devicePixelRatio;H=canvas.height=canvas.offsetHeight*devicePixelRatio;particles=Array.from({length:Math.min(70,Math.floor(canvas.offsetWidth/16))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35*devicePixelRatio,vy:(Math.random()-.5)*.35*devicePixelRatio,r:Math.random()*1.6+.6}))}canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();pointer={x:(e.clientX-r.left)*devicePixelRatio,y:(e.clientY-r.top)*devicePixelRatio}});canvas.addEventListener('mouseleave',()=>pointer={x:-9999,y:-9999});function frame(){ctx.clearRect(0,0,W,H);const max=140*devicePixelRatio;for(const p of particles){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){const a=particles[i],b=particles[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<max){ctx.strokeStyle=`rgba(82,183,255,${(1-d/max)*.35})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}for(const p of particles){ctx.fillStyle='rgba(205,238,255,.85)';ctx.beginPath();ctx.arc(p.x,p.y,p.r*devicePixelRatio,0,Math.PI*2);ctx.fill()}requestAnimationFrame(frame)}resize();window.addEventListener('resize',resize);if(!reduceMotion)frame();
document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;if(!f.checkValidity())return f.reportValidity();const d=new FormData(f),s=encodeURIComponent(`Consulta de ${d.get('nombre')}`),b=encodeURIComponent(`Nombre: ${d.get('nombre')}\nEmail: ${d.get('email')}\n\n${d.get('mensaje')}`);document.getElementById('formStatus').textContent='Abriendo tu correo…';location.href=`mailto:yuzeye@gmail.com?subject=${s}&body=${b}`});
// Envío real del formulario y mensaje de éxito, sin abrir el cliente de correo.
document.addEventListener('submit', async (event) => {
  if (event.target.id !== 'contactForm') return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const form = event.target;
  if (!form.checkValidity()) return form.reportValidity();
  const status = document.getElementById('formStatus');
  const button = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  button.disabled = true;
  button.textContent = 'Enviando…';
  status.className = 'form-status';
  status.textContent = 'Enviando tu consulta…';
  try {
    const response = await fetch('https://formsubmit.co/ajax/yuzeye@gmail.com', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({nombre: data.get('nombre'), email: data.get('email'), mensaje: data.get('mensaje'), _subject: 'Nueva consulta desde Nexa Studios', _replyto: data.get('email'), _template: 'table', _captcha: 'false'})
    });
    if (!response.ok) throw new Error('No se pudo enviar');
    form.reset();
    form.classList.add('is-sent');
    status.className = 'form-status success';
    status.textContent = '✓ Listo, nos pondremos en contacto lo más rápido posible.';
  } catch (error) {
    button.disabled = false;
    button.textContent = 'Enviar mensaje';
    status.className = 'form-status error';
    status.textContent = 'No se pudo enviar. Prueba de nuevo en unos minutos.';
  }
}, true);
