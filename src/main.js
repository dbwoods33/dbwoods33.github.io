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
