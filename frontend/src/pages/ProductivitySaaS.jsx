import React from 'react';
import { ArrowRight, CheckCircle2, Zap, Layout, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductivitySaaS() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Navbar */}
      <header className="" style={{ position: 'sticky', top: 16, zIndex: 100, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', borderRadius: 'var(--radius-full)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'var(--accent-blue)', color: '#fff', padding: 8, borderRadius: 12, display: 'flex' }}>
            <Layout size={20} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>FlowState</span>
        </div>
        <nav style={{ display: 'flex', gap: 24, fontWeight: 600, fontSize: 14, color: 'var(--text-secondary)' }}>
          <a href="#features" style={{ textDecoration: 'none', color: 'inherit' }}>Features</a>
          <a href="#pricing" style={{ textDecoration: 'none', color: 'inherit' }}>Pricing</a>
          <a href="#about" style={{ textDecoration: 'none', color: 'inherit' }}>About</a>
        </nav>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/login" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>Log in</Link>
          <button className="btn btn-primary" style={{ background: 'var(--accent-blue)', color: '#fff', padding: '10px 20px', borderRadius: 'var(--radius-full)', fontWeight: 600, border: 'none' }}>Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-scroll-animate" style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center', maxWidth: 900, margin: '0 auto', px: 24 }}>
        <div className="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 'var(--radius-full)', marginBottom: 32, fontSize: 13, fontWeight: 600, color: 'var(--accent-blue)' }}>
          <Zap size={16} />
          <span>V2.0 is now live — Experience the new flow</span>
        </div>

        <h1 style={{ fontSize: 'clamp(44px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 24 }}>
          Focus on what matters. <br />
          <span style={{ color: 'var(--text-muted)' }}>We'll handle the rest.</span>
        </h1>

        <p style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 650, margin: '0 auto 48px' }}>
          FlowState organizes your tasks, automates your routines, and frees up your mind. The ultimate productivity OS for deep work.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '16px 32px', borderRadius: 'var(--radius-full)', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer' }}>
            Start for free <ArrowRight size={18} />
          </button>
          <button className="" style={{ color: 'var(--text-primary)', padding: '16px 32px', borderRadius: 'var(--radius-full)', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.4)' }}>
            <PlayCircle size={18} /> Watch demo
          </button>
        </div>

        <div style={{ marginTop: 64, display: 'flex', justifyContent: 'center', gap: 32, color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> No credit card required</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> 14-day free trial</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> Cancel anytime</span>
        </div>
      </main>

      {/* Hero Dashboard Preview */}
      <section className="hero-scroll-animate" style={{ maxWidth: 1000, margin: '0 auto 120px', padding: '0 24px' }}>
        <div className="" style={{ width: '100%', height: 500, borderRadius: 24, padding: 8, border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 24px 60px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Mock App Header */}
            <div style={{ height: 60, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#B54747' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#B7791F' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#2E7D5B' }} />
              </div>
            </div>
            {/* Mock App Content */}
            <div style={{ padding: 32, display: 'flex', gap: 32, flex: 1 }}>
              <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ height: 20, width: '100%', background: 'var(--border-subtle)', borderRadius: 4 }} />
                <div style={{ height: 20, width: '80%', background: 'var(--border-subtle)', borderRadius: 4 }} />
                <div style={{ height: 20, width: '90%', background: 'var(--border-subtle)', borderRadius: 4 }} />
              </div>
              <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', padding: 24 }}>
                <div style={{ height: 32, width: '40%', background: 'var(--border-medium)', borderRadius: 8, marginBottom: 24 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ height: 48, width: '100%', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-subtle)' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
