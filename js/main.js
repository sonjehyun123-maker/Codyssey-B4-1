const GITHUB_USERNAME = 'sonjehyun123-maker';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = document.querySelector('#siteHeader');
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('#navMenu');
const themeToggle = document.querySelector('#themeToggle');
const scrollTopBtn = document.querySelector('#scrollTop');

// 이벤트: 스크롤 → 상태: 헤더 배경 / 탑버튼 노출 → 렌더링 
const handleScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 60);
  scrollTopBtn.classList.toggle('visible', y > 300);
};
window.addEventListener('scroll', handleScroll);
handleScroll();

hamburger.addEventListener('click', () => {
  const isActive = navMenu.classList.toggle('active');
  hamburger.classList.toggle('active', isActive);
  hamburger.setAttribute('aria-expanded', String(isActive));
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

// 이벤트: 테마 토글 클릭 → 상태: data-theme 순환(그린→앰버→라이트) → 렌더링: 전체 색상 전환
const THEME_KEY = 'portfolio-theme';
const THEME_ORDER = ['green', 'light'];
const THEME_LABEL = { green: '[ GRN ]', light: '[ PPR ]' };

const applyTheme = (theme) => {
  if (theme === 'green') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  themeToggle.textContent = THEME_LABEL[theme];
  themeToggle.setAttribute('aria-label', `테마 전환 (현재: ${theme})`);
};

applyTheme(localStorage.getItem(THEME_KEY) || 'green');

themeToggle.addEventListener('click', () => {
  const current = localStorage.getItem(THEME_KEY) || 'green';
  const next = THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

// 스크롤 애니메이션: threshold 0.2
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// 부팅 로그 타이핑 효과
const bootLines = [
  '> booting jaehyun_os v2.6 ...',
  '> loading profile: 재현',
  '> role: CS undergraduate @ 안양대학교',
  '> status: [ONLINE] building things that work_',
];

const typeBootLog = async () => {
  const el = document.querySelector('#bootLog');
  if (prefersReducedMotion) {
    el.innerHTML = bootLines.map((line) => `<span class="done">${line}</span>`).join('<br>');
    return;
  }
  for (const line of bootLines) {
    let shown = '';
    for (const char of line) {
      shown += char;
      el.innerHTML = shown;
      await new Promise((resolve) => setTimeout(resolve, 18));
    }
    el.innerHTML += '<br>';
    el.dataset.log = (el.dataset.log || '') + line + '\n';
  }
};
typeBootLog();

// GitHub API 연동: 로딩 → 성공/에러/빈 상태 → 렌더링
const projectsContainer = document.querySelector('#projectsContainer');

const renderProjectCard = ({ name, description, html_url, stargazers_count, language }) => `
  <article class="project-card">
    <h3>&gt; ${name}</h3>
    <p>${description ?? '설명이 등록되지 않은 저장소입니다.'}</p>
    <div class="project-meta">
      <span>★ ${stargazers_count}</span>
      <span>${language ?? 'N/A'}</span>
      <a href="${html_url}" target="_blank" rel="noopener">open →</a>
    </div>
  </article>
`;

const loadProjects = async () => {
  projectsContainer.innerHTML = '<div class="state-box"><span class="blink-cursor">로딩 중</span></div>';
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const repos = await response.json();
    const { length } = repos;
    if (length === 0) {
      projectsContainer.innerHTML = '<div class="state-box">표시할 프로젝트가 없습니다.</div>';
      return;
    }
    const cards = repos
      .filter(({ fork }) => !fork)
      .map(renderProjectCard)
      .join('');
    projectsContainer.innerHTML = `<div class="projects-grid">${cards}</div>`;
  } catch (error) {
    projectsContainer.innerHTML = `
      <div class="state-box error">
        프로젝트를 불러올 수 없습니다. (${error.message})
        <br><button class="btn retry-btn" id="retryBtn">[ retry ]</button>
      </div>
    `;
    document.querySelector('#retryBtn').addEventListener('click', loadProjects);
  }
};
loadProjects();

// 폼: 입력 → 유효성 상태 → 에러 메시지 표시/숨김
const form = document.querySelector('#contactForm');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setError = (fieldId, message) => {
  document.querySelector(`#${fieldId}Error`).textContent = message;
};

const validateField = (fieldId, value) => {
  if (!value.trim()) {
    setError(fieldId, '# error: 필수 입력 항목입니다.');
    return false;
  }
  if (fieldId === 'email' && !emailPattern.test(value)) {
    setError(fieldId, '# error: 이메일 형식이 올바르지 않습니다.');
    return false;
  }
  setError(fieldId, '');
  return true;
};

['name', 'email', 'message'].forEach((fieldId) => {
  const field = document.querySelector(`#${fieldId}`);
  field.addEventListener('input', () => validateField(fieldId, field.value));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const { name, email, message } = Object.fromEntries(new FormData(form));
  const results = [
    validateField('name', name),
    validateField('email', email),
    validateField('message', message),
  ];
  const successEl = document.querySelector('#formSuccess');
  if (results.every(Boolean)) {
    successEl.textContent = `> message_sent.log ✓  ${name}님, 메시지가 준비됐습니다.`;
    form.reset();
  } else {
    successEl.textContent = '';
  }
});