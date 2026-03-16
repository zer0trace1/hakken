<script setup>
import { ref, watch, nextTick } from 'vue'
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
}

watch(
  () => props.graph,
  async (graph) => {
    await buildFlow(graph)
  },
  { immediate: true, deep: true }
)
</script>

<template>
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
    >
        <Background :gap="28" :size="1" color="rgba(0,255,153,0.08)" />
        <!--<Controls position="bottom-left" />-->
    </VueFlow>
  </div>
</template>

<style scoped>
.flow-shell {
  width: 100%;
  height: 620px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 153, 0.14);
  background:
    radial-gradient(circle at top right, rgba(0,255,153,0.08), transparent 24%),
    radial-gradient(circle at bottom left, rgba(0,180,255,0.05), transparent 20%),
    rgba(255,255,255,0.015)
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

:deep(.hakken-flow-node) {
  position: relative;
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
</style>