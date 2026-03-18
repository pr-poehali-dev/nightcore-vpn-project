import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

/* ─── hooks ──────────────────────────────────────────────────── */
function useTyping(text: string, speed = 40, startDelay = 0) {
  const [out, setOut] = useState("");
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), startDelay); return () => clearTimeout(t); }, [startDelay]);
  useEffect(() => {
    if (!go) return;
    let i = 0; setOut("");
    const iv = setInterval(() => { i++; setOut(text.slice(0, i)); if (i >= text.length) clearInterval(iv); }, speed);
    return () => clearInterval(iv);
  }, [text, speed, go]);
  return out;
}

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

function useScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return scrolled;
}

/* ─── data ───────────────────────────────────────────────────── */
const ADV = [
  { icon: "Shield",     title: "AES-256 шифрование",   desc: "WireGuard протокол нового поколения. Ни один провайдер не видит ваш трафик — от слова совсем." },
  { icon: "Zap",        title: "Скорость без потерь",   desc: "До 10 Гбит/с на сервер. 4K-стриминг, игры без лагов, звонки без обрывов." },
  { icon: "Globe",      title: "40+ стран",              desc: "Серверы в Европе, США, Азии. Меняй локацию за одно касание." },
  { icon: "EyeOff",     title: "Нулевые логи",          desc: "Мы ничего не записываем. Политика No-Log подтверждена независимым аудитом." },
  { icon: "Smartphone", title: "Все устройства",        desc: "iOS, Android, Windows, macOS, Linux. Одна подписка — 5 девайсов одновременно." },
];

const STEPS = [
  { icon: "Download",  title: "Скачай приложение",  desc: "Установка за 30 секунд на любой платформе." },
  { icon: "UserCheck", title: "Анонимный аккаунт",  desc: "Только ID и пароль — никакой почты, номера или паспорта." },
  { icon: "MapPin",    title: "Выбери страну",       desc: "Интерактивная карта серверов. Один тап — новая локация." },
  { icon: "Lock",      title: "Защита активна",      desc: "Зелёный щит горит — ты невидим для провайдера и DPI-фильтров." },
];

const TRUST_STATS = [
  { num: "18 400+", label: "Активных пользователей" },
  { num: "99.97%",  label: "Uptime серверов" },
  { num: "2.1 мс",  label: "Средний пинг в РФ" },
  { num: "0",       label: "Утечек за всё время" },
];

const DONATES = [
  { name: "Alexey K.",  amt: "500 ₽" },
  { name: "Marina V.",  amt: "1 200 ₽" },
  { name: "Dmitry S.",  amt: "300 ₽" },
  { name: "Анонимный",  amt: "2 000 ₽" },
  { name: "Pavel N.",   amt: "750 ₽" },
  { name: "Olga T.",    amt: "450 ₽" },
  { name: "Sergey M.",  amt: "1 500 ₽" },
  { name: "Анонимный",  amt: "100 ₽" },
];

const PLANS = [
  { name: "Базовый",     price: "199 ₽", period: "/ мес", feats: ["1 устройство", "20+ стран", "100 Мбит/с", "Поддержка 24/7"],                         hot: false },
  { name: "Продвинутый", price: "399 ₽", period: "/ мес", feats: ["5 устройств", "40+ стран", "1 Гбит/с", "Приоритетная поддержка", "Kill Switch"],     hot: true  },
];

/* ─── sub-components ─────────────────────────────────────────── */
function Reveal({ children, delay = 0, cls = "" }: { children: React.ReactNode; delay?: number; cls?: string }) {
  const { ref, vis } = useReveal();
  return (
    <div ref={ref} className={cls} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(36px)",
      transition: `opacity .72s ease ${delay}ms, transform .72s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function Card({ children, cls = "", glow = false, onClick }: { children: React.ReactNode; cls?: string; glow?: boolean; onClick?: () => void }) {
  return <div className={`card${glow ? " card-glow" : ""} ${cls}`} onClick={onClick}>{children}</div>;
}

/* floating particles */
function Particles() {
  const pts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    dur: Math.random() * 6 + 6,
    opacity: Math.random() * 0.5 + 0.15,
  }));
  return (
    <div className="particles">
      {pts.map(p => (
        <div key={p.id} className="p" style={{
          width: p.size, height: p.size,
          left: `${p.left}%`, bottom: "0",
          opacity: p.opacity,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.dur}s`,
        }} />
      ))}
    </div>
  );
}

