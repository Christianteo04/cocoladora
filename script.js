'use strict';
const $ = (id) => document.getElementById(id);
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const KEY = 'cocoladora-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { /* Continua funcionando sem armazenamento. */ }
if (typeof saved !== 'object' || Array.isArray(saved)) saved = {};
let history = Array.isArray(saved.history) ? saved.history.filter(s => s && Number.isFinite(s.seconds) && s.seconds >= 0 && Number.isFinite(s.money) && s.money >= 0 && Number.isFinite(s.date)).slice(0, 10) : [];
let unlocked = new Set(Array.isArray(saved.badges) ? saved.badges.filter(b => ['junior', 'lord', 'hr'].includes(b)) : []);
let result, animation, toastTimeout;
let session = { elapsed: 0, started: null, rate: 0 };
const amount = (text) => Number(text.replace(/\s/g, '').replace(/R\$/g, '').replace(/\./g, '').replace(',', '.'));
const persist = () => {
  try { localStorage.setItem(KEY, JSON.stringify({ salary: result.salary, hours: result.hours, days: result.days, minutes: result.minutes, theme: document.documentElement.dataset.theme || 'dark', history, badges: [...unlocked] })); } catch { /* Restrições de armazenamento não bloqueiam os cálculos. */ }
};
function notify(message) {
  $('toast').textContent = message; $('toast').hidden = false;
  clearTimeout(toastTimeout); toastTimeout = setTimeout(() => { $('toast').hidden = true; }, 3800);
}
function badges() {
  let count = 0;
  ['junior', 'lord', 'hr'].forEach(name => {
    const open = unlocked.has(name); if (open) count++;
    $('badge-' + name).classList.toggle('locked', !open);
    $('badge-' + name).querySelector('.badge-state').textContent = open ? 'DESBLOQUEADO' : 'BLOQUEADO';
  });
  $('badge-count').textContent = `${count} de 3 conquistas`;
}
function calculate(animate = true) {
  const salary = amount($('salary').value);
  $('salary').setCustomValidity(Number.isFinite(salary) && salary > 0 && salary <= 100000000 ? '' : 'Informe um salário entre R$ 0,01 e R$ 100.000.000,00.');
  if (!$('calculator').reportValidity()) return;
  const hours = Number($('hours').value), days = Number($('days').value), minutes = Number($('minutes').value);
  const previous = result?.monthly || 0;
  // A pausa é parte do salário: não se soma a ele como renda extra.
  const rate = salary / days / hours / 3600;
  const daily = rate * minutes * 60, monthly = daily * days;
  result = { salary, hours, days, minutes, rate, daily, monthly };
  $('daily').textContent = brl.format(daily); $('yearly').textContent = brl.format(monthly * 12);
  $('annual-time').textContent = number.format(minutes * days * 12 / 60 / 24) + ' dias';
  $('paper').textContent = Math.ceil(days * 12 * 20 / 200) + ' rolos';
  cancelAnimationFrame(animation);
  if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const start = performance.now();
    const frame = (now) => { const progress = Math.min(1, (now - start) / 500); $('monthly').textContent = brl.format(previous + (monthly - previous) * (1 - Math.pow(1 - progress, 3))); if (progress < 1) animation = requestAnimationFrame(frame); };
    animation = requestAnimationFrame(frame);
  } else $('monthly').textContent = brl.format(monthly);
  $('calculation-status').textContent = `Calculado: ${brl.format(monthly)} por mês e ${brl.format(monthly * 12)} por ano.`;
  unlocked.add('junior'); if (monthly >= 200) unlocked.add('lord'); badges(); persist();
}
$('calculator').addEventListener('submit', e => { e.preventDefault(); calculate(); });
$('salary').addEventListener('input', () => $('salary').setCustomValidity(''));
$('salary').addEventListener('blur', () => { const n = amount($('salary').value); if (Number.isFinite(n) && n > 0) $('salary').value = n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); });
$('minutes').addEventListener('input', () => { $('minutes-value').textContent = $('minutes').value + ' min'; });
if (Number.isFinite(saved.salary) && saved.salary > 0 && saved.salary <= 100000000) $('salary').value = saved.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
for (const [field, min, max] of [['hours', 1, 24], ['days', 1, 31], ['minutes', 1, 60]]) {
  if (Number.isFinite(saved[field]) && saved[field] >= min && saved[field] <= max && (field === 'hours' ? saved[field] * 2 % 1 === 0 : Number.isInteger(saved[field]))) $(field).value = saved[field];
}
$('minutes-value').textContent = $('minutes').value + ' min';
function theme(value) { document.documentElement.dataset.theme = value; $('theme').textContent = value === 'dark' ? '☀' : '☾'; $('theme').setAttribute('aria-label', value === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'); }
theme(saved.theme === 'light' ? 'light' : 'dark');
$('theme').addEventListener('click', () => { theme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); persist(); });
const seconds = () => session.elapsed + (session.started === null ? 0 : (performance.now() - session.started) / 1000);
function timeText(total) { const s = Math.floor(total); return [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60].map(n => String(n).padStart(2, '0')).join(':'); }
function tick() {
  const duration = seconds(); $('timer').textContent = timeText(duration); $('timer-money').textContent = brl.format(duration * session.rate);
  if (session.started !== null) {
    $('timer-message').textContent = duration >= 1800 ? 'Você agora é sócio da empresa.' : duration >= 900 ? 'As pernas começaram a formigar.' : duration >= 300 ? 'O expediente começou. A ata fica para depois.' : 'Reunião em andamento. A natureza tem a palavra.';
    if (duration >= 1800 && !unlocked.has('hr')) { unlocked.add('hr'); badges(); persist(); notify('Conquista desbloqueada: Inimigo do RH!'); }
  }
}
$('timer-toggle').addEventListener('click', () => {
  if (session.started === null) {
    if (session.elapsed === 0) session.rate = result.rate;
    session.started = performance.now(); $('timer-toggle').textContent = 'Ⅱ Pausar sessão'; $('timer-end').disabled = false;
  } else { session.elapsed = seconds(); session.started = null; $('timer-toggle').textContent = '▶ Retomar sessão'; $('timer-message').textContent = 'Sessão pausada. O contador também merece uma pausa.'; }
  tick();
});
function renderHistory() {
  $('history').replaceChildren();
  if (!history.length) { const li = document.createElement('li'); li.textContent = 'Nenhuma sessão ainda. Seu reinado começa no play.'; $('history').append(li); }
  for (const item of history) { const li = document.createElement('li'); li.textContent = `${new Date(item.date).toLocaleString('pt-BR')} · ${timeText(item.seconds)} · ${brl.format(item.money)}`; $('history').append(li); }
}
$('timer-end').addEventListener('click', () => {
  const duration = seconds(); history.unshift({ seconds: duration, money: duration * session.rate, date: Date.now() }); history = history.slice(0, 10);
  notify(`Sessão salva: ${timeText(duration)} e ${brl.format(duration * session.rate)}.`);
  session = { elapsed: 0, started: null, rate: 0 }; $('timer-toggle').textContent = '▶ Estou no trono'; $('timer-end').disabled = true;
  $('timer-message').textContent = 'Reunião encerrada. Sua sessão ficou no histórico.'; tick(); renderHistory(); persist();
});
setInterval(tick, 250);
function drawCard() {
  const canvas = $('share-card'), c = canvas.getContext('2d');
  c.fillStyle = '#101216'; c.fillRect(0, 0, 1200, 630);
  c.fillStyle = '#ffbd45'; c.fillRect(65, 62, 9, 42);
  c.font = '600 36px Outfit, sans-serif'; c.fillText('cocoladora', 92, 97);
  c.fillStyle = '#a3a7ad'; c.font = '20px Space Grotesk, monospace'; c.fillText('EXTRATO DA PAUSA REMUNERADA', 66, 171);
  c.fillStyle = '#f5f3eb'; c.font = '500 40px Outfit, sans-serif'; c.fillText('Este mês eu ganhei', 66, 245);
  c.fillStyle = '#ffbd45'; let fontSize = 100; const value = brl.format(result.monthly);
  do { c.font = `600 ${fontSize--}px Space Grotesk, monospace`; } while (c.measureText(value).width > 1060 && fontSize > 30);
  c.fillText(value, 60, 365);
  c.fillStyle = '#f5f3eb'; c.font = '500 40px Outfit, sans-serif'; c.fillText('só cagando na empresa!', 66, 432);
  c.strokeStyle = '#353940'; c.setLineDash([6, 7]); c.beginPath(); c.moveTo(66, 483); c.lineTo(1134, 483); c.stroke(); c.setLineDash([]);
  c.fillStyle = '#a3a7ad'; c.font = '23px Outfit, sans-serif'; c.fillText('Faça seu cálculo no cocoladora.', 66, 548);
  c.fillStyle = '#ffbd45'; c.font = '18px Outfit, sans-serif'; c.fillText('O RH não precisa saber.', 912, 548);
}
$('share-open').addEventListener('click', async () => { drawCard(); $('share-dialog').showModal(); $('share-status').textContent = 'Pronto para salvar e compartilhar onde quiser.'; await document.fonts.ready; drawCard(); });
$('share-close').addEventListener('click', () => $('share-dialog').close());
$('share-dialog').addEventListener('click', e => { if (e.target === $('share-dialog')) { const r = e.target.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close(); } });
$('download-card').addEventListener('click', () => {
  $('share-card').toBlob(blob => {
    if (!blob) { $('share-status').textContent = 'Não foi possível gerar o PNG. Tente novamente.'; return; }
    const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'meu-extrato-cocoladora.png'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 10000);
    $('share-status').textContent = 'Card gerado! Confira os downloads do navegador.';
  }, 'image/png');
});
$('copy-link').addEventListener('click', async () => {
  const url = new URL(location.href); url.hash = ''; url.search = '';
  if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || url.protocol === 'file:') { $('share-status').textContent = 'O app está rodando localmente. Baixe o card agora; o link poderá ser compartilhado quando o site for publicado.'; return; }
  try { await navigator.clipboard.writeText(url.href); $('share-status').textContent = 'Link copiado! Pode mandar no grupo.'; }
  catch { $('share-status').textContent = 'Não foi possível copiar automaticamente. Copie o endereço na barra do navegador.'; }
});
calculate(false); renderHistory();
