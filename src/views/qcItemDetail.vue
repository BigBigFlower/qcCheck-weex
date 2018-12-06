<template class="barDiv">
  <div class="qcItem">
    <div style="position: fixed; z-index: 2000;">
      <wxc-minibar title="质检单"
      background-color="#1fb16a"
      text-color="#FFFFFF"
      @wxcMinibarLeftButtonClicked="minibarLeftButtonClick">
     </wxc-minibar>
    </div>
    <scroller style="margin-top: 85px;height: 1040px;">
      <my-header title="到货信息" :isNarrow="true" @onShow="dhInfo = !dhInfo"></my-header>
      <list v-if="dhInfo" style="height: 425px;">
        <cell class="dhInfo"><text class="dhInfo_title">供应商</text><text class="content">{{item.vendorName}}</text></cell>
        <cell class="dhInfo"><text class="dhInfo_title">采购员</text><text class="content">{{buyerName}}</text></cell>
        <cell class="dhInfo"><text class="dhInfo_title">到货品名</text><text class="content">{{item.goodsName}}</text></cell>
        <cell class="dhInfo"><text class="dhInfo_title">到货机构</text><text class="content">{{item.orgName}}</text></cell>
        <cell class="dhInfo"><text class="dhInfo_title">到货数量</text><text class="content">{{item.deliveryNumber + item.purUnit}}</text></cell>
      </list>
      <div class="check-detail">
        <wxc-cell label="检验明细" :has-arrow="true" :has-bottom-border="false" :cell-style="{height: '85px', marginTop: '15px', marginBottom: '15px'}" has-vertical-indent @wxcCellClicked="onDetail"></wxc-cell>
        <wxc-cell label="检验图片" :has-arrow="true" :has-bottom-border="false" :cell-style="{height: '85px', marginBottom: '15px'}" has-vertical-indent @wxcCellClicked="onPic"></wxc-cell>
        <wxc-cell label="检验结果" :has-arrow="true" :has-bottom-border="false" :cell-style="{height: '85px'}" has-vertical-indent @wxcCellClicked="onResult"></wxc-cell>
      </div>
      <my-header title="质检意见" :isNarrow="true" @onShow="qualityAdvise = !qualityAdvise"></my-header>
      <div v-if="qualityAdvise" v-for="(item, index) in reviewList" :key="index" style="background-color: #F0F0F0">
        <div class="check_update" v-if="item.createTime"><text style="color: #999;">{{item.createTime}}</text></div>
        <div style="background-color: #FFFFFF">
          <div class="dhInfo" v-if="item.createUser">
            <text class="dhInfo_title">{{levelText[item.level]}}</text>
            <text class="icon iconfont warning" v-if="item.status !== 'A' && item.status !== 'B'" style=" width: 30px;color:#FF0000">&#xe848;</text>
            <text class="icon iconfont warning" v-if="item.status === 'A' || item.status === 'B'" style=" width: 30px;color:#00CC33">&#xe844;</text>
            <text class="advise_content">{{item.createUser}}</text>
          </div>
          <div class="dhInfo" v-if="item.qualityAdvise"><text class="dhInfo_title">处理意见</text><text class="content">{{qualityAdviseText[item.qualityAdvise]}}</text></div>
          <div class="dhInfo" v-if="item.level === 'B' && item.updateGoodsName"><text class="dhInfo_title">转级单品</text><text class="content">{{item.updateGoodsName}}</text></div>
          <div class="dhInfo" v-if="item.level === 'B' && item.updatePrice"><text class="dhInfo_title">单价</text><text class="content">{{item.updatePrice}}</text></div>
          <div class="dhInfo" v-if="item.remark"><text class="dhInfo_title">备注</text><text class="content">{{item.remark}}</text></div>
          <div class="dhInfo" v-if="item.level === 'C' && item.status"><text class="dhInfo_title">审核状态</text><text class="content">{{statusText[item.status]}}</text></div>
        </div>
      </div>
    </scroller>
    <div class="btn_tab">
      <div class="btn_item" style="background-color: #C0C0C0" @click="reCheck"><text>申请复检中</text></div>
      <div class="btn_item" style="background-color: rgb(31, 177, 106);" @click="handleAdvise"><text>填写处理意见</text></div>
    </div>
  </div>