/* shield visual */
function ShieldScene() {
  const beams = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="shield-scene">
      <div className="sh-ring sh-r3" />
      <div className="sh-ring sh-r1">
        <div className="sh-dots">
          {[0,1,2,3,4,5].map(i => <div key={i} className="sh-dot" />)}
        </div>
      </div>
      <div className="sh-ring sh-r2" />
      <div className="sh-ring sh-r4" />
      <div className="sh-core">
        <div className="sh-beams">
          {beams.map(i => (
            <div key={i} className="sh-beam" style={{ transform: `rotate(${i * 45}deg)` }} />
          ))}
        </div>
        <Icon name="Shield" size={72} />
      </div>
    </div>
  );
}

/* ─── main ───────────────────────────────────────────────────── */
export default function Index() {
  const [mob, setMob] = useState(false);
  const [modal, setModal] = useState<null | (typeof PLANS)[0] | "custom">(null);
  const [planIdx, setPlanIdx] = useState(0);
  const [amount, setAmount] = useState("");
  const [progVis, setProgVis] = useState(false);
  const progRef = useRef<HTMLDivElement>(null);
  const scrolled = useScroll();

  const founderTxt = useTyping(
    "Мы строили NightCore, потому что сами устали от слежки. Это не бизнес — это необходимость. Каждый ваш рубль идёт на новые серверы и безопасность.",
    36, 600
  );

  const collected = 184500;
  const goal = 250000;
  const pct = Math.round((collected / goal) * 100);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setProgVis(true); }, { threshold: 0.3 });
    if (progRef.current) obs.observe(progRef.current);
    return () => obs.disconnect();
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  return (
    <div className="nc">
      {/* bg */}
      <div className="orbs">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>
      <div className="grid-bg" />

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="logo">
            <div className="logo-ico"><Icon name="Shield" size={20} /></div>
            <span className="logo-name">NightCore</span>
            <span className="logo-tag">VPN</span>
          </div>
          <div className="nav-links">
            <a href="#adv">Преимущества</a>
            <a href="#how">Как работает</a>
            <a href="#trust">О нас</a>
            <a href="#support">Поддержать</a>
          </div>
          <div className="nav-cta">
            <button className="btn btn-p" onClick={() => setModal(PLANS[1])}>
              <Icon name="Zap" size={15} /> Подключиться
            </button>
          </div>
          <button className="nav-burger" onClick={() => setMob(v => !v)}>
            <Icon name={mob ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </nav>
      <div className={`mob-menu${mob ? " open" : ""}`}>
        {["#adv","#how","#trust","#support"].map((h, i) => (
          <a key={h} href={h} onClick={() => setMob(false)}>
            {["Преимущества","Как работает","О нас","Поддержать"][i]}
          </a>
        ))}
        <button className="btn btn-p btn-full" style={{ marginTop: 8 }} onClick={() => { setModal(PLANS[1]); setMob(false); }}>
          Подключиться
        </button>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <Particles />
        <div className="hero-inner">
          <div className="hero-left">
            <div className="badge">
              <span className="badge-dot" />
              Серверы онлайн · 99.97% uptime
            </div>

            <h1 className="hero-h1" style={{ animation: "fade-up .7s ease both" }}>
              Надёжный VPN,
              <span className="line2">который мы заслужили</span>
            </h1>

            <p className="hero-sub">
              Создан сообществом. Работает на донатах.<br />
              Без корпораций, без рекламы, без слежки.
            </p>

            <div className="hero-stats">
              {[
                { v: "18 400", l: "пользователей" },
                { v: "184 500 ₽", l: "собрано" },
                { v: "40+", l: "стран" },
                { v: "0 логов", l: "политика" },
              ].map(s => (
                <div key={s.l} className="stat-pill">
                  <span className="stat-val">{s.v}</span>
                  <span className="stat-lbl">{s.l}</span>
                </div>
              ))}
            </div>

            <div className="hero-actions">
              <button className="btn btn-p btn-lg" onClick={() => setModal(PLANS[1])}>
                <Icon name="Zap" size={20} /> Начать защиту
              </button>
              <a href="#how" className="btn-ghost">
                Как это работает <Icon name="ArrowDown" size={16} />
              </a>
            </div>
          </div>

          <div className="hero-right">
            <ShieldScene />
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ── */}
      <section id="adv" className="section section-dark">
        <div className="container">
          <Reveal cls="sec-head">
            <span className="sec-tag">Почему NightCore</span>
            <h2 className="sec-title">Технологии на страже свободы</h2>
            <p className="sec-sub">Пять причин выбрать VPN, который создало само сообщество</p>
          </Reveal>
          <div className="adv-grid">
            {ADV.map((a, i) => (
              <Reveal key={a.title} delay={i * 90}>
                <Card cls="adv-card">
                  <div className="adv-ico">
                    <Icon name={a.icon} fallback="Shield" size={28} />
                  </div>
                  <h3 className="adv-title">{a.title}</h3>
                  <p className="adv-desc">{a.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW ── */}
      <section id="how" className="section section-alt">
        <div className="container">
          <Reveal cls="sec-head">
            <span className="sec-tag">Инструкция</span>
            <h2 className="sec-title">Защита за четыре шага</h2>
          </Reveal>
          <div className="steps-wrap">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 110}>
                <div className="step-row">
                  <div className="step-track">
                    <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
                    {i < STEPS.length - 1 && <div className="step-line" />}
                  </div>
                  <Card cls="step-body">
                    <div className="step-ico">
                      <Icon name={s.icon} fallback="Shield" size={22} />
                    </div>
                    <div>
                      <h3 className="step-title">{s.title}</h3>
                      <p className="step-desc">{s.desc}</p>
                    </div>
                  </Card>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section id="trust" className="section section-dark">
        <div className="container">
          <Reveal cls="sec-head">
            <span className="sec-tag">Цифры</span>
            <h2 className="sec-title">Нам доверяют</h2>
          </Reveal>
          <div className="trust-grid">
            {TRUST_STATS.map((t, i) => (
              <Reveal key={t.label} delay={i * 80}>
                <Card glow cls="trust-card">
                  <div className="trust-num">{t.num}</div>
                  <div className="trust-label">{t.label}</div>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal delay={220}>
            <Card cls="founder-card">
              <div className="founder-ava">
                <Icon name="User" size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <p className="founder-quote">
                  «{founderTxt}<span className="cursor">|</span>»
                </p>
                <span className="founder-name">— Основатель NightCore</span>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ── SUPPORT ── */}
      <section id="support" className="section section-alt">
        <div className="container">
          <Reveal cls="sec-head">
            <span className="sec-tag">Поддержать</span>
            <h2 className="sec-title">Помоги проекту жить</h2>
            <p className="sec-sub">Каждый донат — это новый сервер и ещё один свободный пользователь</p>
          </Reveal>

          {/* ticker */}
          <Reveal>
            <div className="ticker-wrap">
              <div className="ticker">
                {[...DONATES, ...DONATES, ...DONATES].map((d, i) => (
                  <span key={i} className="ticker-item">
                    <Icon name="Heart" size={13} className="t-heart" />
                    <strong>{d.name}</strong>&nbsp;задонатил {d.amt}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* progress */}
          <Reveal delay={80}>
            <Card cls="prog-card" glow>
              <div ref={progRef} />
              <div className="prog-meta">
                <span className="prog-left">Собрано: <strong>184 500 ₽</strong></span>
                <span className="prog-right">Цель: 250 000 ₽</span>
              </div>
              <div className="prog-track">
                <div
                  className="prog-bar"
                  style={{ width: progVis ? `${pct}%` : "0%" }}
                />
              </div>
              <span className="prog-pct">{pct}% до цели — спасибо каждому!</span>
            </Card>
          </Reveal>

          {/* plans */}
          <div className="plans-wrap">
            <Reveal delay={100} cls="plan-slider">
              <button className="arrow-btn" onClick={() => setPlanIdx(p => p === 0 ? 1 : 0)}>
                <Icon name="ChevronLeft" size={20} />
              </button>
              <Card glow={PLANS[planIdx].hot} cls="plan-card">
                {PLANS[planIdx].hot && <div className="plan-badge">Популярный</div>}
                <h3 className="plan-name">{PLANS[planIdx].name}</h3>
                <div className="plan-price">{PLANS[planIdx].price}<span className="plan-per"> {PLANS[planIdx].period}</span></div>
                <ul className="plan-feats">
                  {PLANS[planIdx].feats.map(f => (
                    <li key={f}><Icon name="Check" size={15} className="fi" /> {f}</li>
                  ))}
                </ul>
                <button className="btn btn-p btn-full" onClick={() => setModal(PLANS[planIdx])}>
                  Выбрать план
                </button>
              </Card>
              <button className="arrow-btn" onClick={() => setPlanIdx(p => p === 0 ? 1 : 0)}>
                <Icon name="ChevronRight" size={20} />
              </button>
              <div className="plan-dots">
                {PLANS.map((_, i) => (
                  <button key={i} className={`plan-dot${planIdx === i ? " on" : ""}`} onClick={() => setPlanIdx(i)} />
                ))}
              </div>
            </Reveal>

            <Reveal delay={170}>
              <Card cls="custom-card">
                <div className="custom-heart"><Icon name="Heart" size={34} /></div>
                <h3 className="custom-title">Своя сумма</h3>
                <p className="custom-desc">Поддержи на любую сумму — каждый рубль идёт на серверы</p>
                <input
                  className="custom-inp"
                  type="number"
                  placeholder="Сумма в ₽"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
                <button className="btn btn-out btn-full" onClick={() => setModal("custom")}>
                  <Icon name="Heart" size={16} /> Задонатить
                </button>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="logo" style={{ marginBottom: 4 }}>
              <div className="logo-ico"><Icon name="Shield" size={18} /></div>
              <span className="logo-name">NightCore</span>
              <span className="logo-tag">VPN</span>
            </div>
            <p className="footer-tagline">Свобода в сети — наше общее дело</p>
          </div>
          <div className="footer-links">
            <a href="#adv">Преимущества</a>
            <a href="#how">Как работает</a>
            <a href="#trust">О нас</a>
            <a href="#support">Поддержать</a>
          </div>
          <div className="socials">
            <button className="social-btn"><Icon name="Send" size={18} /></button>
            <button className="social-btn"><Icon name="Github" size={18} /></button>
            <button className="social-btn"><Icon name="Twitter" size={18} /></button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 NightCore VPN. Все права защищены.</span>
          <span>Политика конфиденциальности · Условия использования</span>
        </div>
      </footer>

      {/* ── MODAL ── */}
      {modal && (
        <div className="modal-ov" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={closeModal}><Icon name="X" size={20} /></button>
            {modal === "custom" ? (
              <>
                <div className="modal-ico"><Icon name="Heart" size={40} /></div>
                <h2 className="modal-title">Своя сумма</h2>
                <p className="modal-desc">Сумма: <strong style={{ color: "var(--lav-bright)" }}>{amount || "не указана"} ₽</strong></p>
                <p className="modal-desc">Спасибо! Твоя поддержка помогает держать серверы живыми — без рекламы и корпораций.</p>
                <button className="btn btn-p btn-lg btn-full">Перейти к оплате</button>
              </>
            ) : (
              <>
                <div className="modal-ico"><Icon name="Shield" size={40} /></div>
                <h2 className="modal-title">Тариф «{(modal as typeof PLANS[0]).name}»</h2>
                <div className="modal-price">
                  {(modal as typeof PLANS[0]).price}
                  <span> {(modal as typeof PLANS[0]).period}</span>
                </div>
                <ul className="modal-feats">
                  {(modal as typeof PLANS[0]).feats.map(f => (
                    <li key={f}><Icon name="Check" size={15} /> {f}</li>
                  ))}
                </ul>
                <p className="modal-desc">Оплата картой или криптовалютой. После оплаты вы получите анонимный ключ доступа.</p>
                <button className="btn btn-p btn-lg btn-full">Оформить подписку</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
