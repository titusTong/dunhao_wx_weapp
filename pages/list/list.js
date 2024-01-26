// pages/list/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    searchValue: '',
    isShowLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log('options',options);
    wx.setNavigationBarTitle({
      title: '导游列表'
    });
    this.setData({isShowLoading: true})
    const res = await app.call({
      path:'/author/findUserByParams',
      method: 'post',
    })
    if(res.code === 1) {
      this.setData({
        list: res.data,
        isShowLoading: false
      })
    }

  },

  onSearch: async function(e) {
    console.log(e.detail);
    this.setData({isShowLoading: true})
    const res = await app.call({
      path:'/author/findUserByParams',
      method: 'post',
      data: {content: e.detail}
    })
    this.setData({isShowLoading: false})
    if(res.code === 1) {
      console.log('res', res);
      // this.data.list = res.data;
      // this.update();
      this.setData({
        list: res.data
      })
    }
  },
  onCancel: async function(e) {
    console.log(e.detail);
    this.setData({isShowLoading: true})
    const res = await app.call({
      path:'/author/findUserByParams',
      method: 'post',
    })
    this.setData({isShowLoading: false})
    if(res.code === 1) {
      this.setData({
        list: res.data
      })
    }
  },

  goTotuideList (event) {
    console.log('event.currentTarget.dataset', event.currentTarget.dataset);
    const {openid, name, area} = event.currentTarget.dataset;
    
    wx.navigateTo({url : `../tuideList/tuideList?openid=${openid}&name=${name}&area=${area}`});
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