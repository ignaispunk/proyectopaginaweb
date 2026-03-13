import { useState, useEffect, useRef, useCallback } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'

// ─── SVG Icon helpers ───
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
)

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
)

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
)

// ─── Service data (shared between nav and pages) ───
const servicios = [
  {
    slug: 'ingenieria-conceptual',
    title: 'Ingeniería Conceptual',
    desc: 'Estudios de factibilidad y definición de alcances para proyectos mineros e industriales. Representan el 15-20% de nuestros proyectos.',
    fullDesc: 'En HQR Ingeniería, nuestra práctica de Ingeniería Conceptual establece las bases técnicas y económicas que determinan la viabilidad de cada proyecto. Trabajamos con nuestros clientes desde las etapas más tempranas para definir alcances, evaluar alternativas y establecer los parámetros fundamentales que guiarán el desarrollo del proyecto.',
    items: ['Estudios de prefactibilidad', 'Análisis de alternativas', 'Estimación de costos Clase V-III', 'Diagramas de flujo de proceso'],
    extraItems: ['Definición de alcance preliminar', 'Layout general de planta', 'Evaluación de riesgos técnicos', 'Cronograma maestro preliminar'],
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 12 18.469a3.374 3.374 0 0 0-.535-1.82l-.548-.547z"/></svg>,
    color: 'var(--color-primary)',
  },
  {
    slug: 'ingenieria-basica',
    title: 'Ingeniería Básica',
    desc: 'Desarrollo de especificaciones técnicas y diseños preliminares. Representa el 30-35% de nuestros proyectos.',
    fullDesc: 'Nuestra Ingeniería Básica transforma los conceptos aprobados en documentación técnica detallada que sirve como base para la ingeniería de detalles y la construcción. Definimos las especificaciones, parámetros de diseño y criterios que aseguran la integridad técnica del proyecto.',
    items: ['Especificaciones técnicas', 'Planos de disposición general', 'Listado de equipos principales', 'Estimación de costos Clase II'],
    extraItems: ['Diagramas P&ID', 'Criterios de diseño por disciplina', 'Filosofía de operación y control', 'Plan de ejecución del proyecto'],
    featured: true,
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>,
    color: 'var(--color-secondary)',
  },
  {
    slug: 'ingenieria-de-detalles',
    title: 'Ingeniería de Detalles',
    desc: 'Documentación completa para construcción y fabricación. Nuestro servicio principal, representando el 45-55% de los proyectos.',
    fullDesc: 'La Ingeniería de Detalles es nuestro servicio insignia. Generamos toda la documentación técnica necesaria para la construcción, fabricación y montaje de proyectos industriales. Cada entregable cumple con los más altos estándares de calidad y precisión técnica, respaldados por nuestra certificación ISO 9001:2015.',
    items: ['Planos de construcción y montaje', 'Modelos 3D detallados (BIM)', 'Memorias de cálculo', 'Listas de materiales y cubicaciones'],
    extraItems: ['Isométricos de piping', 'Planos de fabricación', 'Especificaciones de montaje', 'Documentación As-Built'],
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    color: 'var(--color-primary)',
  },
]

