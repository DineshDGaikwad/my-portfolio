// ─── Architecture Data Types ──────────────────────────────────────────────────

export type NodeType =
  | 'client'
  | 'api'
  | 'service'
  | 'database'
  | 'storage'
  | 'auth'
  | 'queue'
  | 'cache'
  | 'external'
  | 'ui'
  | 'system'

export interface ArchNode {
  id: string
  label: string
  sublabel?: string
  type: NodeType
  color: string
  // Position as percentage of viewBox (0-100)
  x: number
  y: number
  details: {
    title: string
    description: string
    tech: string[]
    role?: string
    decisions?: string[]
  }
}

export interface ArchEdge {
  id: string
  from: string
  to: string
  label?: string
  animated?: boolean
  style?: 'solid' | 'dashed'
}

export type ArchLevel = 'overview' | 'service' | 'detail'

export interface ArchLevel_Data {
  level: ArchLevel
  label: string
  description: string
  nodes: ArchNode[]
  edges: ArchEdge[]
}

export interface FlowStep {
  nodeId: string
  label: string
  duration: number // ms to pause on this step
}

export interface ArchitectureDiagram {
  projectId: string
  projectSlug: string
  projectTitle: string
  summary: string
  levels: ArchLevel_Data[]
  // Request flow simulation path
  flowSteps?: FlowStep[]
  // AI explanation context
  aiContext: string
}
