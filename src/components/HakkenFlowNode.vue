<script setup>
import { Handle, Position } from '@vue-flow/core'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    class="hakken-node-card"
    :class="[
        `hakken-node-card-${data.raw.node_type}`,
        {
            'is-selected': data.selected,
            'is-connected': data.connected,
            'is-dimmed': data.dimmed
        }
    ]"
    :title="data.fullText"
  >
    <Handle
      type="target"
      :position="Position.Left"
      class="hakken-node-handle hakken-node-handle-target"
    />

    <div class="hakken-node-title">
      {{ data.raw.node_type.toUpperCase() }}
    </div>

    <div class="hakken-node-text">
      {{ data.text }}
    </div>

    <Handle
      type="source"
      :position="Position.Right"
      class="hakken-node-handle hakken-node-handle-target"
    />
  </div>
</template>

<style scoped>
.hakken-node-title {
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #00ff99;
}

.hakken-node-text {
  color: white;
  font-size: 14px;
  line-height: 1.35;
  word-break: break-word;
}

.hakken-node-card {
  width: 180px;
  min-height: 58px;
  box-sizing: border-box;
  border-radius: 14px;
  padding: 10px 12px;
  background: rgba(7, 15, 18, 0.96);
  color: #fff;
  border: 1px solid rgba(0,255,153,0.14);
  box-shadow: 0 0 22px rgba(0,255,153,0.10);
  position: relative;
  overflow: visible;
}

.hakken-node-handle {
  width: 10px;
  height: 10px;
  background: #00ff99;
  border: 2px solid rgba(0, 0, 0, 0.9);
  box-shadow: 0 0 10px rgba(0,255,153,0.35);
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
}

.hakken-node-handle-target {
  left: -7px;
}

.hakken-node-handle-source {
  right: -7px;
}

.hakken-node-card-person {
  border-color: rgba(0,255,153,0.38);
  box-shadow: 0 0 18px rgba(0,255,153,0.12);
}

.hakken-node-card-username {
  border-color: rgba(0,220,255,0.40);
  box-shadow: 0 0 18px rgba(0,220,255,0.10);
}

.hakken-node-card-email {
  border-color: rgba(90,160,255,0.40);
  box-shadow: 0 0 18px rgba(90,160,255,0.10);
}

.hakken-node-card-phone {
  border-color: rgba(255,196,0,0.42);
  box-shadow: 0 0 18px rgba(255,196,0,0.10);
}

.hakken-node-card-domain {
  border-color: rgba(0,255,180,0.40);
  box-shadow: 0 0 18px rgba(0,255,180,0.10);
}

.hakken-node-card-ip {
  border-color: rgba(255,130,80,0.40);
  box-shadow: 0 0 18px rgba(255,130,80,0.10);
}

.hakken-node-card-note {
  border-color: rgba(180,120,255,0.40);
  box-shadow: 0 0 18px rgba(180,120,255,0.10);
}

.hakken-node-card {
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease,
    transform 0.2s ease,
    filter 0.2s ease;
  cursor: pointer;
}

.hakken-node-card.is-selected {
  transform: scale(1.03);
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.08),
    0 0 28px rgba(0,255,153,0.28);
  filter: brightness(1.08);
}

.hakken-node-card.is-connected {
  box-shadow: 0 0 22px rgba(0,255,153,0.16);
  filter: brightness(1.02);
}

.hakken-node-card.is-dimmed {
  opacity: 0.32;
  filter: saturate(0.7);
}
</style>