// pages/tuideList/tuideList.js
import moment from 'moment';
import {getMinDate, getMaxDate} from '../../utils/calDate.js';
import Dialog from '../vant/dialog/dialog';
import Notify from '../vant/notify/notify';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultDate: [moment().format('YYYY-MM')],
    colorDate: [],
    list: [],
    minDate: getMinDate().getTime(),
    maxDate: getMaxDate().getTime(),
    isShowLoading: false,
    currentDate: moment().format('YYYY-MM'),
    openId: '',
    curUserOpenId: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const _this = this;
    wx.setNavigationBarTitle({
      title: `${options.name}-${options.area}`
    });
    wx.getStorage({
      key: 'userInfo',
      success: function(data) {
        if(data.data.openId) {
          _this.setData({
            curUserOpenId: data.data.openId
          })
        }
      }
    })
    if(options.openid) {
      this.setData({
        openId: options.openid
      }, () => {
        this.getDateList();
      })
    } else {
      this.getDateList();
    }
    
    

  },
  getDateList: async function() {
    let params = {
      monthDate: moment().format('YYYY-MM')
    }
    if(this.data.openId) {
      params.openId = this.data.openId
    }
    this.setData({isShowLoading: true});
    const res = await app.call({
      path:'/trip/findTrip',
      method: 'post',
      data: params
    })
    
    if(res.code === 1) {
      let defaultDate = []
      let colorDate = [];
      res.data.map(item => {
        let dateArr = item.date.split(',');
        defaultDate = [...defaultDate,...dateArr];
        dateArr.map(cItem => {
          colorDate.push({
            color: item.color,
            date: cItem
          })
        })
        return item;
      })
      this.setData({
        list: res.data,
        defaultDate: defaultDate,
        colorDate: colorDate,
        isShowLoading: false
      })
    }
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
        console.log('event',event.target.dataset.id);
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
  onScrollEnd: async function(event) {
    let date = event.detail.date;
    const formattedDate = moment(date, 'YYYY-MM').format('YYYY-MM');
    let params = {
      monthDate: formattedDate
    }
    if(this.data.openId) {
      params.openId = this.data.openId
    }

    
    this.setData({isShowLoading: true});
    const res = await app.call({
      path:'/trip/findTrip',
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

  addTuide() {
    if(this.data.openId) {
      wx.navigateTo({url : `../addTuide/addTuide?openid=${this.data.openId}`});
    } else {
      wx.navigateTo({url : `../addTuide/addTuide`});
    }
    
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