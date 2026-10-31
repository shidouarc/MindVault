import { useEffect, useMemo, useRef, useState } from "react"
import ForceGraph3D from "react-force-graph-3d"
import * as THREE from "three"
import type { NeuralLink, NeuralNode } from "../data/neuralData"

type NeuralGraphProps = {
  nodes: NeuralNode[]
  links: NeuralLink[]
  selectedId: string | null
  onSelect: (node: NeuralNode) => void
}

function createGlowNode(node: NeuralNode, selected: boolean) {
  const size = node.isCore ? 256 : selected ? 180 : 128
  const glowColor = node.isCore ? "#83bfff" : node.color
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext("2d")

  if (context) {
    const center = size / 2
    const glow = context.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      center,
    )
    glow.addColorStop(0, "#ffffff")
    glow.addColorStop(0.08, "#ffffff")
    glow.addColorStop(node.isCore ? 0.12 : 0.2, glowColor)
    glow.addColorStop(node.isCore ? 0.42 : 0.48, `${glowColor}88`)
    glow.addColorStop(1, `${glowColor}00`)
    context.fillStyle = glow
    context.fillRect(0, 0, size, size)

    context.beginPath()
    context.arc(
      center,
      center,
      node.isCore ? 20 : selected ? 14 : 10,
      0,
      Math.PI * 2,
    )
    context.fillStyle = "#ffffff"
    context.shadowColor = glowColor
    context.shadowBlur = selected ? 24 : 14
    context.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: selected ? 1 : 0.88,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const sprite = new THREE.Sprite(material)
  const scale = node.isCore ? 44 : selected ? 26 : 13 + node.val
  sprite.scale.set(scale, scale, 1)
  if (!node.isCore) return sprite

  const core = new THREE.Group()
  core.add(sprite)
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(4.2, 24, 24),
    new THREE.MeshBasicMaterial({ color: "#fff9df" }),
  )
  core.add(star)
  const light = new THREE.PointLight("#66a8ff", 2.4, 240, 2)
  core.add(light)
  return core
}

export function NeuralGraph({
  nodes,
  links,
  selectedId,
  onSelect,
}: NeuralGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<any>(null)
  const [size, setSize] = useState({ width: 900, height: 700 })

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.max(320, Math.floor(entry.contentRect.width)),
        height: Math.max(420, Math.floor(entry.contentRect.height)),
      })
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const graphData = useMemo(
    () => ({
      nodes: nodes.map((node) => ({ ...node })),
      links: links.map((link) => ({ ...link })),
    }),
    [nodes, links],
  )

  useEffect(() => {
    const controls = graphRef.current?.controls()
    if (controls) {
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.22
    }
    const cameraTimer = window.setTimeout(
      () => graphRef.current?.zoomToFit(900, 36),
      1200,
    )
    return () => window.clearTimeout(cameraTimer)
  }, [graphData])

  useEffect(() => {
    const scene = graphRef.current?.scene()
    if (!scene) return

    const system = new THREE.Group()
    system.name = "mindvault-orbital-system"
    const radii = [48, 72, 96, 120, 144, 168]

    radii.forEach((radius, index) => {
      const geometry = new THREE.TorusGeometry(
        radius,
        index === 0 ? 0.22 : 0.13,
        8,
        192,
      )
      const material = new THREE.MeshBasicMaterial({
        color: index % 2 === 0 ? "#7957d8" : "#287ea7",
        transparent: true,
        opacity: 0.17 - index * 0.012,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const orbit = new THREE.Mesh(geometry, material)
      orbit.rotation.x = (index + 1 - 3.5) * 0.055
      orbit.rotation.y = (index + 1) % 2 === 0 ? -0.16 : 0.12
      system.add(orbit)
    })

    const debrisCount = 650
    const debrisPositions = new Float32Array(debrisCount * 3)
    for (let index = 0; index < debrisCount; index += 1) {
      const theta = index * 2.39996
      const radius = 205 + ((index * 47) % 250)
      debrisPositions[index * 3] = Math.cos(theta) * radius
      debrisPositions[index * 3 + 1] = (((index * 83) % 320) - 160) * 0.8
      debrisPositions[index * 3 + 2] = Math.sin(theta) * radius
    }
    const debrisGeometry = new THREE.BufferGeometry()
    debrisGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(debrisPositions, 3),
    )
    const debrisMaterial = new THREE.PointsMaterial({
      color: "#8ea4ff",
      size: 0.7,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
    const debris = new THREE.Points(debrisGeometry, debrisMaterial)
    system.add(debris)
    scene.add(system)

    let frame = 0
    const animate = () => {
      system.rotation.z += 0.00008
      debris.rotation.y -= 0.00014
      frame = window.requestAnimationFrame(animate)
    }
    frame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frame)
      scene.remove(system)
      system.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material]
          materials.forEach((item) => item.dispose())
        }
      })
    }
  }, [])

  const handleSelect = (node: NeuralNode) => {
    const controls = graphRef.current?.controls()
    if (controls) controls.autoRotate = false
    onSelect(node)
    const distance = 110
    const length = Math.hypot(node.x ?? 1, node.y ?? 1, node.z ?? 1)
    const ratio = 1 + distance / Math.max(length, 1)
    graphRef.current?.cameraPosition(
      {
        x: (node.x ?? 1) * ratio,
        y: (node.y ?? 1) * ratio,
        z: (node.z ?? 1) * ratio,
      },
      node,
      900,
    )
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      aria-label="Interactive neural knowledge graph"
    >
      <ForceGraph3D
        ref={graphRef}
        width={size.width}
        height={size.height}
        graphData={graphData}
        backgroundColor="rgba(0,0,0,0)"
        showNavInfo={false}
        nodeLabel={(node) =>
          `${(node as NeuralNode).title} · ${(node as NeuralNode).category}`
        }
        nodeThreeObject={(node) =>
          createGlowNode(
            node as NeuralNode,
            (node as NeuralNode).id === selectedId,
          )
        }
        nodeThreeObjectExtend={false}
        onNodeClick={(node) => handleSelect(node as NeuralNode)}
        linkColor={(link) => {
          const source = link.source as NeuralNode
          return `${source.color || "#7467ff"}55`
        }}
        linkWidth={(link) => ((link as NeuralLink).strength ?? 0.5) * 1.15}
        linkOpacity={0.48}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.4}
        linkDirectionalParticleSpeed={(link) =>
          0.002 + ((link as NeuralLink).strength ?? 0.5) * 0.002
        }
        linkDirectionalParticleColor={(link) => {
          const source = link.source as NeuralNode
          return source.color || "#8d7cff"
        }}
        d3AlphaDecay={0.035}
        d3VelocityDecay={0.3}
        warmupTicks={20}
        cooldownTicks={40}
        enableNodeDrag={false}
        enableNavigationControls
        onEngineStop={() => graphRef.current?.zoomToFit(700, 36)}
      />
    </div>
  )
}
