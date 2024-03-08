// pages/addTuide/addTuide.js
import Notify from '../vant/notify/notify';
import moment from 'moment';
import { getAllDate } from '../../utils/getFullDate.js';
const pdf = '../../static/imgs/pdf.png';
const jpg = '../../static/imgs/jpg.png';
const ppt = '../../static/imgs/ppt.png';
const word = '../../static/imgs/word.png';
const excel = '../../static/imgs/excel.png';
const buchangjianleixing = '../../static/imgs/buchangjianleixing.png';
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
    defaultDate: [],
    fileList: [],

    uploadLoading: false,
    showImg: false,
    imageUrl: '',

    // openLoading: false
    
    
    
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

  afterRead(event) {
    const { file } = event.detail;
    console.log('file', file);
    let newList = this.getFileType(file);
    this.setData({
      fileList: [...newList, ...this.data.fileList]
    }, () => {
      this.uploadToCloud();
    })
    
    
  },
  getFileType(arr) {
    let pptType = ['ppt','pptx','pot','potx','pps','ppsx','dps','dpt','pptm','potm','ppsm'];
    let excelType = ['xlsx','xls','csv','xlt','et','ett','xltx','xlsb','xlsm','xltm'];
    let docType = ['dotx','docm','dotm','docx', 'doc','dot', 'wps', 'wpt'];
    let imgType = ['jpg', 'png', 'gif', 'jpeg', 'bmp', 'tif'];
    let pdfType = ['pdf'];
    arr = arr.map(item => {
      let typeArr = item.name.split('.');
      let type = typeArr[typeArr.length - 1];
      item.fileType = type;
      console.log('type', type.toLocaleLowerCase());
      if(pdfType.indexOf(type.toLocaleLowerCase()) > -1) {
        item.icon = pdf;
      } else if(pptType.indexOf(type.toLocaleLowerCase())  > -1 ) {
        item.icon = ppt;
      } else if(excelType.indexOf(type.toLocaleLowerCase())  > -1 ) {
        item.icon = excel;
      } else if(docType.indexOf(type.toLocaleLowerCase())  > -1 ) {
        item.icon = word;
      } else if(imgType.indexOf(type.toLocaleLowerCase())  > -1 ) {
        item.icon = jpg;
      } else {
        item.icon = buchangjianleixing;
      }
      item.isSuccess = true;
      return item;
    });
    return arr;
  },
  clickPreview(event) {
    console.log('event', event);
  },
  async uploadToCloud() {
    
    const { fileList } = this.data;
    this.setData({
      uploadLoading: true
    })
    for(let i = 0; i < fileList.length; i ++) {
      let file = fileList[i];
      console.log('file', file);
      if(!file.isUpload) {
        let uploadTask = this.uploadFilePromise(file.name, file, (res) => {
          if(res.fileID) {
            file.fileID = res.fileID;
            file.isSuccess = true;
            file.isUpload = true;
          }
          this.setData({
            fileList
          })
          this.getIsAllUpload(fileList);
        }, (error) => {
          file.isSuccess = false;
          file.isUpload = true;
          this.setData({
            fileList
          })
          this.getIsAllUpload(fileList);
        });
        uploadTask.onProgressUpdate((res) => {
          file.progress = res.progress;
          this.setData({
            fileList
          })
        })
      }

      //检查是否全部上传

      
        
    }
  },
  deleteItem(event) {
    let idx = event.currentTarget.dataset.index;
    let fileList = this.data.fileList;
    fileList = fileList.filter((item, index) => index !== idx);
    console.log('fileList', fileList);
    this.setData({
      fileList
    })
  },
  onClose() {
    this.setData({
      showImg: false
    })
  },
  previewFile(event) {
    let fileID = event.currentTarget.dataset.fileid;
    let fileType = event.currentTarget.dataset.filetype;
    if(!fileID) return;
    // this.setData({
    //   openLoading: true
    // });
    wx.showLoading({
      title: '加载中',
    })
    let _this = this;
    wx.cloud.downloadFile({
      // 示例 url，并非真实存在
      fileID,
      
      success: function (res) {
        const filePath = res.tempFilePath;
        console.log('filePath', filePath);
        console.log('fileType', fileType);
        wx.openDocument({
          filePath,
          fileType,
          showMenu: true,
          success: function (res) {
            wx.hideLoading()
          },
          fail: function(error) {
            wx.hideLoading()
          }
        })
      }
    })
    
    
  },
  getIsAllUpload(fileList) {
    let isAllUpload = fileList.every(item => item.isUpload);
      if(isAllUpload) {
        this.setData({
          uploadLoading: false
        })
      }
  },
  uploadFilePromise(fileName, chooseResult, success, fail) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.url,
      config: {
        env: 'prod-5gaf0xgg89478f9e'
      },
      success,
      fail
    });
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
    if(this.data.fileList && this.data.fileList.some(item => !item.isSuccess)) {
      Notify({backgroundColor: '#ad0000',message: '请删除且重新上传失败的文件', selector: '#custom-selector', context: this, duration: 1500});
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
      fileList: this.data.fileList
    }
    let url = '/trip/createTrip';
    if(this.data.id) {
      url = '/trip/updateTrips';
      params.color = this.data.color;
      params.id = `${this.data.id}`;
      params.createPersonOpId= this.data.createPersonOpId;
    }
    const res = await app.call({
      path:url,
      method: 'post',
      data: params
    })
    if(res.code == 1) {
      // Notify({type: 'success',message: '注册成功', selector: '#custom-selector', context: this, duration: 1500});
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
    wx.cloud.init();
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