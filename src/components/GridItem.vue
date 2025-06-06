<script setup lang="ts">
import VideoPlayer from './VideoPlayer.vue'

import { computed, type PropType } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  itemData: {
    type: Object as PropType<Record<string, any>>,
    required: true
  }
})

const emit = defineEmits(['img-loaded'])

const isVideo = computed(() => {
  const url = props.itemData?.banner || ''
  if (!url) return false
  const lastIndex = url.lastIndexOf('.')
  const suffix = url.slice(lastIndex + 1).toLowerCase()
  const arr = ['mp4', 'avi', 'wmv', 'mpg', 'mpeg', 'swf', 'flv', 'rm', 'ram']
  return arr.includes(suffix)
})

const elRef = ref()

const emitImgLoaded = () => {
  emit('img-loaded')
}

defineExpose({ elRef })
</script>

<template>
  <div ref="elRef" class="grid-item">
    <div class="banner">
      <div  v-if="isVideo" class="video-container">
        <video-player
          :src="itemData.banner"
          @load="emitImgLoaded" />
      </div>

      <img
        v-else
        :src="itemData.banner"
        alt=""
        class="pic"
        @load="emitImgLoaded">
    </div>

    <div class="title">
      {{ itemData.title }}
    </div>

    <div class="sub-title">{{ itemData.subtitle }}</div>

    <div class="footer">
      <div class="left">
        <div class="avatar">
          <img src="@/assets/avatar.png" alt="" class="pic">
        </div>
        <div class="username">{{ itemData.username }}</div>
      </div>

      <div class="favorite">
        <img src="@/assets/fav.svg" alt="" class="icon">
        <span class="count">{{ itemData.count }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid-item {
  margin: 0 8px 32px;
  width: calc(50% - 16px);
  border-radius: 12px;
  overflow: hidden;

  .banner .pic {
    width: 100%;
    vertical-align: middle;
  }

  .video-container {
    width: 100%;
  }

  .title {
    margin-top: 16px;
    padding: 0 12px;
    font-size: 30px;
    font-weight: bold;
    color: #333;
  }

  .sub-title {
    padding: 0 12px;
    margin: 12px 0;
    font-size: 24px;
    color: #666;
  }

  .footer {
    padding: 0 12px;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .left {
      margin-right: 12px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;

      .avatar {
        margin-right: 12px;
        width: 48px;
        height: 48px;
        border-radius: 50%;

        .pic {
          width: 100%;
          height: 100%;
        }
      }

      .username {
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .favorite {
      .icon {
        margin-right: 8px;
        width: 24px;
        vertical-align: middle;
      }

      .count {
        vertical-align: middle;
      }
    }
  }
}
</style>