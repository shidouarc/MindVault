
import {
  Brain,
  Image,
  FileText,
  Network,
  Plus,
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import { neuralNodes } from "../data/neuralData";

export function Dashboard({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const memories = neuralNodes.length;
  const notes = neuralNodes.filter(n => n.category === "memory").length;
  const images = neuralNodes.filter(n => n.category === "image").length;
  const documents = neuralNodes.filter(n => n.category === "document").length;

  const stats = [
    { label: "Total Memories", value: memories, icon: Brain, color: "text-violet-300" },
    { label: "Notes", value: notes, icon: FileText, color: "text-blue-300" },
    { label: "Images", value: images, icon: Image, color: "text-pink-300" },
    { label: "Documents", value: documents, icon: FileText, color: "text-emerald-300" },
  ];

  const recent = [...neuralNodes]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="relative z-10 h-full overflow-y-auto p-6 md:p-10">
      <div className="mb-8">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-violet-300/60">
          YOUR SECOND BRAIN
        </p>
        <h1 className="text-3xl font-bold text-white">
          Welcome to MindVault.
        </h1>
        <p className="mt-2 text-sm text-white/45">
          Your knowledge, memories and ideas — all in one place.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs text-white/45">{label}</span>
              <Icon size={19} className={color} />
            </div>
            <div className="text-3xl font-semibold text-white">{value}</div>
            <p className="mt-2 text-[10px] text-white/25">Stored in your vault</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-5 lg:grid-cols-3">
        <button
          onClick={() => onNavigate("Neural Space")}
          className="group rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-cyan-500/[0.04] p-6 text-left transition hover:border-violet-300/40 lg:col-span-2"
        >
          <div className="mb-5 flex items-center justify-between">
            <Network className="text-violet-300" size={23} />
            <ArrowUpRight className="text-white/40 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
          <h2 className="text-xl font-semibold text-white">Explore Neural Space</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
            Explore your memories through an interactive 3D network of connected ideas.
          </p>
          <span className="mt-5 inline-block text-xs text-violet-300">Enter Neural Space →</span>
        </button>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6">
          <Plus size={22} className="mb-5 text-cyan-300" />
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          <p className="mt-2 text-xs leading-5 text-white/40">
            Your workspace is ready for new memories.
          </p>
          <button
            onClick={() => onNavigate("Notes")}
            className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/70 transition hover:bg-white/10"
          >
            Explore Notes
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">Recent Memories</h2>
            <p className="mt-1 text-xs text-white/35">Recently added to your vault</p>
          </div>
          <Clock3 size={18} className="text-white/35" />
        </div>

        <div className="space-y-2">
          {recent.map(node => (
            <div key={node.id} className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.025] p-4">
              <div className="min-w-0">
                <p className="truncate text-sm text-white/80">{node.title}</p>
                <p className="mt-1 text-[10px] capitalize text-white/35">
                  {node.category} · {node.date}
                </p>
              </div>
              <span className="ml-3 text-xs text-violet-300/70">Memory</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
