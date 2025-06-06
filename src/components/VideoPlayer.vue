<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import videojs from 'video.js'

defineOptions({
  name: 'VideoPlayerIndex',
  inheritAttrs: false
})

const props = defineProps({
  src: String
})

const emit = defineEmits(['load'])

const elRef = ref()

const videoRef = ref()

const playerWidth = ref()

const playerHeight = ref()

const isPlaying = ref(false)

let player: any = null

const initPlayer = () => {
  player = videojs(videoRef.value, {
    autoplay: false,
    controls: false,
    preload: 'metadata',
    sources: [{ src: props.src }]
  })

  player.on('loadedmetadata', () => {
    // 获取第一帧所在的时间戳，单位为秒
    let timestamp = player.seekable().end(0) < 5 ? 0 : 1
    // // 将视频移动到第一帧所在的位置
    player.currentTime(timestamp)

    // 重新调整播放器的大小
    const width = player.videoWidth()
    const height = player.videoHeight()
    const elWidth = elRef.value.clientWidth
    const radio = elWidth / width
    playerWidth.value = elWidth + 'px'
    playerHeight.value = height * radio + 'px'

    emit('load')
  })

  player.on('error', () => {
    player.dispose()
  })
}

const handleClick = () => {
  if (isPlaying.value) {
    player.pause()
    isPlaying.value = false
  } else {
    isPlaying.value = true
    player.play()
  }
}

onMounted(() => {
  initPlayer()
})

onBeforeUnmount(() => {
  if (player) player.dispose()
})
</script>

<template>
  <div
    ref="elRef"
    :style="{ width: playerWidth, height: playerHeight }"
    class="video-player">
    <video
      ref="videoRef"
      class="video-js" />

    <div
      v-if="!isPlaying"
      class="play-btn">
      <img src="@/assets/play.svg" alt="" class="icon">
    </div>

    <div class="mask" @click.stop="handleClick"></div>
  </div>
</template>

<style scoped lang="scss">
.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .video-js {
    width: 100%;
    height: 100%;
    background-color: #e1e1e1;
  }

  .play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 116px;
    height: 116px;
    border-radius: 50%;
    background-color: rgba(0,0,0,.8);
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      width: 56px;
    }
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
}
</style>