import { type FormEvent, useState } from 'react'
import { Bell, Building2, Palette, UserRound } from 'lucide-react'
import { DemoHeader } from '../DemoPageParts'
import '../DemoPages.css'

export function SettingsPage() {
  const [name, setName] = useState('Jed Turqueza')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [digest, setDigest] = useState(true)
  const [appearance, setAppearance] = useState('System')
  const [workspace, setWorkspace] = useState('MSP Operations Workspace')
  const [feedback, setFeedback] = useState('')
  const save = (event: FormEvent) => { event.preventDefault(); setFeedback('Demo preferences updated · changes reset on refresh') }
  return <div className="demo-page"><DemoHeader eyebrow="Workspace administration" title="Settings" description="Preview personal preferences and workspace defaults for the Portal Dashboard." />
    <form className="settings-grid" onSubmit={save}>
      <section className="demo-card settings-card" aria-labelledby="profile-title"><header><span aria-hidden="true"><UserRound /></span><div><h2 id="profile-title">Profile preferences</h2><p>How your identity appears in the demo workspace.</p></div></header><label><span>Display name</span><input aria-label="Display name" value={name} onChange={(event) => setName(event.target.value)} /></label><label><span>Role</span><input value="MSP Administrator" disabled aria-label="Role" /></label></section>
      <section className="demo-card settings-card" aria-labelledby="notification-title"><header><span aria-hidden="true"><Bell /></span><div><h2 id="notification-title">Notifications</h2><p>Choose the events highlighted in this demo.</p></div></header><label className="setting-toggle"><input aria-label="Email service alerts" type="checkbox" checked={emailAlerts} onChange={(event) => setEmailAlerts(event.target.checked)} /><span><strong>Email service alerts</strong><small>Critical incidents and SLA breaches</small></span></label><label className="setting-toggle"><input aria-label="Weekly operations digest" type="checkbox" checked={digest} onChange={(event) => setDigest(event.target.checked)} /><span><strong>Weekly operations digest</strong><small>Queue, estate, and service summary</small></span></label></section>
      <section className="demo-card settings-card" aria-labelledby="appearance-title"><header><span aria-hidden="true"><Palette /></span><div><h2 id="appearance-title">Appearance</h2><p>Preview a preferred theme setting. The header theme control remains active.</p></div></header><fieldset><legend>Appearance preference</legend>{['System', 'Light', 'Dark'].map((option) => <label className="appearance-option" key={option}><input type="radio" name="appearance" value={option} checked={appearance === option} onChange={(event) => setAppearance(event.target.value)} /><span>{option}</span></label>)}</fieldset></section>
      <section className="demo-card settings-card" aria-labelledby="workspace-title"><header><span aria-hidden="true"><Building2 /></span><div><h2 id="workspace-title">Demo workspace</h2><p>Local display defaults for the sample MSP environment.</p></div></header><label><span>Workspace name</span><input value={workspace} onChange={(event) => setWorkspace(event.target.value)} /></label><label><span>Default timezone</span><select defaultValue="Asia/Manila"><option>Asia/Manila</option><option>Australia/Sydney</option><option>Europe/London</option></select></label></section>
      <div className="settings-actions"><p>Demo only · no settings are persisted or sent to a server.</p><button className="demo-primary-button" type="submit">Save demo settings</button>{feedback && <p className="demo-feedback" role="status">{feedback}</p>}</div>
    </form></div>
}
