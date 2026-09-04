import { useMemo, useState } from 'react'
import { AlertTriangle, CircleCheck, Laptop, Search, Server, WifiOff } from 'lucide-react'
import { DemoHeader, EmptyState, Status, Summary } from '../DemoPageParts'
import '../DemoPages.css'

type DeviceHealth = 'Healthy' | 'Attention' | 'Offline'
const devices = [
  { name: 'ACME-LT-042', client: 'Acme Corporation', os: 'Windows 11 Pro', type: 'Laptop', health: 'Healthy' as DeviceHealth, checkIn: '2 min ago' },
  { name: 'NST-SRV-01', client: 'Northstar Technologies', os: 'Windows Server 2022', type: 'Server', health: 'Attention' as DeviceHealth, checkIn: '18 min ago' },
  { name: 'APX-FW-02', client: 'Apex Builders', os: 'FortiOS 7.4', type: 'Firewall', health: 'Offline' as DeviceHealth, checkIn: '3 hr ago' },
  { name: 'DEL-MAC-07', client: 'Delta Logistics', os: 'macOS 15', type: 'Laptop', health: 'Healthy' as DeviceHealth, checkIn: '6 min ago' },
  { name: 'ACME-SRV-03', client: 'Acme Corporation', os: 'Ubuntu 24.04 LTS', type: 'Server', health: 'Healthy' as DeviceHealth, checkIn: '4 min ago' },
  { name: 'NST-LT-118', client: 'Northstar Technologies', os: 'Windows 11 Pro', type: 'Laptop', health: 'Healthy' as DeviceHealth, checkIn: '11 min ago' },
]

export function DevicesPage() {
  const [search, setSearch] = useState('')
  const [health, setHealth] = useState<DeviceHealth | 'All'>('All')
  const [os, setOs] = useState('All')
  const filtered = useMemo(() => devices.filter((device) => {
    const query = search.trim().toLowerCase()
    return (!query || `${device.name} ${device.client} ${device.os}`.toLowerCase().includes(query))
      && (health === 'All' || device.health === health)
      && (os === 'All' || device.os.includes(os))
  }), [health, os, search])
  const clearFilters = () => { setSearch(''); setHealth('All'); setOs('All') }

  return <div className="demo-page">
    <DemoHeader eyebrow="Managed estate" title="Devices" description="Monitor endpoint health and recent check-ins across every client environment." />
    <section className="demo-summary-grid" aria-label="Device inventory summary">
      <Summary icon={<Laptop />} label="Managed devices" value="148" detail="Across 12 client sites" />
      <Summary icon={<CircleCheck />} label="Healthy" value="139" detail="94% reporting normally" tone="good" />
      <Summary icon={<AlertTriangle />} label="Need attention" value="6" detail="Updates or protection" tone="warning" />
      <Summary icon={<WifiOff />} label="Offline" value="3" detail="Check-in overdue" tone="danger" />
    </section>
    <section className="demo-card" aria-labelledby="device-list-title">
      <div className="demo-card-heading"><div><span className="eyebrow">Inventory</span><h2 id="device-list-title">Managed devices</h2></div><span aria-live="polite">{filtered.length} shown</span></div>
      <div className="demo-filter-bar" role="search" aria-label="Filter devices">
        <label className="demo-search"><span>Search devices</span><div><Search size={17} aria-hidden="true" /><input type="search" aria-label="Search devices" value={search} placeholder="Device, client, or OS" onChange={(event) => setSearch(event.target.value)} /></div></label>
        <label><span>Health status</span><select aria-label="Health status" value={health} onChange={(event) => setHealth(event.target.value as DeviceHealth | 'All')}><option>All</option><option>Healthy</option><option>Attention</option><option>Offline</option></select></label>
        <label><span>Operating system</span><select aria-label="Operating system" value={os} onChange={(event) => setOs(event.target.value)}><option>All</option><option>Windows</option><option>macOS</option><option>Ubuntu</option><option>FortiOS</option></select></label>
        <button type="button" className="demo-secondary-button" onClick={clearFilters}>Clear device filters</button>
      </div>
      {filtered.length ? <div className="demo-table-wrap"><table className="demo-table"><thead><tr><th>Device</th><th>Client</th><th>OS</th><th>Health</th><th>Last check-in</th></tr></thead><tbody>{filtered.map((device) => <tr key={device.name}><td data-label="Device"><strong>{device.name}</strong><small>{device.type}</small></td><td data-label="Client">{device.client}</td><td data-label="OS">{device.os}</td><td data-label="Health"><Status label={device.health} tone={device.health.toLowerCase()} /></td><td data-label="Last check-in">{device.checkIn}</td></tr>)}</tbody></table></div> : <EmptyState icon={<Server />} title="No devices match this view" body="Try a broader search or clear the current inventory filters." />}
    </section>
  </div>
}
