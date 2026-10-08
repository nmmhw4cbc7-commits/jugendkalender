/* Kalenderansicht im Apple-Kalender-Stil. Wird nach dem Haupt-Script geladen und baut den dritten Tab ein. */
(()=>{
const WK=['M','D','M','D','F','S','S'],WS=['Mo','Di','Mi','Do','Fr','Sa','So'],COL={f:'#ff375f',m:'#0a84ff'};
const P=n=>String(n).padStart(2,'0'),iso=d=>d.getFullYear()+'-'+P(d.getMonth()+1)+'-'+P(d.getDate());
const fromIso=s=>{const a=s.split('-');return new Date(+a[0],a[1]-1,+a[2])};
const addD=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
const addM=(d,n)=>new Date(d.getFullYear(),d.getMonth()+n,1);
const mon=d=>addD(d,-((d.getDay()+6)%7));
const today=()=>{const t=new Date();t.setHours(0,0,0,0);return t};
const same=(a,b)=>iso(a)===iso(b);
const sm=m=>MN[m].length>4?MN[m].slice(0,3)+'.':MN[m];
const full=p=>{const n=names(p);return(n.fn+' '+n.ln).trim()};
/* Es gibt nur weiblich (f) und männlich (m): alles, was nicht weiblich ist, gilt als männlich */
const gen=p=>p.g==='f'?'f':'m';
let view='m',cur=today(),ci=-1;

/* Geburtstage eines Tages (29.2. wird in Nicht-Schaltjahren auf den 28.2. gelegt) */
function evs(d){const y=d.getFullYear(),m=d.getMonth()+1,dd=d.getDate(),o=[];
 data.forEach((p,i)=>{if(p.m!==m)return;const hit=p.d===dd||(p.m===2&&p.d===29&&dd===28&&!leap(y));
  if(hit&&y-p.y>=1)o.push({p,i,age:y-p.y,c:COL[gen(p)]})});
 return o.sort((a,b)=>a.p.n.localeCompare(b.p.n,'de'))}

/* ---------- Styles ---------- */
const st=document.createElement('style');
st.textContent=`nav{width:min(calc(100% - 24px),400px)}
.ind{width:calc((100% - 20px)/3)}
nav[data-t=cal] .ind{transform:translateX(calc(100% + 4px))}
nav[data-t=set] .ind{transform:translateX(calc(200% + 8px))}
nav button{padding:9px 2px}
#vCal{display:flex;flex-direction:column;max-width:560px;padding:16px 10px 96px;height:calc(100vh - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px));height:calc(100dvh - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px))}
.chd{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;padding:0 6px 10px}
.ctt{font-size:1.9rem;font-weight:800;letter-spacing:-.03em;line-height:1.1;min-width:0}
#vCal:not([data-v=m]) .ctt{font-size:1.45rem}
.ctt small{font-size:1rem;font-weight:500;color:var(--mut);margin-left:6px;letter-spacing:0}
.cnv{display:flex;align-items:center;background:var(--card);border-radius:999px;padding:3px;flex:none}
.cnv button{background:none;color:var(--acc);padding:8px 10px;border-radius:999px;font-weight:600}
.cnv .i{width:20px;height:20px}
.cseg{position:relative;display:flex;background:var(--card);border-radius:999px;padding:3px;margin:0 6px 10px;flex:none}
.cseg button{flex:1;position:relative;z-index:1;background:none;color:var(--mut);padding:7px 0;border-radius:999px;font-size:.9rem;transition:color .25s}
.cseg button[aria-pressed=true]{color:var(--ink)}
.cind{position:absolute;top:3px;bottom:3px;left:3px;width:calc((100% - 6px)/3);border-radius:999px;background:var(--soft);transition:transform .35s cubic-bezier(.34,1.3,.5,1)}
.cseg[data-o="1"] .cind{transform:translateX(100%)}
.cseg[data-o="2"] .cind{transform:translateX(200%)}
.cseg{touch-action:none;-webkit-user-select:none;user-select:none}
.cind.drag{transition:none}
#cBody{flex:1;min-height:0;display:flex;flex-direction:column}
.mh{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:.7rem;font-weight:600;padding-bottom:6px;flex:none}
.mh .we{color:var(--mut)}
.mg{flex:1;min-height:0;display:flex;flex-direction:column}
.mw{flex:1 1 0;min-height:0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border-top:1px solid var(--line)}
.mc{display:flex;flex-direction:column;align-items:center;padding:4px 1px 2px;min-width:0;min-height:0;cursor:pointer}
.dn{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.05rem;font-weight:500;flex:none}
.we>.dn,.we .dn{color:var(--mut)}
.dn.td{background:var(--acc);color:var(--on)!important}
.dn.sel:not(.td){background:var(--ink);color:var(--bg)!important}
.ce{flex:1 1 0;min-height:0;width:100%;overflow:hidden;display:flex;flex-direction:column;gap:2px;margin-top:3px}
.chip{display:block;flex:none;width:100%;height:17px;padding:0 4px;border-radius:5px;text-align:left;font-size:.66rem;font-weight:600;line-height:17px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:color-mix(in srgb,var(--c) 24%,transparent);color:color-mix(in srgb,var(--c) 70%,var(--ink))}
.more{flex:none;font-size:.62rem;color:var(--mut);text-align:center;line-height:14px}
.wk,.dv{flex:1;min-height:0;display:flex;flex-direction:column}
.wh{display:flex;flex:none;padding-bottom:4px}
.wd{flex:1;min-width:0;background:none;color:var(--ink);flex-direction:column;gap:4px;padding:4px 0;border-radius:12px;font-weight:400}
.wd small{font-size:.7rem;font-weight:600;color:var(--mut)}
.lst{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 4px}
.dsec{margin-bottom:14px}
.dh{display:block;width:100%;text-align:left;background:none;color:var(--ink);border-radius:0;padding:8px 2px 6px;font-weight:700;font-size:1rem;border-bottom:1px solid var(--line);margin-bottom:8px}
.dh.td{color:var(--acc)}
.dh.we{color:var(--mut)}
.dh.we.td{color:var(--acc)}
.dsec .ev{margin-bottom:6px}
.ev{display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;text-align:left;padding:9px 12px;border-radius:12px;border-left:4px solid var(--c);background:color-mix(in srgb,var(--c) 22%,transparent);color:color-mix(in srgb,var(--c) 70%,var(--ink));font-weight:700}
.ev span{font-weight:500;font-size:.8rem}
.none{color:var(--mut);margin:2px 2px 4px;font-size:.9rem}
#dEv{width:min(calc(100vw - 48px),340px);padding:22px 16px 16px;border-radius:34px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
#dEv::backdrop{background:rgba(0,0,0,.3)}
#dEv[open]{animation:alertIn .4s cubic-bezier(.34,1.3,.5,1)}
.eh{display:flex;gap:12px;align-items:center;margin:0 6px 14px}
.ed{width:6px;align-self:stretch;border-radius:3px;flex:none}
.en{font-size:1.25rem;font-weight:700}
.es{color:var(--mut);font-size:.88rem}
.er{display:flex;justify-content:space-between;gap:12px;padding:11px 6px;border-top:1px solid var(--line)}
.er span{color:var(--mut)}
#dEv .acts{flex-wrap:nowrap;gap:8px;margin-top:16px}
#dEv .acts button{flex:1;height:52px;padding:0 10px;border-radius:999px;font-size:1rem}
#dEv .acts .ghost{background:var(--soft);color:var(--acc)}`;
document.head.appendChild(st);

/* ---------- Markup ---------- */
$('#vSet').insertAdjacentHTML('afterend',`<main id="vCal" hidden data-v="m">
<div class="chd"><div class="ctt" id="cT"></div>
<div class="cnv"><button id="cPrev" aria-label="Zurück"><svg class="i" style="transform:scaleX(-1)"><use href="#i-chev"/></svg></button><button id="cNext" aria-label="Weiter"><svg class="i"><use href="#i-chev"/></svg></button></div></div>
<div class="cseg" data-o="0" role="group" aria-label="Ansicht"><span class="cind" aria-hidden="true"></span><button data-v="m">Monat</button><button data-v="w">Woche</button><button data-v="d">Tag</button></div>
<div id="cBody"></div></main>`);
document.body.insertAdjacentHTML('beforeend',`<dialog id="dEv" aria-label="Geburtstag"><div id="evC"></div>
<div class="acts"><button class="ghost" id="evX">Schließen</button><button class="pri" id="evG">${ic('gift')}Gratulieren</button></div></dialog>`);
const vc=$('#vCal'),cb=$('#cBody');

/* ---------- Ansichten ---------- */
const chip=(x,d)=>`<button class="chip" data-e="${x.i}" data-dt="${iso(d)}" style="--c:${x.c}" aria-label="${esc(full(x.p))}">${esc(names(x.p).fn)}</button>`;
const evb=(x,d)=>`<button class="ev" data-e="${x.i}" data-dt="${iso(d)}" style="--c:${x.c}"><b>${esc(full(x.p))}</b><span>Geburtstag · wird ${x.age}</span></button>`;
const dnum=(d,t,sel)=>`<span class="dn${same(d,t)?' td':''}${sel&&same(d,cur)?' sel':''}">${d.getDate()}</span>`;
function mHTML(){const f=new Date(cur.getFullYear(),cur.getMonth(),1),start=mon(f),t=today(),
  n=Math.ceil((((f.getDay()+6)%7)+new Date(f.getFullYear(),f.getMonth()+1,0).getDate())/7);
 let h='<div class="mh">'+WK.map((w,i)=>`<span class="${i>4?'we':''}">${w}</span>`).join('')+'</div><div class="mg">';
 for(let w=0;w<n;w++){h+='<div class="mw">';
  for(let k=0;k<7;k++){const d=addD(start,w*7+k);
   if(d.getMonth()!==f.getMonth()){h+='<div class="mc"></div>';continue}
   h+=`<div class="mc${k>4?' we':''}" data-day="${iso(d)}">${dnum(d,t)}<div class="ce">${evs(d).map(x=>chip(x,d)).join('')}</div></div>`}
  h+='</div>'}
 return h+'</div>'}
/* Wochenstreifen (nur in der Tagesansicht, zum schnellen Wechseln des Tages) */
function strip(){const s=mon(cur),t=today();let h='<div class="wh">';
 for(let i=0;i<7;i++){const d=addD(s,i);h+=`<button class="wd${i>4?' we':''}" data-day="${iso(d)}"><small>${WS[i]}</small>${dnum(d,t,true)}</button>`}
 return h+'</div>'}
/* Woche: einfache Liste Montag bis Sonntag, darunter jeweils die Geburtstage */
function wHTML(){const s=mon(cur),t=today();let h='<div class="wk"><div class="lst">';
 for(let i=0;i<7;i++){const d=addD(s,i),e=evs(d);
  h+=`<div class="dsec"><button class="dh${i>4?' we':''}${same(d,t)?' td':''}" data-day="${iso(d)}">${WDL[d.getDay()]}, ${d.getDate()}. ${MN[d.getMonth()]}</button>`
   +(e.length?e.map(x=>evb(x,d)).join(''):'<p class="none">Keine Geburtstage</p>')+'</div>'}
 return h+'</div></div>'}
/* Tag: nur die Geburtstage des Tages, keine Uhrzeiten */
function dHTML(){const e=evs(cur);
 return '<div class="dv">'+strip()+`<div class="lst"><div class="dsec"><div class="dh${same(cur,today())?' td':''}">${WDL[cur.getDay()]}, ${cur.getDate()}. ${MN[cur.getMonth()]} ${cur.getFullYear()}</div>`
  +(e.length?e.map(x=>evb(x,cur)).join(''):'<p class="none">Keine Geburtstage</p>')+'</div></div></div>'}

/* Passt so viele Chips in die Zelle, wie Platz ist, Rest als "+n" */
function fit(){cb.querySelectorAll('.ce').forEach(ce=>{ce.querySelectorAll('.more').forEach(m=>m.remove());
 const ch=[...ce.querySelectorAll('.chip')];ch.forEach(c=>c.hidden=false);
 const cap=Math.max(1,Math.floor((ce.clientHeight+2)/19));
 if(ch.length>cap){const keep=cap-1;ch.forEach((c,i)=>c.hidden=i>=keep);ce.insertAdjacentHTML('beforeend',`<span class="more">+${ch.length-keep}</span>`)}})}
function titles(){if(view==='m')return[MN[cur.getMonth()],cur.getFullYear()];
 if(view==='w'){const s=mon(cur),e=addD(s,6);return[s.getDate()+'.'+(s.getMonth()!==e.getMonth()?' '+sm(s.getMonth()):'')+' – '+e.getDate()+'. '+sm(e.getMonth()),e.getFullYear()]}
 return[cur.getDate()+'. '+MN[cur.getMonth()],cur.getFullYear()]}
function renderCal(dir){
 const[t,y]=titles();$('#cT').innerHTML=esc(t)+'<small>'+y+'</small>';
 vc.dataset.v=view;$('.cseg').dataset.o='mwd'.indexOf(view);
 vc.querySelectorAll('.cseg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===view));
 cb.innerHTML=view==='m'?mHTML():view==='w'?wHTML():dHTML();
 if(view==='m')fit();
 if(dir&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&cb.animate)cb.animate([{opacity:0,transform:`translateX(${dir*28}px)`},{opacity:1,transform:'none'}],{duration:260,easing:'ease-out'})}
function step(n){cur=view==='m'?addM(cur,n):addD(cur,n*(view==='w'?7:1));renderCal(n)}
function setView(v){if(v===view)return;const t=today();
 if(view==='m'&&cur.getMonth()===t.getMonth()&&cur.getFullYear()===t.getFullYear())cur=t;
 view=v;renderCal(0)}
$('#cPrev').onclick=()=>step(-1);$('#cNext').onclick=()=>step(1);
vc.querySelectorAll('.cseg button').forEach(b=>b.onclick=()=>setView(b.dataset.v));
addEventListener('resize',()=>{if(!vc.hidden&&view==='m')fit()});

/* Markierung gedrückt halten und zwischen Monat, Woche und Tag ziehen, wo man loslässt, gilt */
(()=>{const sg=$('.cseg'),ind=$('.cind'),bs=[...sg.querySelectorAll('button')],V=['m','w','d'];let s=null,moved=false;
 const stp=()=>ind.offsetWidth,cl=(v,a,b)=>Math.min(b,Math.max(a,v));
 sg.addEventListener('pointerdown',e=>{if(e.button>0)return;const r=ind.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)return;
  const b=V.indexOf(view)*stp();s={x:e.clientX,id:e.pointerId,base:b,tx:b};moved=false});
 sg.addEventListener('pointermove',e=>{if(!s||e.pointerId!==s.id)return;const dx=e.clientX-s.x;
  if(!moved){if(Math.abs(dx)<6)return;moved=true;sg.setPointerCapture(e.pointerId);ind.classList.add('drag')}
  s.tx=cl(s.base+dx,0,2*stp());ind.style.transform=`translateX(${s.tx}px) scale(1.06)`;
  const k=V[Math.round(s.tx/stp())];bs.forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===k))});
 const end=e=>{if(!s||e.pointerId!==s.id)return;const was=moved,tx=s.tx;s=null;if(!was)return;
  ind.classList.remove('drag');void ind.offsetWidth;const v=V[Math.round(tx/stp())];
  if(v===view)renderCal(0);else setView(v);ind.style.transform=''};
 sg.addEventListener('pointerup',end);sg.addEventListener('pointercancel',end)})();