</template>

<script>
import { WxcMinibar, WxcCell } from 'weex-ui'
import listHeader from '../components/listHeader'

const stream = weex.requireModule('stream')
const modal = weex.requireModule('modal')

export default {
  name: 'detail',
  components: {
    WxcMinibar,
    WxcCell,
    'my-header': listHeader
  },
  data () {
    return {
      buyerName: '',
      item: {},
      reviewList: [],
      cellStyle: {
        height: '85px',
        backgroundColor: '#F0F0F0',
        marginTop: '10px'
      },
      dhInfo: true,
      qualityAdvise: true,
      levelText: {'A': '一级审核人', 'B': '二级审核人', 'C': '三级审核人', 'D': '最终审核人'},
      qualityStatusText: {'F': '未质检(新建未完成)', 'A': '已完结', 'B': '待一级审核', 'C': '待二级审核', 'D': '待三级审核', 'E': '待最终审核', 'G': '已作废', 'H': '三级驳回', 'I': '最终驳回'},
      qualityAdviseText: {'A': '转级', 'B': '拒收', 'C': '挑选', 'D': '折价', 'E': '部分收货'},
      statusText: {'A': '审核通过', 'B': '审核驳回'}
    }
  },
  beforeCreate () {
    let domModule = weex.requireModule('dom')
    domModule.addRule('fontFace', {
      'fontFamily': 'iconfont',
      'src': "url('http://at.alicdn.com/t/font_945690_scekv5g7lw.ttf')"
    })
  },
  created () {
    this.getDhzjInfo()
  },
  methods: {
    // 导航栏
    minibarLeftButtonClick () {
    },
    // 获取列表
    getDhzjInfo (status) {
      let POST_URL = 'https://b2b.test.pagoda.com.cn/uniseq_micro_cgdd/dhzj/getDhzjInfo'
      stream.fetch({
        method: 'POST',
        url: POST_URL,
        type: 'json',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approve: 'A',
          itemId: '18417'
        })
      }, (res) => {
        if (!res.ok) {
          modal.toast({ message: res.data.errprMsg, duration: 1 })
          // this.postResult = "request failed"
        } else {
          let data = res.data.data
          this.buyerName = data.buyerName
          this.item = data.item
          this.reviewList = data.reviewList
        }
      }, (response) => {})
    },
    // 检验明细
    onDetail () {
      modal.toast({ message: '检验明细' })
    },
    // 检验图片
    onPic () {
      modal.toast({ message: '检验图片' })
    },
    // 检验结果
    onResult () {
      modal.toast({ message: '检验结果' })
    },
    // 重新申请复检
    reCheck () {
      modal.toast({ message: '申请复检' })
    },
    // 填写质检意见
    handleAdvise () {
      modal.toast({ message: '填写处理意见' })
    }
  }
}
</script>
<style scoped>
.qcItem {
  align-items: center;
}
.dhInfo {
  flex-direction: row;
  height: 85px;
  align-items: center;
  margin-left: 20px;
  border-bottom-width: 1px;
  border-color: #F0F0F0;
  z-index: 200;
}
.dhInfo_title {
  width: 200px;
  color: #999;
}
.content {
  margin-left: 55px !important;
  margin-left: 55px;
}
.advise_content {
  margin-left: 35px !important;
  margin-left: 35px;
}
.check-detail {
  background-color:#F0F0F0;
}
.iconfont {
  font-family: iconfont;
}
.warning {
  margin-left: -10px !important;
  margin-left: -10px;
}
.check_update {
  height: 60px;
  width: 400px;
  border-radius:10px;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  background-color: #D8D8D8;
  margin-top: 20px;
  margin-bottom: 10px;
  margin-left: 170px;
}
.btn_tab {
  flex-direction: row;
  justify-content: center;
  bottom: 0;
  position: fixed;
  /* position: fixed; */
  /* z-index: 2000; */
}
.btn_item {
  height: 90px;
  width: 375px;
  justify-content: center;
  align-items: center;
}
</style>
