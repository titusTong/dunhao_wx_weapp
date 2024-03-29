// pages/list/list.js
import moment from 'moment';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    searchValue: '',
    isShowLoading: false,
    date: '',
    show: false,
    defaultDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
  },
  onShow(){
    console.log(111);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log('options',options);
    this.getTabBar().init()

    wx.setNavigationBarTitle({
      title: '导游列表'
    });
    this.setData({isShowLoading: true});
    
    const res = await app.call({
      path:'/author/getUser'
    })
    if(res.code == '-100') {
      wx.redirectTo({url : '../userMsg/userMsg'});
    } else if(res.code == '1') {
      wx.setStorage({
        key: 'userInfo',
        data: res.data 
      })
      if(res.data.userType == 1) {
        // wx.redirectTo({url : '../list/list'});
      } else {
        wx.redirectTo({url : `../tuideList/tuideList?name=${res.data.name}&area=${res.data.area}`});
      }
    }
    const data = await app.call({
      path:'/author/findUserByParams',
      method: 'post',
    })
    if(data.code === 1) {
      this.setData({
        list: data.data,
        isShowLoading: false
      })
    }

  },

  onDisplay(event) {
    console.log('event',event);
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date, isSubmit) {
    date = new Date(date);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if(month < 10) {
      month = '0' + month;
    } 
    if(day < 10) {
      day = '0' + day
    }
    if(isSubmit) {
      return `${date.getFullYear()}-${month}-${day}`;
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
    
  },
  onConfirm: async function(event) {
    const [start, end] = event.detail;
    this.setData({
      show: false,
      date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
    });
    const res = await app.call({
      path:'/author/findUserByParams',
      method: 'post',
      data: {content: this.data.searchValue, startTime: this.formatDate(start,1), endTime: this.formatDate(end,1)}
    })
    this.setData({isShowLoading: false})
    if(res.code === 1) {
      this.setData({
        list: res.data
      })
    }
  },
  onSearchCalendarCancel(event) {
    this.setData({
      defaultDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    })
  },
  onCalendarSearch: async function(e) {
    const res = await app.call({
      path:'/author/findUserByParams',
      method: 'post',
      data: {content: this.data.searchValue, startTime: '', endTime: ''}
    })
    this.setData({isShowLoading: false})
    if(res.code === 1) {
      this.setData({
        list: res.data
      })
    }
  },

  onSearch: async function(e) {
    this.setData({isShowLoading: true})
    const res = await app.call({
      path:'/author/findUserByParams',
      method: 'post',
      data: {content: e.detail}
    })
    this.setData({isShowLoading: false})
    if(res.code === 1) {
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