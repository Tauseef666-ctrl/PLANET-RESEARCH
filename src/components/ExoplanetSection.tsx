import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Filter, Download, ExternalLink, ArrowUpDown } from 'lucide-react'
import { SAMPLE_EXOPLANETS, EXOPLANET_METHODS, EXOPLANET_FACILITIES, ExoplanetData } from '../data/exoplanets'

type SortKey = keyof ExoplanetData
type SortDir = 'asc' | 'desc'

export function ExoplanetSection() {
  const [filters, setFilters] = useState({
    year: '',
    method: '',
    facility: '',
    hostname: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('disc_year')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const perPage = 8

  const years = useMemo(() => [...new Set(SAMPLE_EXOPLANETS.map((e) => e.disc_year))].sort((a, b) => b - a), [])
  const hostnames = useMemo(() => [...new Set(SAMPLE_EXOPLANETS.map((e) => e.hostname))].sort(), [])

  const filtered = useMemo(() => {
    let data = [...SAMPLE_EXOPLANETS]
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      data = data.filter((e) => e.pl_name.toLowerCase().includes(q) || e.hostname.toLowerCase().includes(q))
    }
    if (filters.year) data = data.filter((e) => e.disc_year === Number(filters.year))
    if (filters.method) data = data.filter((e) => e.disc_method === filters.method)
    if (filters.facility) data = data.filter((e) => e.disc_facility === filters.facility)
    if (filters.hostname) data = data.filter((e) => e.hostname === filters.hostname)
    data.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      const numA = Number(aVal)
      const numB = Number(bVal)
      return sortDir === 'asc' ? numA - numB : numB - numA
    })
    return data
  }, [filters, sortKey, sortDir, searchTerm])

  const paged = filtered.slice(page * perPage, (page + 1) * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  const handleSearch = () => {
    if (!filters.year && !filters.method && !filters.facility && !filters.hostname) {
      setError('SELECT AT LEAST ONE RESEARCH PARAMETER')
      setTimeout(() => setError(''), 3000)
      return
    }
    setError('')
    setPage(0)
  }

  const clearFilters = () => {
    setFilters({ year: '', method: '', facility: '', hostname: '' })
    setSearchTerm('')
    setPage(0)
    setError('')
  }

  const exportCSV = () => {
    const headers = 'Name,Host,Year,Method,Facility,Orbital Period,Mass,Radius,Eq Temp,Distance\n'
    const rows = filtered.map((e) =>
      [e.pl_name, e.hostname, e.disc_year, e.disc_method, e.disc_facility, e.pl_orbper, e.pl_bmasse, e.pl_rade, e.pl_eqt, e.sy_dist].join(',')
    ).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'exoplanets.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-wider"
              style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#e8f0f8' }}
            >
              EXOPLANET <span style={{ color: '#00d4ff' }}>DATABASE</span>
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {filtered.length} exoplanets found · Data from NASA Exoplanet Archive
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowFilters(!showFilters)} className="p-2 rounded-lg hover:bg-white/5" title="Filters">
              <Filter size={16} color="#00d4ff" />
            </button>
            <button onClick={exportCSV} className="p-2 rounded-lg hover:bg-white/5" title="Export CSV">
              <Download size={16} color="#667788" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
          style={{
            background: 'rgba(13, 27, 42, 0.6)',
            border: '1px solid rgba(0, 212, 255, 0.1)',
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0) }}
            placeholder="Search exoplanets by name or host star..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-600"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3"
            style={{
              background: 'rgba(13, 27, 42, 0.6)',
              border: '1px solid rgba(0, 212, 255, 0.1)',
            }}
          >
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs bg-transparent outline-none"
              style={{ border: '1px solid rgba(0, 212, 255, 0.15)', color: '#aabbcc' }}
            >
              <option value="" style={{ background: '#0d1b2a' }}>Discovery Year</option>
              {years.map((y) => <option key={y} value={y} style={{ background: '#0d1b2a' }}>{y}</option>)}
            </select>
            <select
              value={filters.method}
              onChange={(e) => setFilters({ ...filters, method: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs bg-transparent outline-none"
              style={{ border: '1px solid rgba(0, 212, 255, 0.15)', color: '#aabbcc' }}
            >
              <option value="" style={{ background: '#0d1b2a' }}>Discovery Method</option>
              {EXOPLANET_METHODS.map((m) => <option key={m} value={m} style={{ background: '#0d1b2a' }}>{m}</option>)}
            </select>
            <select
              value={filters.hostname}
              onChange={(e) => setFilters({ ...filters, hostname: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs bg-transparent outline-none"
              style={{ border: '1px solid rgba(0, 212, 255, 0.15)', color: '#aabbcc' }}
            >
              <option value="" style={{ background: '#0d1b2a' }}>Host Name</option>
              {hostnames.map((h) => <option key={h} value={h} style={{ background: '#0d1b2a' }}>{h}</option>)}
            </select>
            <select
              value={filters.facility}
              onChange={(e) => setFilters({ ...filters, facility: e.target.value })}
              className="px-3 py-2 rounded-lg text-xs bg-transparent outline-none"
              style={{ border: '1px solid rgba(0, 212, 255, 0.15)', color: '#aabbcc' }}
            >
              <option value="" style={{ background: '#0d1b2a' }}>Discovery Facility</option>
              {EXOPLANET_FACILITIES.map((f) => <option key={f} value={f} style={{ background: '#0d1b2a' }}>{f}</option>)}
            </select>

            <div className="col-span-2 md:col-span-4 flex gap-2">
              <button onClick={handleSearch} className="px-6 py-2 rounded-lg text-xs tracking-wider" style={{ background: 'rgba(0, 212, 255, 0.15)', color: '#00d4ff', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
                SEARCH
              </button>
              <button onClick={clearFilters} className="px-6 py-2 rounded-lg text-xs tracking-wider" style={{ background: 'rgba(255,255,255,0.03)', color: '#667788', border: '1px solid rgba(255,255,255,0.08)' }}>
                CLEAR
              </button>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-center" style={{ background: 'rgba(255, 80, 80, 0.1)', border: '1px solid rgba(255, 80, 80, 0.3)', color: '#ff6666' }}>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl" style={{ background: 'rgba(13, 27, 42, 0.5)', border: '1px solid rgba(0, 212, 255, 0.08)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0, 212, 255, 0.1)' }}>
                {[
                  { key: 'pl_name' as SortKey, label: 'Name' },
                  { key: 'hostname' as SortKey, label: 'Host' },
                  { key: 'disc_year' as SortKey, label: 'Year' },
                  { key: 'disc_method' as SortKey, label: 'Method' },
                  { key: 'pl_rade' as SortKey, label: 'Radius' },
                  { key: 'pl_eqt' as SortKey, label: 'Temp' },
                  { key: 'sy_dist' as SortKey, label: 'Distance' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="px-4 py-3 text-left text-[10px] tracking-[0.15em] uppercase cursor-pointer hover:text-white transition-colors"
                    style={{ fontFamily: '"Space Grotesk", sans-serif', color: sortKey === col.key ? '#00d4ff' : '#556677' }}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && <ArrowUpDown size={10} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((e) => (
                <tr
                  key={e.pl_name}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: '1px solid rgba(0, 212, 255, 0.04)' }}
                >
                  <td className="px-4 py-3">
                    <a
                      href={`https://exoplanetarchive.ipac.caltech.edu/overview/${e.pl_name.replace(/\s/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
                    >
                      {e.pl_name} <ExternalLink size={9} />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{e.hostname}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{e.disc_year}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(0, 212, 255, 0.08)', color: '#88aacc' }}>
                      {e.disc_method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{e.pl_rade ? `${e.pl_rade} R⊕` : '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{e.pl_eqt ? `${e.pl_eqt} K` : '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{e.sy_dist ? `${e.sy_dist} pc` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-[10px] text-gray-600">
            Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1 text-[10px] rounded"
              style={{ background: 'rgba(255,255,255,0.03)', color: page === 0 ? '#334455' : '#8899aa' }}
            >
              PREV
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 text-[10px] rounded"
              style={{ background: 'rgba(255,255,255,0.03)', color: page >= totalPages - 1 ? '#334455' : '#8899aa' }}
            >
              NEXT
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
