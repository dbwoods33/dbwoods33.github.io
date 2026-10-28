const progressBar = document.querySelector('#progressBar');
const copyButton = document.querySelector('#copyLink');
const printButton = document.querySelector('#printPage');
const toast = document.querySelector('#toast');
const article = document.querySelector('#essay');
let ticking = false;
let toastTimer;

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateProgress);
    ticking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2400);
}

async function copyArticleLink() {
  const url = window.location.href;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
    } else {
      const field = document.createElement('textarea');
      field.value = url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      if (!copied) throw new Error('Copy command was unavailable');
    }
    showToast('Article link copied.');
  } catch {
    showToast('Copy was unavailable. Please copy the address from your browser.');
  }
}

copyButton.addEventListener('click', copyArticleLink);
printButton.addEventListener('click', () => window.print());

const meta = document.querySelector('.meta');
if (meta && ![...meta.children].some((item) => item.textContent.trim() === 'By Dave Lim')) {
  const byline = document.createElement('span');
  byline.textContent = 'By Dave Lim';
  meta.prepend(byline);
}

const wordCount = article.innerText.trim().split(/\s+/).filter(Boolean).length;
const minutes = Math.max(1, Math.round(wordCount / 220));
document.querySelector('.meta span:last-child').textContent = `${minutes}-minute read`;
document.documentElement.dataset.wordCount = String(wordCount);

// Field Notes enhancements: hero figure draw-in, scroll reveal, stat count-up
document.body.classList.add("js");
const prefersReduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll(".hp-draw").forEach(p=>{try{const L=p.getTotalLength();p.style.setProperty("--len",L);if(prefersReduced){p.style.animation="none";p.style.strokeDasharray="none";p.style.strokeDashoffset="0"}}catch(e){}});
if(prefersReduced){document.querySelectorAll(".hp-fade").forEach(el=>{el.style.animation="none";el.style.opacity="1"});document.querySelectorAll(".js .hero .issue,.hero .issue,.hero h1,.hero .deck,.hero .meta,.hero-art").forEach(el=>{el.style.animation="none";el.style.opacity="1"})}
const revealTargets=document.querySelectorAll(".thesis,.section,.about-card,.stats,.notes-inner");
revealTargets.forEach(el=>el.classList.add("reveal"));
if("IntersectionObserver" in window&&!prefersReduced){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12,rootMargin:"0px 0px -40px 0px"});revealTargets.forEach(el=>io.observe(el))}else{revealTargets.forEach(el=>el.classList.add("in"))}
function countUp(el){const target=+el.dataset.target,t0=performance.now(),dur=1400;function f(t){const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=Math.round(target*e).toLocaleString("en-US");if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
const statVals=document.querySelectorAll(".stat-val");
if(statVals.length){if("IntersectionObserver" in window&&!prefersReduced){statVals.forEach(el=>el.textContent="0");const so=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){so.unobserve(e.target);countUp(e.target)}})},{threshold:.4});statVals.forEach(el=>so.observe(el))}else{statVals.forEach(el=>el.textContent=(+el.dataset.target).toLocaleString("en-US"))}}

// Theme toggle
const themeBtn=document.getElementById("themeToggle"),rootEl=document.documentElement;
function setThemeLabel(){themeBtn&&(themeBtn.textContent=rootEl.classList.contains("dark")?"Light":"Dark")}
try{const savedTheme=localStorage.getItem("fn-theme");if(savedTheme==="dark"||(!savedTheme&&window.matchMedia("(prefers-color-scheme: dark)").matches))rootEl.classList.add("dark")}catch(e){}
setThemeLabel();
themeBtn?.addEventListener("click",()=>{rootEl.classList.toggle("dark");try{localStorage.setItem("fn-theme",rootEl.classList.contains("dark")?"dark":"light")}catch(e){}setThemeLabel()});