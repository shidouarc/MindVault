export type MemoryCategory = "memory" | "image" | "document" | "insight"

export type NeuralNode = {
  id: string
  title: string
  category: MemoryCategory
  year: 2024 | 2025 | 2026
  date: string
  summary: string
  tags: string[]
  strength: number
  connections: number
  color: string
  val: number
  orbit: number
  isCore: boolean
  x?: number
  y?: number
  z?: number
  fx?: number
  fy?: number
  fz?: number
}

export type NeuralLink = {
  source: string | NeuralNode
  target: string | NeuralNode
  strength: number
}

const categoryMeta: Record<MemoryCategory, {
  color: string
  titles: string[]
  tags: string[]
}> = {
  memory: {
    color: "#4f8dff",
    titles: [
      "First product hypothesis",
      "Kyoto street reflections",
      "Conversation with Amara",
      "Midnight launch retrospective",
      "The quiet after applause",
      "Summer cabin fragments",
      "A lesson in patience",
      "Notes from the observatory",
      "The day the prototype worked",
      "Morning train to Berlin",
      "An unexpected kindness",
      "Future self letter",
    ],
    tags: ["personal", "experience", "reflection"],
  },
  image: {
    color: "#a86cff",
    titles: [
      "Bioluminescent coast study",
      "Architecture of silence",
      "Neon rain collection",
      "Generative forms 07",
      "Desert geometry",
      "Orbital garden concept",
      "Analog contact sheets",
      "Northern lights palette",
      "Material studies: glass",
      "City shadows at 6:14",
      "Lunar habitat sketches",
      "Deep ocean references",
    ],
    tags: ["visual", "reference", "inspiration"],
  },
  document: {
    color: "#43dfa2",
    titles: [
      "Spatial computing brief",
      "Neural interface research",
      "Q4 strategy narrative",
      "Ambient systems manifesto",
      "Design principles v3",
      "Long-term product thesis",
      "Cognitive load field notes",
      "Distributed teams playbook",
      "Research synthesis: trust",
      "Autonomous agents report",
      "Signal and noise framework",
      "2026 operating model",
    ],
    tags: ["research", "work", "knowledge"],
  },
  insight: {
    color: "#45d8ff",
    titles: [
      "Constraints create character",
      "Memory is spatial",
      "Trust compounds quietly",
      "Attention shapes reality",
      "Elegance follows clarity",
      "Small rituals, large outcomes",
      "Interfaces should recede",
      "Curiosity outlives certainty",
      "Systems reveal incentives",
      "Momentum needs direction",
      "Meaning lives in connections",
      "The map changes the journey",
    ],
    tags: ["insight", "idea", "pattern"],
  },
}

const summaries: Record<MemoryCategory, string> = {
  memory:
    "A vivid personal moment preserved with its surrounding context, emotion, and the ideas it later influenced.",
  image:
    "A visual reference captured for its composition, atmosphere, material language, and potential future connections.",
  document:
    "A structured knowledge artifact containing research, decisions, and ideas worth resurfacing at the right moment.",
  insight:
    "A distilled pattern discovered across multiple memories—small enough to remember, strong enough to guide action.",
}

const categories = Object.keys(categoryMeta) as MemoryCategory[]

const orbitRadius = (orbit: number) => 24 + orbit * 24

function getOrbitalPosition(globalIndex: number) {
  if (globalIndex === 0) return { orbit: 0, x: 0, y: 0, z: 0 }

  const orbit = ((globalIndex - 1) % 6) + 1
  const slot = Math.floor((globalIndex - 1) / 6)
  const angle = (slot / 8) * Math.PI * 2 + orbit * 0.24
  const radius = orbitRadius(orbit)
  const tiltX = (orbit - 3.5) * 0.055
  const tiltY = orbit % 2 === 0 ? -0.16 : 0.12
  const baseX = Math.cos(angle) * radius
  const baseY = Math.sin(angle) * radius
  const rotatedY = baseY * Math.cos(tiltX)
  const rotatedZ = baseY * Math.sin(tiltX)

  return {
    orbit,
    x: baseX * Math.cos(tiltY) + rotatedZ * Math.sin(tiltY),
    y: rotatedY,
    z: -baseX * Math.sin(tiltY) + rotatedZ * Math.cos(tiltY),
  }
}

export const neuralNodes: NeuralNode[] = categories.flatMap(
  (category, categoryIndex) =>
    categoryMeta[category].titles.map((title, index) => {
      const globalIndex = categoryIndex * 12 + index
      const position = getOrbitalPosition(globalIndex)
      const year = (2024 + Math.floor(globalIndex / 16)) as 2024 | 2025 | 2026
      const month = String(((globalIndex * 5 + 2) % 12) + 1).padStart(2, "0")
      const day = String(((globalIndex * 7 + 8) % 27) + 1).padStart(2, "0")
      return {
        id: `node-${globalIndex + 1}`,
        title,
        category,
        year,
        date: `${year}-${month}-${day}`,
        summary: summaries[category],
        tags: categoryMeta[category].tags,
        strength: 72 + ((globalIndex * 11) % 28),
        connections: 3 + ((globalIndex * 7) % 8),
        color: categoryMeta[category].color,
        val: 4 + ((globalIndex * 3) % 5),
        orbit: position.orbit,
        isCore: globalIndex === 0,
        x: position.x,
        y: position.y,
        z: position.z,
        fx: position.x,
        fy: position.y,
        fz: position.z,
      }
    }),
)

export const neuralLinks: NeuralLink[] = neuralNodes.flatMap((node, index) => {
  if (index === 0) {
    return [1, 7, 13, 19, 25, 31, 37, 43].map((target) => ({
      source: node.id,
      target: neuralNodes[target].id,
      strength: 0.82,
    }))
  }

  const orbit = node.orbit
  const nextOnOrbit = index + 6 < neuralNodes.length ? index + 6 : orbit
  const innerConnection = orbit === 1 ? 0 : index - 1
  const links: NeuralLink[] = [
    {
      source: node.id,
      target: neuralNodes[nextOnOrbit].id,
      strength: 0.42,
    },
    {
      source: node.id,
      target: neuralNodes[innerConnection].id,
      strength: 0.62 + (6 - orbit) * 0.03,
    },
  ]
  if (index % 5 === 0) {
    links.push({
      source: node.id,
      target: neuralNodes[((index + 17) % (neuralNodes.length - 1)) + 1].id,
      strength: 0.38,
    })
  }
  return links
})

export const categoryLabels: Record<MemoryCategory, string> = {
  memory: "Note",
  image: "Picture",
  document: "Document",
  insight: "Insight",
}
