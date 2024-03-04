// pages/userMsg/userMsg.js
import Notify from '../vant/notify/notify';

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    area: '',
    inviteCode: '',
    userType: 2,
    columns: ['西欧', '南欧', '东欧' , '北欧', '英国', '希腊'],
    show: false,
    selectValue: '西欧',
  },

  methods: {
    
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onFieldChange(event) {
    let name = event.currentTarget.dataset.name;
    let value = event.detail;
    this.setData({
      [name]: value
    },() => {
      console.log(this.data.tripName)
    })
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      selectValue: value,
      show: false
    })
  },
  
  onClick: function(event) {
    this.setData({
      userType: event.target.dataset.value
    })
  },
  async submit() {
    
    
    if(!this.data.name) {
      Notify({backgroundColor: '#ad0000',message: '请输入名称', selector: '#custom-selector', context: this, duration: 1500});
      return;
    } else if(!this.data.inviteCode) {
      Notify({backgroundColor: '#ad0000',message: '请输入邀请码', selector: '#custom-selector', context: this, duration: 1500});
      return;
    }
    let params = {
      name: this.data.name,
      area: this.data.area ? this.data.selectValue + "-" +this.data.area : this.data.selectValue,
      inviteCode: this.data.inviteCode,
      userType: this.data.userType
    }
    const res = await app.call({
      path:'/author/register',
      method: 'post',
      data: params
    })
    if(res.code == 1) {
      Notify({type: 'success',message: '注册成功', selector: '#custom-selector', context: this, duration: 1500});
      // wx.navigateBack();
      wx.setStorage({
        key: 'userInfo',
        data: res.data 
      })
      if(this.data.userType == 1) {
        wx.switchTab({url : '../list/list'});
      } else {
        wx.redirectTo({url : `../tuideList/tuideList?name=${this.data.name}&area=${this.data.area}`});
      }
      
    } else {
      Notify({backgroundColor: '#ad0000',message: res.msg, selector: '#custom-selector', context: this, duration: 1500});
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '注册'
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

  },

  
})