import { ArrowUpRight, Check, Clock3, FileText, Search, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAccountGivenName, useAuthentication } from '../auth/AuthContext'

export function DashboardPage() {
  const navigate = useNavigate()
  const { account } = useAuthentication()
  return (
    <>
          <section className="welcome-panel" aria-labelledby="welcome-title">
            <div>
              <span className="welcome-kicker">Thursday, August 27</span>
              <h1 id="welcome-title">Good morning, {getAccountGivenName(account)}.</h1>
              <p>Your workspace is ready. Here’s what needs your attention today.</p>
            </div>
            <button className="primary-button" onClick={() => navigate('/tickets')}><Search size={18} /> View tickets</button>
          </section>

          <section className="summary-grid" aria-label="Workspace summary">
            <article className="summary-card">
              <span className="summary-icon is-green"><FileText size={20} /></span>
              <div><span>Open reports</span><strong>18</strong></div>
              <span className="trend">+3 this week</span>
            </article>
            <article className="summary-card">
              <span className="summary-icon is-amber"><Clock3 size={20} /></span>
              <div><span>Pending review</span><strong>6</strong></div>
              <span className="trend is-muted">2 due today</span>
            </article>
            <article className="summary-card">
              <span className="summary-icon is-blue"><Users size={20} /></span>
              <div><span>Team members</span><strong>24</strong></div>
              <span className="trend">All active</span>
            </article>
          </section>

          <section className="workspace-grid">
            <article className="content-card focus-card">
              <div className="card-heading">
                <div><span className="eyebrow">Today</span><h2>Priority checklist</h2></div>
                <button className="text-button">View all <ArrowUpRight size={15} /></button>
              </div>
              <div className="task-list">
                {['Review Q3 operational report', 'Approve supplier onboarding', 'Share weekly team update'].map((task, index) => (
                  <label className="task-row" key={task}>
                    <input type="checkbox" defaultChecked={index === 0} />
                    <span className="custom-check"><Check size={13} /></span>
                    <span>{task}</span>
                    <small>{index === 0 ? 'Completed' : index === 1 ? '10:30 AM' : '2:00 PM'}</small>
                  </label>
                ))}
              </div>
            </article>
            <aside className="content-card note-card">
              <span className="eyebrow">Quick note</span>
              <h2>Clean data. Clear decisions.</h2>
              <p>The reporting workspace has been simplified so your team can focus on actions, not dashboards.</p>
              <button className="text-button">Open reports <ArrowUpRight size={15} /></button>
            </aside>
          </section>
    </>
  )
}
