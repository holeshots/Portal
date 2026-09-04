import { AlertTriangle, Cloud, ShieldCheck, Users } from 'lucide-react'
import { DemoHeader, Status, Summary } from '../DemoPageParts'
import '../DemoPages.css'

const services = [
  { name: 'Exchange Online', state: 'Healthy', note: 'Mail flow operating normally' },
  { name: 'Microsoft Teams', state: 'Advisory', note: 'Intermittent meeting recording delay' },
  { name: 'SharePoint Online', state: 'Healthy', note: 'No active incidents' },
  { name: 'Microsoft Entra ID', state: 'Healthy', note: 'Authentication operating normally' },
]

export function Microsoft365Page() {
  return <div className="demo-page">
    <DemoHeader eyebrow="Cloud operations" title="Microsoft 365" description="Review tenant capacity, service health, and identity attention across managed clients." />
    <section className="demo-summary-grid" aria-label="Microsoft 365 overview">
      <Summary icon={<Cloud />} label="Managed tenants" value="12" detail="All reporting in" />
      <Summary icon={<Users />} label="Licensed users" value="684" detail="712 total identities" />
      <Summary icon={<ShieldCheck />} label="Secure score" value="78%" detail="Up 4 points this month" tone="good" />
      <Summary icon={<AlertTriangle />} label="Attention items" value="5" detail="Across 3 tenants" tone="warning" />
    </section>
    <div className="demo-two-column">
      <section className="demo-card demo-padded" aria-labelledby="license-title"><div className="demo-card-heading"><div><span className="eyebrow">Capacity</span><h2 id="license-title">License utilization</h2></div><strong>684 / 760</strong></div>
        {[['Microsoft 365 Business Premium', 241, 260], ['Exchange Online Plan 1', 196, 220], ['Microsoft 365 E3', 147, 160], ['Business Basic', 100, 120]].map(([name, used, total]) => <div className="license-row" key={String(name)}><div><strong>{name}</strong><span>{used} of {total} assigned</span></div><progress aria-label={`${name} license utilization`} max={Number(total)} value={Number(used)} /></div>)}
      </section>
      <section className="demo-card demo-padded" aria-labelledby="health-title"><div className="demo-card-heading"><div><span className="eyebrow">Microsoft status</span><h2 id="health-title">Service health</h2></div></div><ul className="service-list">{services.map((service) => <li key={service.name}><div><strong>{service.name}</strong><span>{service.note}</span></div><Status label={service.state} tone={service.state === 'Healthy' ? 'healthy' : 'attention'} /></li>)}</ul></section>
    </div>
    <section className="demo-card demo-padded" aria-labelledby="attention-title"><div className="demo-card-heading"><div><span className="eyebrow">Prioritized follow-up</span><h2 id="attention-title">Attention items</h2></div></div><ul className="attention-list"><li><AlertTriangle aria-hidden="true" /><div><strong>7 licenses expire within 30 days</strong><span>Apex Builders · Business Premium</span></div><Status label="Renewal" tone="attention" /></li><li><ShieldCheck aria-hidden="true" /><div><strong>Legacy authentication detected</strong><span>Delta Logistics · 3 accounts</span></div><Status label="Security" tone="offline" /></li><li><Users aria-hidden="true" /><div><strong>4 unlicensed active users</strong><span>Northstar Technologies</span></div><Status label="Review" tone="attention" /></li></ul></section>
  </div>
}
