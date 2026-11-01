(()=>{
const root=document.documentElement,tb=document.getElementById('themeToggle');
if(tb){const isDark=()=>root.classList.contains('dark')||(!root.classList.contains('light')&&matchMedia('(prefers-color-scheme: dark)').matches);
const lbl=()=>{tb.textContent=isDark()?'Light':'Dark'};lbl();
tb.addEventListener('click',()=>{const d=!isDark();root.classList.toggle('dark',d);root.classList.toggle('light',!d);try{localStorage.setItem('fn-theme',d?'dark':'light')}catch(e){}lbl()});}
const toc=document.querySelector('.toc details');if(!toc)return;
const mq=matchMedia('(max-width:1040px)');const sync=()=>{toc.open=!mq.matches};sync();mq.addEventListener&&mq.addEventListener('change',sync);
toc.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(mq.matches)toc.open=false}));
const links=[...toc.querySelectorAll('a')],map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.remove('on'));const a=map.get(e.target.id);a&&a.classList.add('on')}})},{rootMargin:'0px 0px -70% 0px'});
map.forEach((a,id)=>{const el=document.getElementById(id);el&&io.observe(el)});}
})();
