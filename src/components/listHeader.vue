<template>
  <div>
    <div class="cell">
      <text class="title" style="color: #586c94;">{{myTitle}}</text>
      <div v-if="showNarrow">
        <text class="icon iconfont more" v-if="upNarrow" @click="isShow">&#xe7ed;</text>
        <text class="icon iconfont more" v-if="downNarrow" @click="isShow">&#xe7ee;</text>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'isHeader',
  props: ['title', 'isNarrow'],
  data () {
    return {
      myTitle: this.title,
      showNarrow: this.isNarrow,
      upNarrow: false,
      downNarrow: true
    }
  },
  methods: {
    isShow () {
      this.upNarrow = !this.upNarrow
      this.downNarrow = !this.downNarrow
      this.$emit('onShow')
    }
  }
}
</script>
<style>
.cell {
  background-color: #F0F0F0;
  flex-direction: row;
  height: 85px;
  align-items: center;
  border-color: #F0F0F0;
}
.title {
  /* font-size: 35px; */
  margin-left: 20px !important;
  margin-left: 20px;
}
.more {
  margin-left: 530px !important;
  margin-left: 530px;
}
.iconfont {
  font-family: iconfont;
}
</style>