/* Wischen: links = weiter, rechts = zurück */
let tp=null;
cb.addEventListener('touchstart',e=>{tp=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});
cb.addEventListener('touchend',e=>{if(!tp)return;const t=e.changedTouches[0],dx=t.clientX-tp[0],dy=t.clientY-tp[1];tp=null;
 if(Math.abs(dx)>60&&Math.abs(dx)>2*Math.abs(dy))step(dx<0?1:-1)},{passive:true});

/* Antippen: Geburtstag = Popup, Tag = Tagesansicht */
cb.addEventListener('click',e=>{const c=e.target.closest('[data-e]');if(c){openEv(+c.dataset.e,c.dataset.dt);return}
 const d=e.target.closest('[data-day]');if(d){cur=fromIso(d.dataset.day);view='d';renderCal(0)}});
function openEv(i,dt){const p=data[i];if(!p)return;ci=i;const d=fromIso(dt),age=d.getFullYear()-p.y,t=today(),
  c=COL[gen(p)],verb=d<t?'wurde':same(d,t)?'wird heute':'wird';
 $('#evC').innerHTML=`<div class="eh"><span class="ed" style="background:${c}"></span><div><div class="en">${esc(full(p))}</div><div class="es">Geburtstag · ${WDL[d.getDay()]}, ${d.getDate()}. ${MN[d.getMonth()]} ${d.getFullYear()}</div></div></div>
<div class="er"><span>Geburtsdatum</span><b>${p.d}. ${MN[p.m-1]} ${p.y}</b></div>
<div class="er"><span>Alter</span><b>${verb} ${age}</b></div>`;
 $('#dEv').showModal();document.activeElement&&document.activeElement.blur()}
