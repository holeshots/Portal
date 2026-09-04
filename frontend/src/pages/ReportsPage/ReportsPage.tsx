import { useMemo, useState } from 'react'
import { CalendarRange, CheckCircle2, FileDown, FileText, ShieldCheck } from 'lucide-react'
import { DemoHeader, EmptyState, Status, Summary } from '../DemoPageParts'
import '../DemoPages.css'

const reports = [
  { title: 'Monthly service review', type: 'Operations', cadence: 'Monthly', owner: 'Service Delivery' },
  { title: 'SLA performance summary', type: 'SLA', cadence: 'Weekly', owner: 'Operations' },
  { title: 'Security posture review', type: 'Security', cadence: 'Monthly', owner: 'Security Team' },
  { title: 'Endpoint health digest', type: 'Operations', cadence: 'Weekly', owner: 'NOC' },
]

export function ReportsPage() {
  const [type, setType] = useState('All')
  const [period, setPeriod] = useState('30 days')
  const filtered = useMemo(() => reports.filter((report) => type === 'All' || report.type === type), [type])
  return <div className="demo-page">
    <DemoHeader eyebrow="Service intelligence" title="Reports" description="Review operational outcomes and prepare consistent client-facing service summaries." />
    <section className="demo-summary-grid" aria-label="Reporting summary"><Summary icon={<CheckCircle2 />} label="SLA attainment" value="96.4%" detail="Last 30 days" tone="good" /><Summary icon={<FileText />} label="Reports ready" value="8" detail="Scheduled this week" /><Summary icon={<FileDown />} label="Recent exports" value="14" detail="Generated this month" /><Summary icon={<ShieldCheck />} label="Security actions" value="11" detail="Open recommendations" tone="warning" /></section>
    <section className="demo-card" aria-labelledby="catalogue-title"><div className="demo-card-heading"><div><span className="eyebrow">Catalogue</span><h2 id="catalogue-title">Available reports</h2></div></div>
      <div className="demo-filter-bar reports-filters"><label><span>Report type</span><select aria-label="Report type" value={type} onChange={(event) => setType(event.target.value)}><option>All</option><option>Operations</option><option>SLA</option><option>Security</option></select></label><label><span>Reporting period</span><select aria-label="Reporting period" value={period} onChange={(event) => setPeriod(event.target.value)}><option>7 days</option><option>30 days</option><option>90 days</option></select></label><p aria-live="polite">Showing {type} reports for the last {period}</p></div>
      {filtered.length ? <div className="report-grid">{filtered.map((report) => <article key={report.title}><span aria-hidden="true"><FileText /></span><div><strong>{report.title}</strong><p>{report.owner} · {report.cadence}</p><Status label={report.type} tone={report.type.toLowerCase()} /></div></article>)}</div> : <EmptyState icon={<FileText />} title="No reports match this view" body="Choose another report type to continue." />}
    </section>
    <section className="demo-card demo-padded" aria-labelledby="exports-title"><div className="demo-card-heading"><div><span className="eyebrow">Audit trail</span><h2 id="exports-title">Recent exports</h2></div></div><ul className="export-list"><li><FileDown aria-hidden="true" /><div><strong>August service review — Acme Corporation</strong><span>PDF · Generated today, 9:42 AM</span></div><Status label="Ready" tone="healthy" /></li><li><CalendarRange aria-hidden="true" /><div><strong>Weekly SLA summary — All clients</strong><span>CSV · Generated yesterday</span></div><Status label="Ready" tone="healthy" /></li></ul></section>
  </div>
}
