// pages/myAdd/myAdd.js
import Dialog from '../vant/dialog/dialog';
import Notify from '../vant/notify/notify';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isShowLoading: false,
    searchValue: ''
  },
  onShow(){
    this.getTabBar().init()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '我负责的行程'
    });
    this.getTabBar().init();
    this.getDateList();
  },
  getDateList: async function(content) {
    let params = {
      content: content
    };
    this.setData({isShowLoading: true});
    const res = await app.call({
      path:'/trip/findAllTripByOperator',
      method: 'post',
      data: params
    })
    if(res.code === 1) {
      this.setData({
        list: res.data,
        isShowLoading: false
      })
      
    }
  },
  onSearch: async function(e) {
    this.getDateList(e.detail);
  },
  gotoDetail: function (event) {
    console.log('event', event);
    let id = event.currentTarget.dataset.id;
    if(this.data.openId) {
      wx.navigateTo({url : `../addTuide/addTuide?openid=${this.data.openId}&id=${id}`});
    } else {
      wx.navigateTo({url : `../addTuide/addTuide?id=${id}`});
    }
  },
  deleteTuide: function(event) {
    console.log('123',event);
    if(event.detail != 'right') return;
    Dialog.confirm({
      message: '是否确认删除此行程？',
    })
      .then(async () => {
        const res = await app.call({
          path:'/trip/delTrip',
          method: 'post',
          data: {id: `${event.target.dataset.id}`}
        })
        if(res.data == 1) {
          Notify({type: 'success',message: '删除成功', selector: '#custom-selector', context: this, duration: 1500});
          this.getDateList();
        } else {
          Notify({type: 'danger',message: '删除失败', selector: '#custom-selector', context: this, duration: 1500});
        }
      })
      .catch(() => {
        // on cancel
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    Dialog.close();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})