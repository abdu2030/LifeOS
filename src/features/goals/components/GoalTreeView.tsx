import { useEffect, useMemo, useRef, useState } from 'react'

import * as d3 from 'd3'

import type { GoalTreeNode } from '../types/goal'

type GoalTreeLayout = 'linear' | 'radial'

type GoalTreeViewProps = {
  goals: GoalTreeNode[]
  onSelectGoal?: (goalId: string) => void
  selectedGoalId?: string | null
}

type TreeDatum = {
  children: TreeDatum[]
  id: string
  progress: number
  status: string
  title: string
}

type TreePoint = {
  id: string
  x: number
  y: number
}

const defaultSize = { height: 460, width: 920 }

export function GoalTreeView({ goals, onSelectGoal, selectedGoalId }: GoalTreeViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const viewportRef = useRef<SVGGElement | null>(null)
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set())
  const [layout, setLayout] = useState<GoalTreeLayout>('radial')
  const [size, setSize] = useState(defaultSize)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.max(320, Math.floor(entry.contentRect.width))
      setSize({ height: nextWidth < 620 ? 420 : 460, width: nextWidth })
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current || !viewportRef.current) {
      return
    }

    const svg = d3.select(svgRef.current)
    const viewport = d3.select(viewportRef.current)
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.65, 2.4])
      .on('zoom', (event) => {
        viewport.attr('transform', event.transform.toString())
      })

    svg.call(zoom)
    return () => {
      svg.on('.zoom', null)
    }
  }, [layout])

  const treeData = useMemo(() => toTreeDatum(goals, collapsedIds), [collapsedIds, goals])
  const renderedTree = useMemo(() => buildRenderedTree(treeData, layout, size), [layout, size, treeData])

  function handleNodeClick(nodeId: string) {
    if (nodeId === 'lifeos-goals-root') {
      return
    }

    onSelectGoal?.(nodeId)

    setCollapsedIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (nextIds.has(nodeId)) {
        nextIds.delete(nodeId)
      } else {
        nextIds.add(nodeId)
      }

      return nextIds
    })
  }

  return (
    <section className="finance-panel goal-tree-panel">
      <div className="goal-tree-header">
        <div>
          <span className="auth-eyebrow">Goal Tree</span>
          <h2>See how outcomes connect</h2>
          <p>Switch layouts, pan the canvas, zoom in, and click nodes to expand or collapse branches.</p>
        </div>

        <div className="segmented-control goal-tree-toggle" aria-label="Goal tree layout">
          {(['radial', 'linear'] as GoalTreeLayout[]).map((treeLayout) => (
            <button
              className={layout === treeLayout ? 'active' : ''}
              key={treeLayout}
              onClick={() => setLayout(treeLayout)}
              type="button"
            >
              {treeLayout}
            </button>
          ))}
        </div>
      </div>

      <div className="goal-tree-canvas" ref={containerRef}>
        {!goals.length ? (
          <div className="goal-tree-empty">
            <strong>No tree yet</strong>
            <span>Create a goal below, then add milestones as child goals.</span>
          </div>
        ) : (
          <svg
            aria-label="Goal tree visualization"
            ref={svgRef}
            role="img"
            viewBox={`0 0 ${size.width} ${size.height}`}
          >
            <g ref={viewportRef}>
              {renderedTree.links.map((link) => (
                <path
                  className="goal-tree-link"
                  d={link.path}
                  key={`${link.source.id}-${link.target.id}`}
                />
              ))}

              {renderedTree.nodes.map((node) => (
                <g
                  className="goal-tree-node"
                  key={node.data.id}
                  onClick={() => handleNodeClick(node.data.id)}
                  style={{ transform: `translate(${node.point.x}px, ${node.point.y}px)` }}
                >
                  <circle
                    className={[
                      node.children.length ? 'has-children' : '',
                      selectedGoalId === node.data.id ? 'selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    r={node.radius}
                  />
                  <text dy="-0.25em">{node.data.title}</text>
                  <text className="goal-tree-node-meta" dy="1.15em">
                    {node.data.progress}% · {formatStatus(node.data.status)}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        )}
      </div>
    </section>
  )
}

function toTreeDatum(goals: GoalTreeNode[], collapsedIds: Set<string>): TreeDatum {
  const children = goals.map((goal) => mapGoalNode(goal, collapsedIds))

  if (children.length === 1) {
    return children[0]
  }

  return {
    children,
    id: 'lifeos-goals-root',
    progress: children.length
      ? Math.round(children.reduce((total, child) => total + child.progress, 0) / children.length)
      : 0,
    status: 'overview',
    title: 'LifeOS Goals',
  }
}

function mapGoalNode(goal: GoalTreeNode, collapsedIds: Set<string>): TreeDatum {
  return {
    children: collapsedIds.has(goal.id)
      ? []
      : goal.children.map((child) => mapGoalNode(child, collapsedIds)),
    id: goal.id,
    progress: goal.progress,
    status: goal.status,
    title: goal.title,
  }
}

function buildRenderedTree(treeData: TreeDatum, layout: GoalTreeLayout, size: typeof defaultSize) {
  const root = d3.hierarchy(treeData)
  const treeLayout = d3.tree<TreeDatum>()

  if (layout === 'radial') {
    treeLayout.size([360, Math.min(size.width, size.height) / 2 - 86])
  } else {
    treeLayout.size([size.height - 96, size.width - 240])
  }

  const renderedRoot = treeLayout(root)
  const nodes = renderedRoot.descendants().map((node) => ({
    children: node.children ?? [],
    data: node.data,
    point: getPoint(node, layout, size),
    radius: Math.max(11, 13 + node.data.progress / 15),
  }))

  const links = renderedRoot.links().map((link) => {
    const source = getPoint(link.source, layout, size)
    const target = getPoint(link.target, layout, size)

    return {
      path: layout === 'radial' ? radialPath(source, target) : linearPath(source, target),
      source,
      target,
    }
  })

  return { links, nodes }
}

function getPoint(
  node: d3.HierarchyPointNode<TreeDatum>,
  layout: GoalTreeLayout,
  size: typeof defaultSize,
): TreePoint {
  if (layout === 'radial') {
    const angle = ((node.x - 90) / 180) * Math.PI
    const radius = node.y

    return {
      id: node.data.id,
      x: size.width / 2 + radius * Math.cos(angle),
      y: size.height / 2 + radius * Math.sin(angle),
    }
  }

  return {
    id: node.data.id,
    x: node.y + 90,
    y: node.x + 48,
  }
}

function linearPath(source: TreePoint, target: TreePoint) {
  const midpoint = (source.x + target.x) / 2
  return `M${source.x},${source.y} C${midpoint},${source.y} ${midpoint},${target.y} ${target.x},${target.y}`
}

function radialPath(source: TreePoint, target: TreePoint) {
  return `M${source.x},${source.y} L${target.x},${target.y}`
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ')
}
