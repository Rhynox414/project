// ================================
// Show / Hide Password
// ================================
const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#password');

if (togglePassword && passwordField) {
  togglePassword.addEventListener('click', () => {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
  });
}

// ================================
// PUBG-style Parachute Animation
// ================================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let stars=[], parachutes=[], shootingStars=[], spotlights=[];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ---- Stars ----
  function createStars() {
    stars = [];
    for(let i=0;i<120;i++){
      stars.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*1.5+0.5,
        dx: (Math.random()-0.5)*0.05,
        dy: (Math.random()-0.5)*0.05,
        color: ['#ffffff','#ffe4e1','#aaffff'][Math.floor(Math.random()*3)],
        twinkle: Math.random()*0.03
      });
    }
  }

  // ---- Parachutes ----
  function createParachutes() {
    const colors=["#a855f7","#00eaff","#ff00e5"];
    parachutes=[];
    for(let i=0;i<6;i++){
      parachutes.push({
        x: Math.random()*canvas.width,
        y: -Math.random()*canvas.height,
        width: 30,
        height: 40,
        dy: 0.45 + Math.random()*0.05,
        color: colors[Math.floor(Math.random()*colors.length)],
        swing: Math.random()*2*Math.PI,
        parallax: 0.5 + Math.random()*0.3,
        tilt: 0,
        tiltSpeed: 0.01,
        armSwing: Math.random()*2*Math.PI,
        legFold: 1,
        bodyBob: 0
      });
    }
  }

  // ---- Shooting Stars ----
  function createShootingStars() {
    shootingStars=[];
    for(let i=0;i<5;i++){
      shootingStars.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height/2,
        dx: 4+Math.random()*2,
        dy: 1+Math.random(),
        length: 50+Math.random()*50,
        opacity: Math.random()
      });
    }
  }

  // ---- Spotlights ----
  function createSpotlights() {
    spotlights=[];
    for(let i=0;i<3;i++){
      spotlights.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height/2,
        radius: 150+Math.random()*100,
        dx: 0.1+Math.random()*0.1
      });
    }
  }

  createStars(); createParachutes(); createShootingStars(); createSpotlights();

  // ---- Draw Parachute + Player ----
  function drawParachute(p){
    const swingAmp = 8;
    const offsetX = Math.sin(p.swing)*swingAmp;
    p.swing += 0.015;
    p.tilt += p.tiltSpeed;
    p.armSwing += 0.05;

    const groundY = canvas.height - 20;
    const landingProgress = Math.min(Math.max(p.y / groundY,0),1);
    p.legFold = 1 - landingProgress;

    p.bodyBob = Math.sin(Date.now()/250 + p.x)*1.5*(1-p.legFold);
    const parallaxX = offsetX*p.parallax + Math.sin(p.tilt)*3;

    // canopy
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x + parallaxX, p.y, p.width/2, Math.PI, 2*Math.PI);
    ctx.fill();

    // ropes
    ctx.strokeStyle="#fff";
    ctx.beginPath();
    ctx.moveTo(p.x - p.width/2 + parallaxX, p.y);
    ctx.lineTo(p.x - 5 + parallaxX, p.y + p.height);
    ctx.moveTo(p.x + p.width/2 + parallaxX, p.y);
    ctx.lineTo(p.x + 5 + parallaxX, p.y + p.height);
    ctx.stroke();

    // player head
    const headR=4, bodyH=12, bodyW=6;
    ctx.fillStyle="#ffe0bd";
    ctx.beginPath();
    ctx.arc(p.x + parallaxX, p.y + p.height + headR + p.bodyBob, headR, 0, 2*Math.PI);
    ctx.fill();

    // body
    ctx.fillStyle="#0077be";
    ctx.fillRect(p.x - bodyW/2 + parallaxX, p.y + p.height + headR*2 + p.bodyBob, bodyW, bodyH);

    // arms
    ctx.strokeStyle="#0077be";
    ctx.lineWidth=2;
    const armOffsetY = p.y + p.height + headR*2 + 3 + p.bodyBob;
    const armSwingVal = Math.sin(p.armSwing)*2;
    ctx.beginPath();
    ctx.moveTo(p.x - bodyW/2 + parallaxX, armOffsetY);
    ctx.lineTo(p.x - 5 + parallaxX, p.y + p.height);
    ctx.moveTo(p.x + bodyW/2 + parallaxX, armOffsetY);
    ctx.lineTo(p.x + 5 + parallaxX, p.y + p.height);
    ctx.stroke();

    // legs
    const legLength = 6 + 4*(1 - p.legFold);
    ctx.beginPath();
    ctx.moveTo(p.x - 2 + parallaxX, p.y + p.height + headR*2 + bodyH + p.bodyBob);
    ctx.lineTo(p.x - 2 + parallaxX, p.y + p.height + headR*2 + bodyH + legLength + p.bodyBob);
    ctx.moveTo(p.x + 2 + parallaxX, p.y + p.height + headR*2 + bodyH + p.bodyBob);
    ctx.lineTo(p.x + 2 + parallaxX, p.y + p.height + headR*2 + bodyH + legLength + p.bodyBob);
    ctx.stroke();
  }

  // ---- Shooting Star ----
  function drawShootingStar(s){
    ctx.strokeStyle = `rgba(255,255,255,${s.opacity})`;
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.length, s.y - s.length/4);
    ctx.stroke();

    s.x += s.dx; s.y += s.dy; s.opacity -= 0.01;
    if (s.x>canvas.width || s.y>canvas.height || s.opacity<=0){
      s.x=Math.random()*canvas.width;
      s.y=Math.random()*canvas.height/2;
      s.opacity=Math.random();
      s.length=50+Math.random()*50;
      s.dx=4+Math.random()*2;
      s.dy=1+Math.random();
    }
  }

  // ---- Spotlights ----
  function drawSpotlights(){
    spotlights.forEach(s=>{
      const grad=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.radius);
      grad.addColorStop(0,'rgba(255,255,255,0.1)');
      grad.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=grad;
      ctx.fillRect(0,0,canvas.width,canvas.height);
      s.x += s.dx;
      if(s.x - s.radius>canvas.width) s.x=-s.radius;
    });
  }

  // ---- Animate Everything ----
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawSpotlights();

    stars.forEach(s=>{
      s.x+=s.dx; s.y+=s.dy; s.r+=(Math.random()-0.5)*s.twinkle;
      if(s.r<0.5)s.r=0.5; if(s.r>2)s.r=2;
      if(s.x<0)s.x=canvas.width;
      if(s.x>canvas.width)s.x=0;
      if(s.y<0)s.y=canvas.height;
      if(s.y>canvas.height)s.y=0;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=s.color;
      ctx.fill();
    });

    parachutes.forEach(p=>{
      p.y += p.dy;
      p.x += Math.sin(p.y*0.008)*0.5;
      if(p.y>canvas.height + 50) p.y=-50;
      drawParachute(p);
    });

    shootingStars.forEach(drawShootingStar);
    requestAnimationFrame(animate);
  }

  animate();
}