// ─── Shared Layout (Header + Footer) ───
function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const isHome = location.pathname === '/'
  const navigate = useNavigate()

  const scrollToSection = useCallback((sectionId) => {
    setMenuOpen(false)
    if (isHome) {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [isHome, navigate])

  const SectionLink = ({ id, children, className }) => (
    <a href={`#${id}`} className={className} onClick={(e) => { e.preventDefault(); scrollToSection(id) }}>{children}</a>
  )

  return (
    <>
      <header className={`header${scrolled ? ' header--scrolled' : ''}`} id="header">
        <div className="header__container">
          <Link to="/" className="header__logo">
            <img src={`${import.meta.env.BASE_URL}imagenes/LOGO HQR PNG.png`} alt="HQR Ingeniería" width="140" height="48" />
          </Link>
          <nav className={`header__nav${menuOpen ? ' open' : ''}`} id="nav">
            <ul className="header__menu">
              <li><SectionLink id="nosotros" className="header__link">Nosotros</SectionLink></li>
              <li className={`header__dropdown${dropdownOpen ? ' open' : ''}`}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  className="header__link header__link--has-dropdown"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  Servicios
                </button>
                <ul className="header__dropdown-menu">
                  {servicios.map((s) => (
                    <li key={s.slug}>
                      <Link to={`/${s.slug}`} className="header__dropdown-link" onClick={() => { setMenuOpen(false); setDropdownOpen(false) }}>
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li><SectionLink id="bim" className="header__link">Tecnología BIM</SectionLink></li>
              <li><SectionLink id="proyectos" className="header__link">Proyectos</SectionLink></li>
              <li><SectionLink id="certificaciones" className="header__link">Certificaciones</SectionLink></li>
              <li><SectionLink id="contacto" className="header__link header__link--cta">Contacto</SectionLink></li>
            </ul>
          </nav>
          <button className={`header__burger${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div className={`nav-overlay${menuOpen ? ' visible' : ''}`} onClick={() => setMenuOpen(false)} />

      {children}

      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <img src={`${import.meta.env.BASE_URL}imagenes/LOGO HQR PNG.png`} alt="HQR Ingeniería" width="120" height="41" className="footer__logo" />
              <p className="footer__tagline">Ingeniería especializada para la industria minera con metodología BIM y tecnología Autodesk Construction Cloud.</p>
              <div className="footer__social">
                <a href="#" aria-label="LinkedIn" className="footer__social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="footer__social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
              </div>
            </div>
            <div className="footer__links">
              <h4 className="footer__heading">Enlaces Rápidos</h4>
              <ul>
                <li><SectionLink id="nosotros">Nosotros</SectionLink></li>
                <li><Link to="/ingenieria-conceptual">Ing. Conceptual</Link></li>
                <li><Link to="/ingenieria-basica">Ing. Básica</Link></li>
                <li><Link to="/ingenieria-de-detalles">Ing. de Detalles</Link></li>
                <li><SectionLink id="bim">Tecnología BIM</SectionLink></li>
                <li><SectionLink id="contacto">Contacto</SectionLink></li>
              </ul>
            </div>
            <div className="footer__contact">
              <h4 className="footer__heading">Contacto</h4>
              <ul>
                <li>Santiago, Chile</li>
                <li>+56 2 2345 6789</li>
                <li>contacto@hqringenieria.cl</li>
                <li>Lun – Vie: 08:00 – 18:00</li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <p>&copy; 2026 HQR Ingeniería. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

// ─── Scroll animation hook ───
function useScrollAnimations() {
  const animRefs = useRef([])

  useEffect(() => {
    animRefs.current = animRefs.current.filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    animRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const animRef = (el) => {
    if (el && !animRefs.current.includes(el)) animRefs.current.push(el)
  }

  return animRef
}

// ─── Home Page ───
function HomePage() {
  const animRef = useScrollAnimations()
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
  const [formErrors, setFormErrors] = useState({})
  const [formSending, setFormSending] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const videoRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = {}
    if (!formData.nombre.trim()) errors.nombre = true
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = true
    if (!formData.mensaje.trim()) errors.mensaje = true
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setFormSending(true)
    setTimeout(() => {
      setFormSending(false)
      setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
      setFormSuccess(true)
      setTimeout(() => setFormSuccess(false), 5000)
    }, 1200)
  }

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: false }))
  }

  return (
    <>
      {/* HERO */}
      <section className="hero" id="hero">
        <video
          ref={videoRef}
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={`${import.meta.env.BASE_URL}videos/Video Header.mp4`} type="video/mp4" />
        </video>
        <div className="hero__overlay" aria-hidden="true"></div>
        <div className="hero__grid-pattern" aria-hidden="true"></div>
        <div className="hero__content">
          <div className="hero__tag anim-fade-up" ref={animRef}>Ingeniería Multidisciplinaria</div>
          <h1 className="hero__title anim-fade-up" ref={animRef} style={{'--delay': '.12s'}}>
            Soluciones de Ingeniería<br />
            <span className="hero__title-accent">de Clase Mundial</span>
          </h1>
          <p className="hero__subtitle anim-fade-up" ref={animRef} style={{'--delay': '.24s'}}>
            Desarrollamos proyectos de ingeniería complejos para la industria minera utilizando
            metodología BIM, optimizando costos y garantizando eficiencia, calidad y seguridad.
          </p>
          <div className="hero__actions anim-fade-up" ref={animRef} style={{'--delay': '.36s'}}>
            <a href="#contacto" className="btn btn--primary" onClick={(e) => { e.preventDefault(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>Contáctanos <ArrowIcon /></a>
            <Link to="/ingenieria-conceptual" className="btn btn--outline">Nuestros Servicios</Link>
          </div>
        </div>
        <div className="hero__scroll-indicator anim-fade-up" ref={animRef} style={{'--delay': '.6s'}}>
          <div className="hero__scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* NOSOTROS */}
      <section className="section nosotros" id="nosotros">
        <div className="container">
          <div className="nosotros__layout">
            <div className="nosotros__intro anim-fade-up" ref={animRef}>
              <span className="section__label">Quiénes Somos</span>
              <h2 className="section__title">Ingeniería con <span className="text-accent">propósito</span> y excelencia</h2>
              <p className="nosotros__text">
                HQR Ingeniería SpA es una empresa chilena de servicios de ingeniería especializada,
                fundada en 2018, que se ha posicionado como un actor diferenciado en el sector de
                ingeniería para la industria minera. Con más de 63 profesionales especializados y
                más de 700.000 horas hombre desarrolladas, nuestra identidad se construye sobre la
                innovación tecnológica, la excelencia técnica y la transformación digital del sector.
              </p>
              <p className="nosotros__text">
                Nuestro equipo multidisciplinario abarca las áreas de Mecánica, Eléctrica, Instrumentación,
                Civil-Estructural y Piping, lo que nos permite abordar proyectos complejos de manera integral
                para clientes estratégicos del sector minero chileno.
              </p>
            </div>
            <div className="nosotros__cards">
              {[
                { cls: 'purple', title: 'Visión', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>, text: 'Convertirnos en un referente reconocido por nuestros clientes, tanto a nivel nacional como internacional, en el desarrollo de proyectos de ingeniería dentro de la industria minera, destacándonos por implementar tecnología BIM y enfoques 3D avanzados.' },
                { cls: 'green', title: 'Misión', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>, text: 'Desarrollamos proyectos de ingeniería complejos utilizando metodología BIM, optimizando costos y garantizando la máxima eficiencia, calidad, seguridad y flexibilidad. Nos comprometemos a acompañar a nuestros clientes en cada etapa, asegurando un enfoque detallado, confianza continua y absoluta confidencialidad.' },
                { cls: 'blue', title: 'Política de Calidad', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>, text: 'Trazabilidad completa, calidad documental y gestión basada en riesgos alineada con ISO 9001:2015. Cada entregable cuenta con control de versiones, precisión técnica y cumplimiento normativo.' },
              ].map((card, i) => (
                <div key={card.cls} className={`nosotros__card nosotros__card--${card.cls} anim-fade-up`} ref={animRef} style={{'--delay': `${(i + 1) * 0.1}s`}}>
                  <div className="nosotros__card-icon">{card.icon}</div>
                  <h3 className="nosotros__card-title">{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BIM */}
      <section className="section bim" id="bim">
        <div className="container">
          <div className="bim__layout">
            <div className="bim__visual anim-fade-up" ref={animRef}>
              <div className="bim__visual-inner">
                <div className="bim__visual-grid" aria-hidden="true">
                  <div className="bim__cube"></div>
                  <div className="bim__cube bim__cube--2"></div>
                  <div className="bim__cube bim__cube--3"></div>
                </div>
                <div className="bim__visual-label">
                  <span className="bim__visual-tag">BIM</span>
                  <span className="bim__visual-text">Building Information Modeling</span>
                </div>
              </div>
            </div>
            <div className="bim__content">
              <span className="section__label anim-fade-up" ref={animRef}>Tecnología</span>
              <h2 className="section__title anim-fade-up" ref={animRef} style={{'--delay': '.08s'}}>Innovación con <span className="text-accent">Tecnología BIM</span></h2>
              <p className="bim__desc anim-fade-up" ref={animRef} style={{'--delay': '.14s'}}>Nuestra metodología BIM multidisciplinaria integral, soportada por Autodesk Construction Cloud (ACC), redefine la gestión colaborativa y la trazabilidad en todo el ciclo de vida del proyecto. Todas las disciplinas convergen en un único modelo centralizado.</p>
              <div className="bim__features">
                {[
                  { title: 'Modelo Colaborativo 3D', text: 'Todas las disciplinas trabajan en un modelo centralizado, mejorando la coordinación temprana y reduciendo errores de interfaz.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg> },
                  { title: 'Detección de Interferencias', text: 'Clash detection automático con BIM Collaborate para anticipar conflictos entre estructuras, piping y ductos eléctricos.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
                  { title: 'Autodesk Docs', text: 'Repositorio documental centralizado con control de versiones, trazabilidad de cambios y flujos de aprobación integrados.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg> },
                  { title: 'Colaboración en Tiempo Real', text: 'BIM Collaborate Pro permite que múltiples equipos trabajen simultáneamente sobre modelos Revit con sincronización en la nube.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
                ].map((feat, i) => (
                  <div key={feat.title} className="bim__feature anim-fade-up" ref={animRef} style={{'--delay': `${0.2 + i * 0.06}s`}}>
                    <div className="bim__feature-icon">{feat.icon}</div>
                    <div>
                      <h4 className="bim__feature-title">{feat.title}</h4>
                      <p>{feat.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROYECTOS */}
      <section className="section proyectos" id="proyectos">
        <div className="container">
          <div className="section__header anim-fade-up" ref={animRef}>
            <span className="section__label">Portafolio</span>
            <h2 className="section__title">Proyectos <span className="text-accent">Destacados</span></h2>
            <p className="section__desc">Una selección de proyectos que reflejan nuestra capacidad técnica y compromiso con la excelencia.</p>
          </div>
          <div className="proyectos__grid">
            {[
              { tag: 'Minería No Metálica', title: 'Proyectos de Litio — SQM', desc: 'Ingeniería multidisciplinaria para proyectos Greenfield y Brownfield de extracción y procesamiento avanzado de litio en el Salar de Atacama.', img: 'imagenes/1035_RenderAI.png' },
              { tag: 'Minería Metálica', title: 'Planta de Pellets — CMP', desc: 'Proyectos de mejoras operacionales en planta de Pellets para minería metálica en el Valle del Huasco.', img: 'imagenes/1051_RenderIAv2.png' },
              { tag: 'Industrial', title: 'Puerto de Descarga — Interacid', desc: 'Ingeniería para proyectos industriales en puerto de descarga de ácido sulfúrico en Mejillones.', img: 'imagenes/1054.v4.renderIA.png' },
              { tag: 'Mecánica', title: 'Diseño de Plantas', desc: 'Diseño de lay-outs de planta, sistemas mecánicos y especificaciones técnicas de equipos industriales.', grad: 'linear-gradient(135deg, #3DA242 0%, #3d8ba2 50%, #3d6ea2 100%)' },
              { tag: 'Eléctrica', title: 'Sistemas de Potencia', desc: 'Diseño de redes de distribución eléctrica y sistemas de control en media y baja tensión para instalaciones industriales.', grad: 'linear-gradient(135deg, #4a5a9a 0%, #5466A8 50%, #6878b8 100%)' },
              { tag: 'Piping', title: 'Sistemas de Cañerías', desc: 'Diseño de sistemas de distribución de fluidos, especificaciones técnicas para cañerías y válvulas en proyectos mineros.', grad: 'linear-gradient(135deg, #3DA242 0%, #5ba23d 50%, #7aa23d 100%)' },
            ].map((proj, i) => (
              <div key={proj.title} className="proyecto-card anim-fade-up" ref={animRef} style={{'--delay': `${0.1 + i * 0.05}s`}}>
                <div className="proyecto-card__visual" style={proj.img ? {} : {'--grad': proj.grad}}>
                  {proj.img && <img src={`${import.meta.env.BASE_URL}${proj.img}`} alt={proj.title} className="proyecto-card__img" />}
                  <span className="proyecto-card__tag">{proj.tag}</span>
                </div>
                <div className="proyecto-card__body">
                  <h3 className="proyecto-card__title">{proj.title}</h3>
                  <p>{proj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICACIONES */}
      <section className="section certificaciones" id="certificaciones">
        <div className="container">
          <div className="section__header anim-fade-up" ref={animRef}>
            <span className="section__label">Respaldo</span>
            <h2 className="section__title">Certificaciones y <span className="text-accent">Estándares</span></h2>
            <p className="section__desc">Trabajamos bajo los más altos estándares internacionales que garantizan la calidad de nuestros servicios.</p>
          </div>
          <div className="cert__grid">
            {[
              { title: 'ISO 9001:2015', desc: 'Sistema de Gestión de Calidad', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>, pdfUrl: 'archivos/01 10007 2532223_Main_ES.pdf', sealImg: 'imagenes/TR-Testmark_9000039190_ES_CMYK_with-QR-Code.png' },
              { title: 'ISO 45001:2018', desc: 'Seguridad y Salud en el Trabajo', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
              { title: 'ISO 14001:2015', desc: 'Gestión Ambiental', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
              { title: 'BIM Level 2', desc: 'Metodología BIM con Autodesk Construction Cloud', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
            ].map((cert, i) => (
              <div key={cert.title} className="cert-card anim-fade-up" ref={animRef} style={{'--delay': `${0.1 + i * 0.05}s`}}>
                {cert.sealImg
                  ? <img src={`${import.meta.env.BASE_URL}${cert.sealImg}`} alt="Sello certificación ISO 9001" className="cert-card__seal" />
                  : <div className="cert-card__icon">{cert.icon}</div>
                }
                <h3 className="cert-card__title">{cert.title}</h3>
                <p className="cert-card__desc">{cert.desc}</p>
                {cert.pdfUrl && (
                  <a href={`${import.meta.env.BASE_URL}${cert.pdfUrl}`} target="_blank" rel="noopener noreferrer" className="cert-card__pdf-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                    Ver Certificado PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="section contacto" id="contacto">
        <div className="container">
          <div className="section__header anim-fade-up" ref={animRef}>
            <span className="section__label">Hablemos</span>
            <h2 className="section__title">Inicia tu <span className="text-accent">Proyecto</span></h2>
          </div>
          <div className="contacto__layout">
            <form className="contacto__form anim-fade-up" ref={animRef} onSubmit={handleSubmit} noValidate>
              <div className="form__group">
                <label htmlFor="nombre" className="form__label">Nombre completo</label>
                <input type="text" id="nombre" className={`form__input${formErrors.nombre ? ' error' : ''}`} required placeholder="Ej: Juan Pérez" value={formData.nombre} onChange={(e) => handleInput('nombre', e.target.value)} />
              </div>
              <div className="form__row">
                <div className="form__group">
                  <label htmlFor="email" className="form__label">Correo electrónico</label>
                  <input type="email" id="email" className={`form__input${formErrors.email ? ' error' : ''}`} required placeholder="juan@ejemplo.cl" value={formData.email} onChange={(e) => handleInput('email', e.target.value)} />
                </div>
                <div className="form__group">
                  <label htmlFor="telefono" className="form__label">Teléfono</label>
                  <input type="tel" id="telefono" className="form__input" placeholder="+56 9 1234 5678" value={formData.telefono} onChange={(e) => handleInput('telefono', e.target.value)} />
                </div>
              </div>
              <div className="form__group">
                <label htmlFor="mensaje" className="form__label">Mensaje</label>
                <textarea id="mensaje" className={`form__input form__textarea${formErrors.mensaje ? ' error' : ''}`} rows="5" required placeholder="Cuéntanos sobre tu proyecto..." value={formData.mensaje} onChange={(e) => handleInput('mensaje', e.target.value)} />
              </div>
              <button type="submit" className="btn btn--primary btn--full" disabled={formSending}>
                {formSending ? 'Enviando...' : <>Enviar Mensaje <SendIcon /></>}
              </button>
              <div className={`form__success${formSuccess ? ' visible' : ''}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
                <span>¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</span>
              </div>
            </form>
            <div className="contacto__info anim-fade-up" ref={animRef} style={{'--delay': '.15s'}}>
              <div className="contacto__info-card">
                <h3 className="contacto__info-title">Información de Contacto</h3>
                <div className="contacto__info-items">
                  {[
                    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: 'Dirección', value: 'Santiago, Región Metropolitana, Chile' },
                    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: 'Teléfono', value: '+56 2 2345 6789' },
                    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'Email', value: 'contacto@hqringenieria.cl' },
                    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: 'Horario', value: 'Lunes a Viernes: 08:00 – 18:00 hrs' },
                  ].map((info) => (
                    <div key={info.label} className="contacto__info-item">
                      <div className="contacto__info-icon">{info.icon}</div>
                      <div>
                        <strong>{info.label}</strong>
                        <p>{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// ─── Service Page Component ───
function ServicioPage({ servicio }) {
  const animRef = useScrollAnimations()

  return (
    <>
      {/* HERO BANNER */}
      <section className="servicio-hero">
        <div className="servicio-hero__bg" aria-hidden="true"></div>
        <div className="hero__overlay" aria-hidden="true"></div>
        <div className="hero__grid-pattern" aria-hidden="true"></div>
        <div className="servicio-hero__content">
          <div className="hero__tag anim-fade-up" ref={animRef}>Servicios de Ingeniería</div>
          <h1 className="hero__title anim-fade-up" ref={animRef} style={{'--delay': '.12s'}}>
            {servicio.title}
          </h1>
          <div className="servicio-hero__breadcrumb anim-fade-up" ref={animRef} style={{'--delay': '.24s'}}>
            <Link to="/">Inicio</Link>
            <span>/</span>
            <span>{servicio.title}</span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section servicio-page">
        <div className="container">
          <div className="servicio-page__layout">
            <div className="servicio-page__main anim-fade-up" ref={animRef}>
              <div className="servicio-page__icon-wrap" style={{ '--svc-color': servicio.color }}>
                {servicio.icon}
              </div>
              <p className="servicio-page__intro">{servicio.fullDesc}</p>

              <h2 className="servicio-page__subtitle">Alcance del Servicio</h2>
              <div className="servicio-page__items-grid">
                <div className="servicio-page__items-col">
                  <h3>Entregables Principales</h3>
                  <ul className="servicio-page__list">
                    {servicio.items.map((item) => (
                      <li key={item}><CheckIcon /> {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="servicio-page__items-col">
                  <h3>Entregables Adicionales</h3>
                  <ul className="servicio-page__list">
                    {servicio.extraItems.map((item) => (
                      <li key={item}><CheckIcon /> {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <aside className="servicio-page__sidebar anim-fade-up" ref={animRef} style={{'--delay': '.15s'}}>
              <div className="servicio-page__nav-card">
                <h3>Nuestros Servicios</h3>
                <ul>
                  {servicios.map((s) => (
                    <li key={s.slug} className={s.slug === servicio.slug ? 'active' : ''}>
                      <Link to={`/${s.slug}`}>{s.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="servicio-page__contact-card">
                <h3>¿Necesitas este servicio?</h3>
                <p>Contáctanos para una cotización personalizada.</p>
                <Link to="/" className="btn btn--primary btn--full" onClick={() => setTimeout(() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }), 100)}>
                  Solicitar Cotización <ArrowIcon />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

// ─── App with Routes ───
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {servicios.map((s) => (
          <Route key={s.slug} path={`/${s.slug}`} element={<ServicioPage servicio={s} />} />
        ))}
      </Routes>
    </Layout>
  )
}