$('#evX').onclick=()=>$('#dEv').close();
$('#evG').onclick=()=>{const i=ci;$('#dEv').close();openG(i)};

/* ---------- Navigation mit drei Tabs ---------- */
const old=$('nav'),nav=old.cloneNode(false);
nav.innerHTML='<span class="ind" aria-hidden="true"></span><button id="nHome" aria-current="page">'+ic('cake')+'Start</button><button id="nCal" aria-current="false">'+ic('cal')+'Kalenderansicht</button><button id="nSet" aria-current="false">'+ic('sliders')+'Einstellungen</button>';
old.replaceWith(nav);
const TABS=['home','cal','set'],vs={home:$('#vHome'),cal:vc,set:$('#vSet')},bt={home:$('#nHome'),cal:$('#nCal'),set:$('#nSet')},ind=$('.ind');
window.show=v=>{for(const k of TABS){vs[k].hidden=k!==v;bt[k].setAttribute('aria-current',k===v?'page':'false')}
 nav.dataset.t=v;if(v==='set')showVer();if(v==='cal')renderCal(0);scrollTo(0,0)};
TABS.forEach(k=>bt[k].onclick=()=>show(k));
/* Markierung gedrückt halten und zwischen den Tabs ziehen */
(()=>{let s=null,moved=false;const stp=()=>ind.offsetWidth+4,cl=(v,a,b)=>Math.min(b,Math.max(a,v));
 nav.addEventListener('pointerdown',e=>{if(e.button>0)return;const r=ind.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)return;
  const b=TABS.indexOf(nav.dataset.t)*stp();s={x:e.clientX,id:e.pointerId,base:b,tx:b};moved=false});
 nav.addEventListener('pointermove',e=>{if(!s||e.pointerId!==s.id)return;const dx=e.clientX-s.x;
  if(!moved){if(Math.abs(dx)<6)return;moved=true;nav.setPointerCapture(e.pointerId);ind.classList.add('drag')}
  s.tx=cl(s.base+dx,0,2*stp());ind.style.transform=`translateX(${s.tx}px) scale(1.07)`;
  const k=TABS[Math.round(s.tx/stp())];TABS.forEach(t=>bt[t].setAttribute('aria-current',t===k?'page':'false'))});
 const end=e=>{if(!s||e.pointerId!==s.id)return;const was=moved,tx=s.tx;s=null;if(!was)return;
  ind.classList.remove('drag');void ind.offsetWidth;show(TABS[Math.round(tx/stp())]);ind.style.transform=''};
 nav.addEventListener('pointerup',end);nav.addEventListener('pointercancel',end)})();

