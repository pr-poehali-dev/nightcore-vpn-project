import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

// ─── Typing Effect Hook ───────────────────────────────────────────────────────
function useTyping(text: string, speed = 45, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);
  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed("");
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, started]);
  return displayed;
}

// ─── Intersection Observer Hook ──────────────────────────────────────────────
function useVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const ADVANTAGES = [
  { icon: "Shield", title: "Военное шифрование", desc: "AES-256 + WireGuard протокол. Ни один провайдер не видит ваш трафик." },
  { icon: "Zap", title: "Скорость без потерь", desc: "До 10 Гбит/с на сервер. Смотри 4K без буферизации." },
  { icon: "Globe", title: "40+ стран", desc: "Серверы в Европе, США, Азии. Меняй локацию в один клик." },
  { icon: "EyeOff", title: "Нет логов", desc: "Политика полного отсутствия журналов. Данные не хранятся." },
  { icon: "Smartphone", title: "Все устройства", desc: "iOS, Android, Windows, macOS, Linux. Одна подписка — 5 устройств." },
];

const STEPS = [
  { icon: "Download", title: "Установи приложение", desc: "Скачай NightCore для своей платформы — установка займёт 30 секунд." },
  { icon: "UserCheck", title: "Создай аккаунт", desc: "Регистрация без почты. Только анонимный ID и пароль." },
  { icon: "MapPin", title: "Выбери сервер", desc: "Карта серверов. Один тап — и ты уже в нужной стране." },
  { icon: "Wifi", title: "Ты защищён", desc: "Зелёный щит — соединение активно. Серфи без ограничений." },
];

const TRUST = [
  { num: "18 400+", label: "Активных пользователей" },
  { num: "99.97%", label: "Uptime серверов" },
  { num: "2.1 мс", label: "Средний пинг в РФ" },
  { num: "0 утечек", label: "За всё время работы" },
];

const DONATES = [
  { name: "Alexey K.", amount: "500 ₽" },
  { name: "Marina V.", amount: "1 200 ₽" },
  { name: "Dmitry S.", amount: "300 ₽" },
  { name: "Анонимный", amount: "2 000 ₽" },
  { name: "Pavel N.", amount: "750 ₽" },
  { name: "Olga T.", amount: "450 ₽" },
  { name: "Sergey M.", amount: "1 500 ₽" },
  { name: "Анонимный", amount: "100 ₽" },
];

const PLANS = [
  {
    name: "Базовый",
    price: "199 ₽",
    period: "в месяц",
    features: ["1 устройство", "20+ стран", "100 Мбит/с", "Поддержка 24/7"],
    accent: false,
  },
  {
    name: "Продвинутый",
    price: "399 ₽",
    period: "в месяц",
    features: ["5 устройств", "40+ стран", "1 Гбит/с", "Приоритетная поддержка", "Kill Switch"],
    accent: true,
  },
];

// ─── Glass Card ───────────────────────────────────────────────────────────────
function GlassCard({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`glass-card${glow ? " glow-card" : ""} ${className}`}>
      {children}
    </div>
  );
}

