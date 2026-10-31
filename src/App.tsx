
import { Dashboard } from "./components/Dashboard"
import { useMemo, useState } from "react"
import {
  Bell,
  BrainCircuit,
  ChevronRight,
  CircleHelp,
  Command,
  FileText,
  Gauge,
  Hexagon,
  Image,
  Menu,
  Network,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react"
import { NeuralGraph } from "./components/NeuralGraph"
import {
  categoryLabels,
  neuralLinks,
  neuralNodes,
  type MemoryCategory,
  type NeuralNode,
} from "./data/neuralData"

const navItems = [
  { label: "Dashboard", icon: Gauge },
  { label: "Neural Space", icon: Network },
  { label: "Notes", icon: BrainCircuit },
  { label: "Images", icon: Image },
  { label: "Documents", icon: FileText },
  { label: "Settings", icon: Settings },
]

const categoryStyles: Record<MemoryCategory, string> = {
  memory: "bg-blue-400/12 text-blue-300 border-blue-400/25",
  image: "bg-violet-400/12 text-violet-300 border-violet-400/25",
  document: "bg-emerald-400/12 text-emerald-300 border-emerald-400/25",
  insight: "bg-cyan-400/12 text-cyan-300 border-cyan-400/25",
}

function Sidebar({
  active,
  onChange,
  open,
  onClose,
}: {
  active: string
  onChange: (label: string) => void
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-[#050610]/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[236px] flex-col border-r border-white/[0.07] bg-[#070812]/90 px-4 py-5 backdrop-blur-2xl transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-9 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="logo-mark">
              <Hexagon size={17} strokeWidth={1.7} />
            </div>

            <div>
              <div className="text-[14px] font-bold tracking-[0.24em] text-white">
                MINDVAULT
              </div>
              <div className="mt-0.5 text-[8px] font-medium tracking-[0.3em] text-violet-300/60">
                KNOWLEDGE OS
              </div>
            </div>
          </div>

          <button
            className="text-white/50 md:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-3 px-3 text-[9px] font-semibold tracking-[0.25em] text-white/25">
          YOUR MIND
        </div>

        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                onChange(label)
                onClose()
              }}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] transition-all ${
                active === label
                  ? "bg-violet-400/[0.1] text-white"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/75"
              }`}
            >
              {active === label && (
                <span className="absolute -left-4 h-6 w-[2px] rounded-full bg-violet-400 shadow-[0_0_14px_#9d6bff]" />
              )}

              <Icon
                size={16}
                strokeWidth={1.6}
                className={
                  active === label
                    ? "text-violet-300"
                    : "group-hover:text-white/70"
                }
              />

              {label}

              {label === "Notes" && (
                <span className="ml-auto rounded-full bg-white/[0.05] px-2 py-0.5 text-[9px] text-white/35">
                  2.8k
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-violet-300/10 bg-gradient-to-br from-violet-500/[0.11] to-cyan-500/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <Sparkles size={15} className="text-violet-300" />
              <span className="text-[9px] tracking-[0.15em] text-violet-200/50">
                NEURAL SYNC
              </span>
            </div>

            <div className="mb-2 flex items-end justify-between">
              <span className="text-[11px] text-white/70">Vault capacity</span>
              <span className="text-[10px] text-white/35">68%</span>
            </div>

            <div className="h-1 overflow-hidden rounded-full bg-white/[0.07]">
              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_10px_#725cff]" />
            </div>
          </div>

          <button className="flex w-full items-center gap-3 px-3 py-2 text-[11px] text-white/35 transition hover:text-white/70">
            <CircleHelp size={15} />
            Help & shortcuts
          </button>
        </div>
      </aside>
    </>
  )
}

function DetailPanel({
  node,
  onClose,
}: {
  node: NeuralNode
  onClose: () => void
}) {
  return (
    <aside className="detail-panel absolute bottom-4 right-4 top-4 z-30 flex w-[330px] flex-col overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#0a0a18]/80 shadow-[-24px_0_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl max-lg:bottom-3 max-lg:left-3 max-lg:right-3 max-lg:top-auto max-lg:w-auto">
      <div className="relative h-24 shrink-0 overflow-hidden border-b border-white/[0.06] bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-400/10">
        <div
          className="absolute left-8 top-8 h-20 w-20 rounded-full blur-2xl"
          style={{ backgroundColor: `${node.color}88` }}
        />

        <div className="absolute inset-0 neural-grid opacity-30" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/20 p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
          aria-label="Close detail panel"
        >
          <X size={15} />
        </button>

        <div className="absolute bottom-4 left-5 flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full shadow-[0_0_12px_currentColor]"
            style={{ color: node.color, background: node.color }}
          />

          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Neural object
          </span>
        </div>
      </div>

      <div className="overflow-y-auto p-5">
        <div
          className={`mb-4 inline-flex rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${categoryStyles[node.category]}`}
        >
          {categoryLabels[node.category]}
        </div>

        <h2 className="mb-3 text-[23px] font-bold leading-[1.15] tracking-[-0.035em] text-white">
          {node.title}
        </h2>

        <p className="text-[11px] leading-[1.75] text-white/45">
          {node.summary}
        </p>

        <div className="my-5 grid grid-cols-3 gap-2 border-y border-white/[0.06] py-4">
          {[
            ["Strength", `${node.strength}%`],
            ["Links", String(node.connections)],
            ["Created", node.date.slice(0, 7)],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 text-[9px] text-white/25">{label}</div>
              <div className="text-[11px] font-medium text-white/75">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/25">
          Semantic tags
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {node.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-white/[0.045] px-2.5 py-1.5 text-[9px] text-white/45"
            >
              #{tag}
            </span>
          ))}
        </div>

        <button className="group flex w-full items-center justify-between rounded-xl border border-violet-400/20 bg-violet-400/[0.09] px-4 py-3 text-[10px] font-medium text-violet-200 transition hover:bg-violet-400/[0.15]">
          Open full memory
          <ChevronRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </aside>
  )
}

export default function App() {
  const [activeNav, setActiveNav] = useState("Dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [year, setYear] = useState<2024 | 2025 | 2026>(2026)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<NeuralNode | null>(null)

  const visibleNodes = useMemo(
    () => neuralNodes.filter((node) => node.year <= year),
    [year],
  )

  const visibleIds = useMemo(
    () => new Set(visibleNodes.map((node) => node.id)),
    [visibleNodes],
  )

  const visibleLinks = useMemo(
    () =>
      neuralLinks.filter((link) => {
        const source =
          typeof link.source === "string" ? link.source : link.source.id
        const target =
          typeof link.target === "string" ? link.target : link.target.id

        return visibleIds.has(source) && visibleIds.has(target)
      }),
    [visibleIds],
  )

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) return []

    return neuralNodes
      .filter(
        (node) =>
          node.title.toLowerCase().includes(normalized) ||
          node.tags.some((tag) => tag.includes(normalized)),
      )
      .slice(0, 5)
  }, [query])

  const selectSearchResult = (node: NeuralNode) => {
    setYear(node.year)
    setSelected(node)
    setActiveNav("Neural Space")
    setQuery("")
  }

  return (
    <div className="min-h-dvh overflow-hidden bg-[#050610] text-white">
      <Sidebar
        active={activeNav}
        onChange={(page) => {
          setActiveNav(page)
          setSelected(null)
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="relative h-dvh overflow-hidden md:ml-[236px]">
        {/* Cosmic background */}
        <div className="pointer-events-none absolute inset-0 cosmic-field" />

        <video
          className="cosmic-video pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/cosmic-reference.png"
          aria-hidden="true"
        >
          <source src="/assets/cosmic-reference.mp4" type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 cosmic-nebula" />
        <div className="pointer-events-none absolute inset-0 cosmic-vignette" />
        <div className="pointer-events-none absolute inset-0 neural-grid opacity-[0.13]" />
        <div className="pointer-events-none absolute left-[30%] top-[20%] h-[40vw] w-[40vw] rounded-full bg-violet-700/[0.07] blur-[100px]" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[-5%] h-[35vw] w-[35vw] rounded-full bg-cyan-500/[0.05] blur-[100px]" />

        {/* Main page content */}
        {activeNav === "Dashboard" ? (
          <Dashboard onNavigate={setActiveNav} />
        ) : activeNav === "Neural Space" ? (
          <>
            <NeuralGraph
              nodes={visibleNodes}
              links={visibleLinks}
              selectedId={selected?.id ?? null}
              onSelect={setSelected}
            />

            {/* Year selector */}
            <div className="pointer-events-none absolute bottom-5 left-4 z-20 flex flex-col gap-2 md:bottom-6 md:left-6">
              <div className="pointer-events-auto flex w-fit items-center gap-1 rounded-xl border border-white/[0.08] bg-[#090a16]/70 p-1 backdrop-blur-xl">
                {[2024, 2025, 2026].map((item) => (
                  <button
                    key={item}
                    onClick={() => setYear(item as 2024 | 2025 | 2026)}
                    className={`rounded-lg px-3 py-2 text-[9px] font-medium tracking-[0.08em] transition ${
                      year === item
                        ? "bg-white/[0.09] text-white shadow-[0_0_18px_rgba(139,92,246,0.15)]"
                        : "text-white/25 hover:text-white/55"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="hidden items-center gap-2 px-2 text-[8px] uppercase tracking-[0.17em] text-white/20 sm:flex">
                <span>{visibleNodes.length} visible memories</span>
                <span className="h-px w-5 bg-white/10" />
                <span>Orbit to explore</span>
              </div>
            </div>

            {/* Network statistics */}
            {!selected && (
              <div className="pointer-events-none absolute bottom-6 right-5 z-20 hidden w-[180px] space-y-2 lg:block">
                <div className="stat-card">
                  <div className="mb-2 flex items-center justify-between text-[8px] uppercase tracking-[0.17em] text-white/25">
                    Network density
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_9px_#67e8f9]" />
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold tracking-[-0.05em]">
                      84.2
                    </span>
                    <span className="text-[8px] text-emerald-300/60">
                      +4.8%
                    </span>
                  </div>
                </div>

                <div className="stat-card flex items-center justify-between">
                  <div>
                    <div className="mb-1 text-[8px] uppercase tracking-[0.17em] text-white/25">
                      Connections
                    </div>
                    <div className="text-[13px] font-medium text-white/80">
                      {visibleLinks.length}
                    </div>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-300/15 bg-violet-400/[0.08]">
                    <Network size={13} className="text-violet-300" />
                  </div>
                </div>
              </div>
            )}

            {!selected && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="mb-1 text-[7px] font-medium uppercase tracking-[0.3em] text-white/15">
                  Memory star
                </div>
                <div className="text-[9px] text-white/25">
                  Select an orbiting memory
                </div>
              </div>
            )}

            {selected && (
              <DetailPanel
                node={selected}
                onClose={() => setSelected(null)}
              />
            )}
          </>
        ) : (
          <div className="relative z-10 flex h-full items-center justify-center p-8 text-center">
            <div className="max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl">
              <div className="mb-3 text-xl font-semibold text-white">
                {activeNav}
              </div>
              <p className="text-sm leading-6 text-white/45">
                This section is coming soon. We're building your MindVault
                workspace one feature at a time.
              </p>
              <button
                onClick={() => setActiveNav("Dashboard")}
                className="mt-6 rounded-xl border border-violet-400/20 bg-violet-400/[0.09] px-5 py-2.5 text-xs text-violet-200 transition hover:bg-violet-400/[0.15]"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between p-4 md:p-6">
          <div className="pointer-events-auto flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="glass-control p-3 md:hidden"
              aria-label="Open navigation"
            >
              <Menu size={17} />
            </button>

            <div className="hidden sm:block">
              <div className="mb-1 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-violet-300/55">
                <span className="h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_7px_#67e8f9]" />
                {activeNav === "Neural Space"
                  ? "Live neural field"
                  : "YOUR SECOND BRAIN"}
              </div>

              <h1 className="text-[18px] font-bold tracking-[-0.03em] text-white/90">
                {activeNav}
              </h1>
            </div>
          </div>

          <div className="pointer-events-auto relative w-[min(42vw,410px)] max-sm:w-[calc(100vw-132px)]">
            <div className="glass-control flex h-11 items-center gap-3 px-4">
              <Search size={15} className="shrink-0 text-white/35" />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your mind..."
                className="min-w-0 flex-1 bg-transparent text-[11px] text-white/80 outline-none placeholder:text-white/25"
              />

              <div className="hidden items-center gap-1 rounded-md border border-white/[0.07] px-1.5 py-1 text-[8px] text-white/25 sm:flex">
                <Command size={9} /> K
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-13 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0b18]/95 p-2 shadow-2xl backdrop-blur-2xl">
                {searchResults.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => selectSearchResult(node)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/[0.06]"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full shadow-[0_0_10px_currentColor]"
                      style={{ color: node.color, background: node.color }}
                    />

                    <span className="min-w-0 flex-1 truncate text-[10px] text-white/65">
                      {node.title}
                    </span>

                    <span className="text-[8px] uppercase tracking-wider text-white/20">
                      {node.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pointer-events-auto hidden items-center gap-2 lg:flex">
            <button className="glass-control p-3 text-white/40 transition hover:text-white">
              <Bell size={15} />
            </button>

            <button className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-2.5 backdrop-blur-xl">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-indigo-700 text-[9px] font-bold">
                AR
              </span>

              <span className="pr-1 text-[9px] text-white/55">
                Alex R.
              </span>
            </button>
          </div>
        </header>
      </main>
    </div>
  )
}
