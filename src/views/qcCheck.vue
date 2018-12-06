<template class="barDiv">
  <div class="qc_check">
    <div style="position: fixed; z-index: 200">
      <wxc-minibar title="到货质检审核"
      background-color="#1fb16a"
      text-color="#FFFFFF"
      @wxcMinibarLeftButtonClicked="minibarLeftButtonClick">
      </wxc-minibar>
      <div class="btn_tab">
        <div class="btn_item" :style="onCheckStyle"  @click="onCheck"><text>待审核</text></div>
        <div class="btn_item" :style="haveCheckStyle" @click="haveCheck"><text>已审核</text></div>
      </div>
    </div>
    <list style="background-color: #F8F8F8; margin-top: 180px;">
      <cell class="check_cell" v-for="(item, index) in checkLists" :key="index" @click="onDetail(item)">
        <div class="check_update"><text style="color: #999;">{{item.updatedTime}}</text></div>
        <div class="check_item">
          <div class="check_item_content"><text class="check_item_title">发货单号：</text><text class="list_content">{{item.invoiceNum}}</text></div>
          <div class="check_item_content"><text class="check_item_title">商品名称：</text><text class="list_content">{{item.goodsName}}</text></div>
          <div class="check_item_content"><text class="check_item_title">到货日期：</text><text class="list_content">{{item.estimatedTime}}</text></div>
          <div class="check_item_content"><text class="check_item_title">到货机构：</text><text class="list_content">{{item.orgName}}</text></div>
          <div class="check_item_content"><text class="check_item_title">质检员：</text><text class="list_content">{{item.inspector}}</text></div>
          <div class="check_item_content"><text class="check_item_title">质检意见：</text><text class="list_content">{{qualityResultText[item.qualityResult]}}</text></div>
        </div>
      </cell>
      <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
        <text class="indicator-text">Loading ...</text>
        <loading-indicator class="indicator"></loading-indicator>
      </loading>
    </list>
  </div>
</template>

<script>
import { WxcMinibar } from 'weex-ui'
import router from '../router/index.js'

const stream = weex.requireModule('stream')
const modal = weex.requireModule('modal')

export default {
  components: { WxcMinibar },
  data () {
    return {
      checkLists: [],
      qualityResultText: {'A': '正常入库', 'C': '转级', 'D': '拒收', 'E': '挑选', 'F': '折价'},
      onCheckStyle: { backgroundColor: '#D8D8D8' },
      haveCheckStyle: {},
      loadinging: false
    }
  },
  created () {
    this.queryInvoiceItemList('A')
  },
  methods: {
    // 导航栏
    minibarLeftButtonClick () {
    },
    // 待审核
    onCheck () {
      this.onCheckStyle['backgroundColor'] = '#E8E8E8'
      this.haveCheckStyle['backgroundColor'] = '#FFFFFF'
      this.queryInvoiceItemList('A')
    },
    // 已审核
    haveCheck () {
      this.haveCheckStyle['backgroundColor'] = '#E8E8E8'
      this.onCheckStyle['backgroundColor'] = '#FFFFFF'
      this.queryInvoiceItemList('B')
    },
    // 获取列表
    queryInvoiceItemList (status) {
      let POST_URL = 'https://b2b.test.pagoda.com.cn/uniseq_buyer_phone/uniseq_micro_cgdd/dhzj/queryInvoiceItemList'
      stream.fetch({
        method: 'POST',
        url: POST_URL,
        type: 'json',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          buyerCode: '211201609300011',
          buyerName: '苏嘉杰',
          buyerType: '02',
          orgCode: 'gzpszx',
          pageNo: 1,
          pageSize: 10,
          viewStatus: status
        })
      }, (res) => {
        if (!res.ok) {
          modal.toast({ message: res.data.errprMsg, duration: 1 })
          // this.postResult = "request failed"
        } else {
          this.checkLists = res.data.data
        }
      }, (response) => {})
    },
    // loading
    onloading (event) {
      this.loadinging = true
      setTimeout(() => {
        this.loadinging = false
      }, 2000)
    },
    // 查看订单详情
    onDetail (item) {
      router.push('/qcItemDetail')
    }
  }
}
</script>
<style scoped>
.qc_check {
  align-items: center;
}
.check_cell  {
  align-items: center;
}
.btn_tab {
  flex-direction: row;
  justify-content: center;
  z-index: 5000;
}
.btn_item {
  height: 90px;
  width: 375px;
  justify-content: center;
  align-items: center;
}
.check_item {
  background-color: #ffffff;
  width: 690px;
  height: 400px;
  margin-top: 10px;
  margin-bottom: 15px;
}
.check_update {
  height: 70px;
  width: 400px;
  border-radius:10px;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  background-color: #e3e3e3;
  margin-top: 25px;
}
.check_item_content {
  flex-direction: row;
  margin-top: 15px;
  margin-left: 20px;
}
.check_item_title {
  width: 200px;
  color: #999;
}
.loading {
    width: 750;
    display: -ms-flex;
    display: -webkit-flex;
    display: flex;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    align-items: center;
  }
  .indicator-text {
    color: #888888;
    font-size: 42px;
    text-align: center;
  }
  .indicator {
    margin-top: 16px;
    height: 40px;
    width: 40px;
    color: blue;
  }
</style>