// ─── Section Reveal ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useVisible();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState<null | (typeof PLANS)[0] | "custom">(null);
  const [planIndex, setPlanIndex] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const founderText = useTyping(
    "Мы строили NightCore, потому что сами устали от слежки. Это не бизнес — это необходимость. Каждый рубль вашего доната идёт на новые серверы и безопасность.",
    38,
    400
  );

  const totalCollected = 184500;
  const goal = 250000;
  const progress = Math.round((totalCollected / goal) * 100);

  return (
    <div className="nightcore-root">
      {/* ── NAV ── */}
      <nav className="nc-nav">
        <div className="nc-nav-inner">
          <div className="nc-logo">
            <span className="nc-logo-icon">
              <Icon name="Shield" size={22} />
            </span>
            <span className="nc-logo-text">NightCore</span>
            <span className="nc-logo-vpn">VPN</span>
          </div>
          <div className={`nc-menu ${menuOpen ? "open" : ""}`}>
            <a href="#advantages">Преимущества</a>
            <a href="#how">Как работает</a>
            <a href="#trust">О нас</a>
            <a href="#support">Поддержать</a>
          </div>
          <button className="nc-btn-primary" onClick={() => setModalPlan(PLANS[1])}>
            Подключиться
          </button>
          <button className="nc-burger" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="nc-hero">
        <div className="nc-hero-bg">
          <div className="nc-orb nc-orb-1" />
          <div className="nc-orb nc-orb-2" />
          <div className="nc-orb nc-orb-3" />
          <div className="nc-grid-lines" />
        </div>
        <div className="nc-hero-content">
          <div className="nc-badge">
            <span className="nc-badge-dot" />
            Серверы онлайн · 99.97% uptime
          </div>
          <h1 className="nc-hero-title">
            Надёжный VPN,<br />
            <span className="nc-accent">который мы заслужили</span>
          </h1>
          <p className="nc-hero-sub">
            Создан сообществом. Поддерживается донатами. Без корпораций и слежки.
          </p>
          <div className="nc-hero-stats">
            {[
              { val: "18 400", label: "пользователей" },
              { val: "184 500 ₽", label: "собрано донатов" },
              { val: "40+", label: "стран" },
            ].map((s) => (
              <div key={s.label} className="nc-stat-card">
                <span className="nc-stat-val">{s.val}</span>
                <span className="nc-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="nc-hero-actions">
            <button className="nc-btn-primary nc-btn-lg" onClick={() => setModalPlan(PLANS[1])}>
              <Icon name="Zap" size={18} />
              Начать защиту
            </button>
            <a href="#how" className="nc-btn-ghost">
              Как это работает
              <Icon name="ArrowDown" size={16} />
            </a>
          </div>
        </div>
        <div className="nc-hero-visual">
          <div className="nc-shield-wrap">
            <div className="nc-shield-ring nc-ring-1" />
            <div className="nc-shield-ring nc-ring-2" />
            <div className="nc-shield-ring nc-ring-3" />
            <div className="nc-shield-core">
              <Icon name="Shield" size={64} />
            </div>
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ── */}
      <section id="advantages" className="nc-section">
        <div className="nc-container">
          <Reveal className="nc-section-header">
            <span className="nc-section-tag">Почему NightCore</span>
            <h2 className="nc-section-title">5 причин доверять нам</h2>
          </Reveal>
          <div className="nc-cards-5">
            {ADVANTAGES.map((a, i) => (
              <Reveal key={a.title} delay={i * 80}>
                <GlassCard className="nc-adv-card">
                  <div className="nc-adv-icon">
                    <Icon name={a.icon} fallback="Shield" size={26} />
                  </div>
                  <h3 className="nc-adv-title">{a.title}</h3>
                  <p className="nc-adv-desc">{a.desc}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="nc-section nc-section-alt">
        <div className="nc-container">
          <Reveal className="nc-section-header">
            <span className="nc-section-tag">Инструкция</span>
            <h2 className="nc-section-title">Четыре шага до защиты</h2>
          </Reveal>
          <div className="nc-steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="nc-step">
                  <div className="nc-step-left">
                    <div className="nc-step-num">{String(i + 1).padStart(2, "0")}</div>
                    {i < STEPS.length - 1 && <div className="nc-step-line" />}
                  </div>
                  <GlassCard className="nc-step-card">
                    <div className="nc-step-icon">
                      <Icon name={s.icon} fallback="Shield" size={22} />
                    </div>
                    <div>
                      <h3 className="nc-step-title">{s.title}</h3>
                      <p className="nc-step-desc">{s.desc}</p>
                    </div>
                  </GlassCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section id="trust" className="nc-section">
        <div className="nc-container">
          <Reveal className="nc-section-header">
            <span className="nc-section-tag">Цифры</span>
            <h2 className="nc-section-title">Нам доверяют</h2>
          </Reveal>
          <div className="nc-trust-grid">
            {TRUST.map((t, i) => (
              <Reveal key={t.label} delay={i * 70}>
                <GlassCard glow className="nc-trust-card">
                  <span className="nc-trust-num">{t.num}</span>
                  <span className="nc-trust-label">{t.label}</span>
                </GlassCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <GlassCard className="nc-founder-card">
              <div className="nc-founder-avatar">
                <Icon name="User" size={28} />
              </div>
              <div className="nc-founder-text">
                <p className="nc-founder-quote">
                  «{founderText}<span className="nc-cursor">|</span>»
                </p>
                <span className="nc-founder-name">— Основатель NightCore</span>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ── SUPPORT ── */}
      <section id="support" className="nc-section nc-section-alt">
        <div className="nc-container">
          <Reveal className="nc-section-header">
            <span className="nc-section-tag">Поддержка</span>
            <h2 className="nc-section-title">Помоги проекту жить</h2>
            <p className="nc-section-sub">Каждый донат — это новый сервер и ещё один свободный пользователь</p>
          </Reveal>

          {/* Бегущая строка */}
          <Reveal>
            <div className="nc-ticker-wrap">
              <div className="nc-ticker">
                {[...DONATES, ...DONATES, ...DONATES].map((d, i) => (
                  <span key={i} className="nc-ticker-item">
                    <Icon name="Heart" size={13} />
                    <strong>{d.name}</strong>&nbsp;задонатил {d.amount}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Прогресс-бар */}
          <Reveal delay={100}>
            <GlassCard className="nc-progress-card">
              <div className="nc-progress-header">
                <span className="nc-progress-collected">Собрано: <strong>184 500 ₽</strong></span>
                <span className="nc-progress-goal">Цель: 250 000 ₽</span>
              </div>
              <div className="nc-progress-bar-wrap">
                <div className="nc-progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <span className="nc-progress-pct">{progress}% до цели</span>
            </GlassCard>
          </Reveal>

          {/* Тарифы */}
          <div className="nc-plans-wrap">
            <Reveal delay={100} className="nc-plans-slider">
              <button
                className="nc-arrow-btn"
                onClick={() => setPlanIndex((p) => (p === 0 ? 1 : 0))}
                aria-label="Предыдущий тариф"
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              <GlassCard glow={PLANS[planIndex].accent} className={`nc-plan-card${PLANS[planIndex].accent ? " nc-plan-accent" : ""}`}>
                {PLANS[planIndex].accent && <div className="nc-plan-badge">Популярный</div>}
                <h3 className="nc-plan-name">{PLANS[planIndex].name}</h3>
                <div className="nc-plan-price">
                  {PLANS[planIndex].price}
                  <span className="nc-plan-period"> {PLANS[planIndex].period}</span>
                </div>
                <ul className="nc-plan-features">
                  {PLANS[planIndex].features.map((f) => (
                    <li key={f}>
                      <Icon name="Check" size={15} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="nc-btn-primary nc-btn-full" onClick={() => setModalPlan(PLANS[planIndex])}>
                  Выбрать план
                </button>
              </GlassCard>
              <button
                className="nc-arrow-btn"
                onClick={() => setPlanIndex((p) => (p === 0 ? 1 : 0))}
                aria-label="Следующий тариф"
              >
                <Icon name="ChevronRight" size={20} />
              </button>
              <div className="nc-dots">
                {PLANS.map((_, i) => (
                  <button key={i} className={`nc-dot${planIndex === i ? " active" : ""}`} onClick={() => setPlanIndex(i)} />
                ))}
              </div>
            </Reveal>

            <Reveal delay={180}>
              <GlassCard className="nc-plan-card nc-plan-custom">
                <div className="nc-plan-heart">
                  <Icon name="Heart" size={32} />
                </div>
                <h3 className="nc-plan-name">Своя сумма</h3>
                <p className="nc-plan-custom-desc">Поддержи проект любой суммой — каждый рубль имеет значение</p>
                <input
                  className="nc-custom-input"
                  type="number"
                  placeholder="Введи сумму в ₽"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
                <button className="nc-btn-outline nc-btn-full" onClick={() => setModalPlan("custom")}>
                  <Icon name="Heart" size={16} />
                  Задонатить
                </button>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="nc-footer">
        <div className="nc-container">
          <div className="nc-footer-inner">
            <div className="nc-footer-brand">
              <div className="nc-logo">
                <span className="nc-logo-icon"><Icon name="Shield" size={18} /></span>
                <span className="nc-logo-text">NightCore</span>
                <span className="nc-logo-vpn">VPN</span>
              </div>
              <p className="nc-footer-tagline">Свобода в сети — наше общее дело</p>
            </div>
            <div className="nc-footer-links">
              <a href="#advantages">Преимущества</a>
              <a href="#how">Как работает</a>
              <a href="#trust">О нас</a>
              <a href="#support">Поддержать</a>
            </div>
            <div className="nc-footer-socials">
              <button className="nc-social-btn"><Icon name="Send" size={18} /></button>
              <button className="nc-social-btn"><Icon name="Github" size={18} /></button>
              <button className="nc-social-btn"><Icon name="Twitter" size={18} /></button>
            </div>
          </div>
          <div className="nc-footer-bottom">
            <span>© 2024 NightCore VPN. Все права защищены.</span>
            <span>Политика конфиденциальности · Условия использования</span>
          </div>
        </div>
      </footer>

      {/* ── MODAL ── */}
      {modalPlan && (
        <div className="nc-modal-overlay" onClick={() => setModalPlan(null)}>
          <div className="nc-modal" onClick={(e) => e.stopPropagation()}>
            <button className="nc-modal-close" onClick={() => setModalPlan(null)}>
              <Icon name="X" size={20} />
            </button>
            {modalPlan === "custom" ? (
              <>
                <div className="nc-modal-icon"><Icon name="Heart" size={36} /></div>
                <h2 className="nc-modal-title">Своя сумма</h2>
                <p className="nc-modal-desc">
                  Сумма: <strong>{customAmount || "не указана"} ₽</strong>
                </p>
                <p className="nc-modal-desc">Спасибо! Твоя поддержка помогает нам держать серверы и развивать проект без рекламы и корпораций.</p>
                <button className="nc-btn-primary nc-btn-lg" style={{ width: "100%" }}>
                  Перейти к оплате
                </button>
              </>
            ) : (
              <>
                <div className="nc-modal-icon"><Icon name="Shield" size={36} /></div>
                <h2 className="nc-modal-title">Тариф «{(modalPlan as typeof PLANS[0]).name}»</h2>
                <div className="nc-modal-price">{(modalPlan as typeof PLANS[0]).price} <span>{(modalPlan as typeof PLANS[0]).period}</span></div>
                <ul className="nc-modal-features">
                  {(modalPlan as typeof PLANS[0]).features.map((f) => (
                    <li key={f}><Icon name="Check" size={15} />{f}</li>
                  ))}
                </ul>
                <p className="nc-modal-desc">Оплата через криптовалюту или карту. После оплаты вы получите анонимный ключ доступа.</p>
                <button className="nc-btn-primary nc-btn-lg" style={{ width: "100%" }}>
                  Оформить подписку
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}