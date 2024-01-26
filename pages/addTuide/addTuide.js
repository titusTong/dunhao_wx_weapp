// pages/addTuide/addTuide.js
import Notify from '../vant/notify/notify';
import moment from 'moment';
import { getAllDate } from '../../utils/getFullDate.js';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tripName: '',
    guideType: '1',
    operator: '',
    date: '',
    inArea: '',
    outArea: '',
    remark: '',
    // guide: '',
    guideOpenId: '',
    // createPersonOpId: ''
    show: false,
    userType: 1,
    disabledDate: [],

    isDisabled: true,
    id: '',
    defaultDate: []
    
    
    
  },

  methods: {
    
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
  onClick: function(event) {
    this.setData({
      guideType: event.target.dataset.value
    })
  },
  
  async submit() {
    console.log(this.data);
    if(!this.data.tripName) {
      Notify({backgroundColor: '#ad0000',message: '请输入团名称', selector: '#custom-selector', context: this, duration: 1500});
      return;
    } else if(!this.data.operator) {
      Notify({backgroundColor: '#ad0000',message: '请输入操作人', selector: '#custom-selector', context: this, duration: 1500});
      return;
    }  else if(!this.data.inArea) {
      Notify({backgroundColor: '#ad0000',message: '请输入入境点', selector: '#custom-selector', context: this, duration: 1500});
      return;
    } else if(!this.data.outArea) {
      Notify({backgroundColor: '#ad0000',message: '请输入出境点', selector: '#custom-selector', context: this, duration: 1500});
      return;
    } else if(!this.data.date) {
      Notify({backgroundColor: '#ad0000',message: '请选择团期', selector: '#custom-selector', context: this, duration: 1500});
      return;
    }
    let params = {
      tripName: this.data.tripName,
      guideType: this.data.guideType,
      operator: this.data.operator,
      date: getAllDate(this.data.date[0], this.data.date[1]).toString(),
      inArea: this.data.inArea,
      outArea: this.data.outArea,
      remark: this.data.remark,
      guideOpenId: this.data.guideOpenId,
    }
    let url = '/trip/createTrip';
    if(this.data.id) {
      url = '/trip/updateTrips';
      params.color = this.data.color;
      params.id = `${this.data.id}`;
    }
    const res = await app.call({
      path:url,
      method: 'post',
      data: params
    })
    if(res.code == 1) {
      Notify({type: 'success',message: '注册成功', selector: '#custom-selector', context: this, duration: 1500});
      const pages = getCurrentPages();
      const prePages = pages[pages.length - 2];
      prePages.getDateList();
      wx.navigateBack();
    } else {
      Notify({backgroundColor: '#ad0000',message: res.msg, selector: '#custom-selector', context: this, duration: 1500});
    }
  },

  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  
  formatDate(date) {
    date = new Date(date);
    date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    console.log(date);
    return date;
  },
  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      show: false,
      date: [this.formatDate(start),this.formatDate(end)],
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    let _this = this;
    wx.setNavigationBarTitle({
      title: '添加或编辑行程'
    });
    console.log('options', options.openid);
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {

        _this.setData({
          userType: res.data.userType,
          guideOpenId: options.openid ? options.openid : res.data.openId,
        }, () => {
          _this.getDateList(moment().format('YYYY-MM'))
        })
        if(options.id) {
          _this.getDetail(options.id)
          _this.setData({
            id: options.id
          })
        } else {
          _this.setData({
            isDisabled: false
          })
        }
      }
    })
  },

  getDetail: async function(id) {
    let _this = this;
    const res = await app.call({
      path:'/trip/getTripById',
      method: 'post',
      data: {id}
    })
    if(res.code == 1) {
      console.log(res.data);
      let dateArr = res.data.date.split(',');
      let defaultDate = [dateArr[0], dateArr[dateArr.length - 1]];
      wx.getStorage({
        key: 'userInfo',
        success: function(data) {
          if(data.data.openId == res.data.createPersonOpId) {
            _this.setData({
              isDisabled: false
            })
          }
        }
      })
      
      this.setData({
        ...res.data,
        date: defaultDate,
        defaultDate
      })
    }
  },

  onScrollEnd: async function(event) {
    let date = event.detail.date;
    const formattedDate = moment(date, 'YYYY-MM').format('YYYY-MM');
    this.getDateList(formattedDate)
    
  },

  getDateList: async function(day) {
    let params = {
      monthDate: day
    }
    if(this.data.guideOpenId) {
      params.openId = this.data.guideOpenId
    }
    this.setData({isShowLoading: true});
    const res = await app.call({
      path:'/trip/findTrip',
      method: 'post',
      data: params
    })
    
    if(res.code === 1) {
      let disabledDate = [];
      res.data.map(item => {
        if(item.id === this.data.id) return;
        let dateArr = item.date.split(',');
        disabledDate = [...disabledDate,...dateArr];
      })
      this.setData({
        isShowLoading: false,
        formatter: function(day) {
          let date = day.date;
          let dateMoment = moment(date).format('YYYY-MM-DD');
          if(disabledDate.indexOf(dateMoment) > -1) {
            day.type = 'disabled';
          }
          return day;
          
        },
      })
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

  },

  
})