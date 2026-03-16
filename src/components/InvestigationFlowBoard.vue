<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { VueFlow, Position, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import HakkenFlowNode from '@/components/HakkenFlowNode.vue'

const props = defineProps({
  graph: {
    type: Object,
    required: true
  }
})

const nodes = ref([])
const edges = ref([])
const { updateNodeInternals } = useVueFlow()
const selectedNodeId = ref(null)

const nodeTypes = {
  hakken: HakkenFlowNode
}

const typeOrder = ['person', 'username', 'email', 'phone', 'domain', 'ip', 'note']

const typeX = {
  person: 80,
  username: 340,
  email: 600,
  phone: 860,
  domain: 1120,
  ip: 1380,
  note: 1640
}

const getNodeText = (node) => {
  if (!node) return ''
  if (node.node_type === 'note') {
    return node.metadata?.content || node.label || 'Nota'
  }
  return node.value || node.label || 'Nodo'
}

const truncate = (text, max = 28) => {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}…` : text
}

const resetHighlightState = () => {
  nodes.value = nodes.value.map(node => ({
    ...node,
    data: {
      ...node.data,
      selected: false,
      connected: false,
      dimmed: false
    }
  }))

  edges.value = edges.value.map(edge => ({
    ...edge,
    class: 'hakken-flow-edge',
    animated: false
  }))
}

const applyHighlightState = () => {
  if (!selectedNodeId.value) {
    resetHighlightState()
    return
  }

  const connectedEdgeIds = new Set()
  const connectedNodeIds = new Set([selectedNodeId.value])

  edges.value.forEach(edge => {
    if (edge.source === selectedNodeId.value || edge.target === selectedNodeId.value) {
      connectedEdgeIds.add(edge.id)
      connectedNodeIds.add(edge.source)
      connectedNodeIds.add(edge.target)
    }
  })

  nodes.value = nodes.value.map(node => ({
    ...node,
    data: {
      ...node.data,
      selected: node.id === selectedNodeId.value,
      connected: node.id !== selectedNodeId.value && connectedNodeIds.has(node.id),
      dimmed: !connectedNodeIds.has(node.id)
    }
  }))

  edges.value = edges.value.map(edge => ({
    ...edge,
    class: connectedEdgeIds.has(edge.id)
      ? 'hakken-flow-edge is-active'
      : 'hakken-flow-edge is-dimmed',
    animated: connectedEdgeIds.has(edge.id)
  }))
}

const onNodeClick = ({ node }) => {
  selectedNodeId.value = node?.id || null
}

const onPaneClick = () => {
  selectedNodeId.value = null
}

const getRawNodeById = (nodeId) => {
  return (props.graph?.nodes || []).find(node => node.id === nodeId) || null
}

const formatGraphDate = (value) => {
  if (!value) return 'Sin fecha'
  try {
    return new Date(value).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return value
  }
}

const selectedRawNode = computed(() => {
  if (!selectedNodeId.value) return null
  return getRawNodeById(selectedNodeId.value)
})

const selectedNodeRelations = computed(() => {
  if (!selectedNodeId.value) return []

  const rawEdges = props.graph?.edges || []

  return rawEdges
    .filter(edge =>
      edge.from_node_id === selectedNodeId.value ||
      edge.to_node_id === selectedNodeId.value
    )
    .map(edge => {
      const isOutgoing = edge.from_node_id === selectedNodeId.value
      const otherNodeId = isOutgoing ? edge.to_node_id : edge.from_node_id
      const otherNode = getRawNodeById(otherNodeId)

      return {
        id: edge.id,
        relation: edge.relation_type || 'relacionado_con',
        direction: isOutgoing ? 'salida' : 'entrada',
        otherNodeType: otherNode?.node_type || 'nodo',
        otherNodeText: getNodeText(otherNode),
        note: edge.note || ''
      }
    })
})

const buildFlow = async (graph) => {
  const rawNodes = graph?.nodes || []
  const rawEdges = graph?.edges || []

  const grouped = {}
  typeOrder.forEach(type => {
    grouped[type] = rawNodes.filter(node => node.node_type === type)
  })

  const flowNodes = []
  const startY = 100
  const gapY = 120

  typeOrder.forEach(type => {
    grouped[type].forEach((node, index) => {
      flowNodes.push({
        id: node.id,
        type: 'hakken',
        position: {
          x: typeX[type] || 80,
          y: startY + index * gapY
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: true,
        data: {
          raw: node,
          title: type.toUpperCase(),
          text: truncate(getNodeText(node)),
          fullText: getNodeText(node)
        },
        class: `hakken-flow-node hakken-flow-node-${type}`
      })
    })
  })

  const flowEdges = rawEdges.map(edge => ({
    id: edge.id,
    source: edge.from_node_id,
    target: edge.to_node_id,
    type: 'smoothstep',
    animated: false,
    label: edge.relation_type,
    labelShowBg: true,
    labelBgBorderRadius: 12,
    labelBgPadding: [6, 4],
    class: 'hakken-flow-edge',
    style: {
      strokeWidth: 2
    },
    labelStyle: {
      fontWeight: 700
    },
    data: edge
  }))

  nodes.value = flowNodes
  edges.value = flowEdges

  await nextTick()
  updateNodeInternals(flowNodes.map(node => node.id))
  applyHighlightState()
}

watch(
  () => props.graph,
  async (graph) => {
    await buildFlow(graph)
  },
  { immediate: true, deep: true }
)

watch(selectedNodeId, () => {
  applyHighlightState()
})
</script>

<template>
  <div class="flow-layout">
    <div class="flow-shell">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        fit-view-on-init
        class="hakken-flow"
        :min-zoom="0.2"
        :max-zoom="1.5"
        :default-viewport="{ zoom: 0.75 }"
        @node-click="onNodeClick"
        @pane-click="onPaneClick"
      >
        <Background :gap="28" :size="1" color="rgba(0,255,153,0.08)" />
      </VueFlow>
    </div>

    <aside class="flow-sidepanel" :class="{ empty: !selectedRawNode }">
      <template v-if="selectedRawNode">
        <div class="flow-sidepanel-kicker">Nodo seleccionado</div>

        <div class="flow-sidepanel-type">
          {{ selectedRawNode.node_type.toUpperCase() }}
        </div>

        <div class="flow-sidepanel-value">
          {{ getNodeText(selectedRawNode) }}
        </div>

        <div v-if="selectedRawNode.node_type === 'note' && selectedRawNode.metadata?.content" class="flow-sidepanel-note">
          {{ selectedRawNode.metadata.content }}
        </div>

        <div class="flow-sidepanel-meta">
          Creado: {{ formatGraphDate(selectedRawNode.created_at) }}
        </div>

        <div class="flow-sidepanel-section-title">
          Relaciones conectadas
        </div>

        <div v-if="selectedNodeRelations.length" class="flow-sidepanel-relations">
          <div
            v-for="relation in selectedNodeRelations"
            :key="relation.id"
            class="flow-sidepanel-relation-item"
          >
            <div class="flow-sidepanel-relation-top">
              <span class="flow-sidepanel-direction">
                {{ relation.direction === 'salida' ? '→' : '←' }}
              </span>
              <span class="flow-sidepanel-relation-tag">
                {{ relation.relation }}
              </span>
            </div>

            <div class="flow-sidepanel-relation-node-type">
              {{ relation.otherNodeType.toUpperCase() }}
            </div>

            <div class="flow-sidepanel-relation-node-text">
              {{ relation.otherNodeText }}
            </div>

            <div v-if="relation.note" class="flow-sidepanel-relation-note">
              {{ relation.note }}
            </div>
          </div>
        </div>

        <div v-else class="flow-sidepanel-empty-inner">
          Este nodo no tiene relaciones todavía.
        </div>
      </template>

      <template v-else>
        <div class="flow-sidepanel-empty">
          <div class="flow-sidepanel-empty-title">Panel lateral</div>
          <div class="flow-sidepanel-empty-text">
            Haz clic en un nodo del grafo para ver sus detalles y sus conexiones.
          </div>
        </div>
      </template>
    </aside>
  </div>
</template>

<style scoped>
.flow-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1rem;
  align-items: stretch;
}

.flow-shell {
  width: 100%;
  height: 620px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 153, 0.14);
  background:
    radial-gradient(circle at top right, rgba(0,255,153,0.08), transparent 24%),
    radial-gradient(circle at bottom left, rgba(0,180,255,0.05), transparent 20%),
    rgba(255,255,255,0.015);
}

.flow-sidepanel {
  height: 620px;
  overflow-y: auto;
  border-radius: 18px;
  border: 1px solid rgba(0,255,153,0.14);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02));
  padding: 1rem;
  box-sizing: border-box;
}

.flow-sidepanel-kicker {
  color: #00ff99;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.55rem;
}

.flow-sidepanel-type {
  color: var(--text-primary, #fff);
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.flow-sidepanel-value {
  color: #ffffff;
  font-size: 1rem;
  line-height: 1.5;
  word-break: break-word;
  margin-bottom: 0.75rem;
}

.flow-sidepanel-note {
  color: var(--text-secondary, #b7b7b7);
  line-height: 1.55;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: rgba(180,120,255,0.06);
  border: 1px solid rgba(180,120,255,0.16);
}

.flow-sidepanel-meta {
  color: var(--text-secondary, #a1a1a1);
  font-size: 0.88rem;
  margin-bottom: 1rem;
}

.flow-sidepanel-section-title {
  color: #00ff99;
  font-size: 0.92rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.flow-sidepanel-relations {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.flow-sidepanel-relation-item {
  padding: 0.8rem;
  border-radius: 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0,255,153,0.08);
}

.flow-sidepanel-relation-top {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.4rem;
}

.flow-sidepanel-direction {
  color: #9ef7d0;
  font-weight: 800;
}

.flow-sidepanel-relation-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 800;
  color: #00ff99;
  background: rgba(0,255,153,0.08);
  border: 1px solid rgba(0,255,153,0.16);
}

.flow-sidepanel-relation-node-type {
  color: #9ef7d0;
  font-size: 0.76rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.flow-sidepanel-relation-node-text {
  color: #ffffff;
  line-height: 1.45;
  word-break: break-word;
}

.flow-sidepanel-relation-note {
  color: var(--text-secondary, #a1a1a1);
  font-size: 0.88rem;
  margin-top: 0.45rem;
}

.flow-sidepanel-empty,
.flow-sidepanel-empty-inner {
  color: var(--text-secondary, #a1a1a1);
  line-height: 1.55;
}

.flow-sidepanel-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flow-sidepanel-empty-title {
  color: #00ff99;
  font-size: 1rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.flow-sidepanel-empty-text {
  color: var(--text-secondary, #a1a1a1);
}

@media (max-width: 1100px) {
  .flow-layout {
    grid-template-columns: 1fr;
  }

  .flow-sidepanel {
    height: auto;
    min-height: 240px;
  }
}

:deep(.hakken-flow) {
  background:
    radial-gradient(circle at top right, rgba(0, 255, 153, 0.05), transparent 25%),
    rgba(255,255,255,0.01);
}

:deep(.vue-flow__node.hakken-flow-node-person) {
  border-color: rgba(0,255,153,0.38);
  box-shadow: 0 0 18px rgba(0,255,153,0.12);
}

:deep(.vue-flow__node.hakken-flow-node-username) {
  border-color: rgba(0,220,255,0.40);
  box-shadow: 0 0 18px rgba(0,220,255,0.10);
}

:deep(.vue-flow__node.hakken-flow-node-email) {
  border-color: rgba(90,160,255,0.40);
  box-shadow: 0 0 18px rgba(90,160,255,0.10);
}

:deep(.vue-flow__node.hakken-flow-node-phone) {
  border-color: rgba(255,196,0,0.42);
  box-shadow: 0 0 18px rgba(255,196,0,0.10);
}

:deep(.vue-flow__node.hakken-flow-node-domain) {
  border-color: rgba(0,255,180,0.40);
  box-shadow: 0 0 18px rgba(0,255,180,0.10);
}

:deep(.vue-flow__node.hakken-flow-node-ip) {
  border-color: rgba(255,130,80,0.40);
  box-shadow: 0 0 18px rgba(255,130,80,0.10);
}

:deep(.vue-flow__node.hakken-flow-node-note) {
  border-color: rgba(180,120,255,0.40);
  box-shadow: 0 0 18px rgba(180,120,255,0.10);
}

:deep(.vue-flow__node-default .vue-flow__node-default-label) {
  display: none;
}

:deep(.hakken-flow-node::before) {
  content: attr(data-title);
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #00ff99;
}

:deep(.hakken-flow-node) .node-inner-title {
  font-size: 11px;
}

:deep(.vue-flow__edge-path) {
  stroke: rgba(0,255,153,0.28);
  stroke-width: 2;
}

:deep(.vue-flow__edge-path) {
  stroke: rgba(0,255,153,0.55);
  stroke-width: 2.5;
  filter: drop-shadow(0 0 6px rgba(0,255,153,0.22));
}

:deep(.vue-flow__edge-textbg) {
  fill: rgba(5, 10, 12, 0.92);
  stroke: rgba(0,255,153,0.28);
  stroke-width: 1.2;
}

:deep(.vue-flow__edge-text) {
  fill: #baffea;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

:deep(.vue-flow__controls) {
  box-shadow: none;
  border: 1px solid rgba(0,255,153,0.14);
  border-radius: 12px;
  overflow: hidden;
}

:deep(.vue-flow__controls-button) {
  background: rgba(7, 15, 18, 0.94);
  color: #00ff99;
  border-bottom: 1px solid rgba(0,255,153,0.08);
}

:deep(.vue-flow__node-hakken) {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.vue-flow__edge-path) {
  transition:
    stroke 0.2s ease,
    opacity 0.2s ease,
    filter 0.2s ease,
    stroke-width 0.2s ease;
}

:deep(.hakken-flow-edge.is-active .vue-flow__edge-path) {
  stroke: rgba(0,255,153,0.85);
  stroke-width: 3;
  filter: drop-shadow(0 0 8px rgba(0,255,153,0.35));
}

:deep(.hakken-flow-edge.is-dimmed .vue-flow__edge-path) {
  opacity: 0.16;
  stroke: rgba(0,255,153,0.18);
}

:deep(.hakken-flow-edge.is-dimmed .vue-flow__edge-text),
:deep(.hakken-flow-edge.is-dimmed .vue-flow__edge-textbg) {
  opacity: 0.18;
}

:deep(.hakken-flow-edge.is-active .vue-flow__edge-textbg) {
  stroke: rgba(0,255,153,0.35);
}

:deep(.hakken-flow-edge.is-active .vue-flow__edge-text) {
  fill: #d6fff0;
}
</style>