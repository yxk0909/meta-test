<script setup lang="ts">
import GridItem from './components/GridItem.vue'

import { nextTick, onMounted, ref } from 'vue'
import Masonry from 'masonry-layout'

const gridRef = ref()

const childRefs = ref<any[]>([])

const dataList = ref<Record<string, any>[]>([])

let masonry: any

let timer: any

let refreshTimer: any

const imgList = [
  new URL('@/assets/1.jpeg', import.meta.url).href,
  new URL('@/assets/2.jpg', import.meta.url).href,
  new URL('@/assets/3.jpg', import.meta.url).href,
  new URL('@/assets/4.jpeg', import.meta.url).href,
  new URL('@/assets/5.jpg', import.meta.url).href,
  new URL('@/assets/6.jpg', import.meta.url).href,
  new URL('@/assets/video.mp4', import.meta.url).href,
]

const subtitles = [
  '和平精英',
  '王者荣耀',
  '绝地求生',
  '欢乐斗地主',
  '开心消消乐',
  '梦幻西游',
  '特朗普马斯克互撕',
]

const initCom = () => {
  dataList.value = []
  getDataList()

  gridRef.value.addEventListener('scroll', () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      console.log('已滚动')
      if (isScrollBottom(gridRef.value)) {
        console.log('已滚动到底部');
        getDataList()
      }
      clearTimeout(timer)
      timer = null
    }, 300)
  })
}

const getDataList = () => {
  const len = dataList.value.length
  const url = new URL(window.location.href)
  const username = url.searchParams.get('username') || '鱼鱼鱼'
  const game = url.searchParams.get('game')

  const list = Array.from({ length: 10 }, (_, i) => {
    const num = getRandom(0, imgList.length)
    const title  = i % 3  === 0 ? '这个是比较长一点的标题这个是比较长一点的标题' : '标题'
    return {
      title: title + (i + 1 + len),
      subtitle: game || subtitles[num],
      banner: imgList[num],
      username: username,
      count: getRandom(1, 1000)
    }
  })

  dataList.value = dataList.value.concat(list)

  nextTick(() => {
    if (masonry) {
      const arr = childRefs.value.slice(-list.length).map(o => o.elRef)
      masonry.addItems(arr)
      refreshLayout()
    } else {
      initMasonry()
    }
  })
}

const initMasonry = () => {
  if (masonry) {
    refreshLayout()
    return
  }

  masonry = new Masonry('.grid', {
    itemSelector: '.grid-item',
    gutter: 0,
    percentPosition: true,
    horizontalOrder: true,
    stagger: 30,
    transitionDuration: 0
  })
}

const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const isScrollBottom = (el: HTMLElement) => {
  if (!el) return false;
  // console.log('scrollHeight: ', el.scrollHeight)
  // console.log('scrollTop: ', el.scrollTop)
  // console.log('clientHeight: ', el.clientHeight)
  const diff = el.scrollHeight - el.scrollTop - el.clientHeight
  console.log('diff: ', diff)
  if (diff === 0) return true
  if (diff < 0) return diff >= -5
  if (diff > 0) return diff <= 5
}

const refreshLayout = () => {
  if (refreshTimer) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    clearTimeout(refreshTimer)
    refreshTimer = null
    // masonry.reloadItems()
    masonry.layout()
  }, 100)
}

onMounted(initCom)
</script>

<template>
  <div ref="gridRef" class="container">
    <div class="grid">
      <grid-item
        v-for="(item, index) in dataList"
        :ref="(el: any) => (childRefs[index] = el)"
        :key="index"
        :item-data="item"
        @img-loaded="refreshLayout" />
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 16px 8px;
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
</style>