/* Neu zeichnen, wenn die Liste aktualisiert wird */
const r0=window.render;window.render=function(){r0();if(!vc.hidden)renderCal(0)};
})();

/* WhatsApp-Button im Gratulieren-Fenster (neben Telegram), 3 rote oben, 3 graue unten */
(()=>{if($('#gWa'))return;
const css=document.createElement('style');
css.textContent='#dGrat .acts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}#dGrat .acts button{flex-direction:column;gap:4px;padding:12px 4px;font-size:.8rem;border-radius:18px;white-space:nowrap}';
document.head.appendChild(css);
document.body.insertAdjacentHTML('beforeend','<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-wa" viewBox="0 0 24 24"><path d="M3 21l1.65-4.9A9 9 0 1 1 8 19.4z"/><path d="M9 10c0 3 2 5 5 5l1.2-1.4-1.9-1-.8.7c-.9-.4-1.6-1.1-2-2l.7-.8-1-1.9z"/></symbol></svg>');
$('#gTg').insertAdjacentHTML('afterend','<button class="pri" id="gWa">'+ic('wa')+'WhatsApp</button>');
/* Mit Telefonnummer im Telegram-Feld öffnet sich direkt der Chat, sonst die Kontaktauswahl von WhatsApp */
$('#gWa').onclick=()=>{const t=$('#gMsg').value,tg=cur.p.tg.replace(/\s/g,''),n=/^\+?\d{6,}$/.test(tg)?tg.replace(/\D/g,''):'';
 window.open('https://wa.me/'+n+'?text='+encodeURIComponent(t),'_blank','noopener')};
})();

/* Zurücksetzen-Button im gewählten Farbtheme, Telegram-Bot @jugendkalender_bot */
(()=>{const css=document.createElement('style');
css.textContent='.danger{background:var(--acc);color:var(--on)}';
document.head.appendChild(css);
const BOT='jugendkalender_bot';
$('#botYes').onclick=()=>{botOk=true;LS('jk_notif','1');$('#dBot').close();window.open('https://t.me/'+BOT+'?start=geburtstage','_blank','noopener')};
})();
