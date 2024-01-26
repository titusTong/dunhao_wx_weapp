import http from '../../utils/http.js';
var app = getApp();
Page({
	data: {
    defaultDate: ['2024-01-19', '2024-01-20', '2024-01-21','2024-01-22','2024-01-23','2024-01-24'],
    colorDate: [
      {date: '2024-01-19', color: 'red'},
      {date: '2024-01-20', color: 'red'},
      {date: '2024-01-21', color: 'red'},
      {date: '2024-01-22', color: 'yellow'},
      {date: '2024-01-23', color: 'green'},
      {date: '2024-01-24', color: 'green'}
    ],
    minDate: new Date(2023, 10, 1).getTime(),
    maxDate: new Date(2024, 10, 31).getTime(),
  },
  handleScroll: function(event) {
    console.log('event', event);
  },
	onLoad: async function (options) {
		wx.setNavigationBarTitle({
      title: '顿号排期'
    });
    const res = await app.call({
      path:'/author/getUser'
    })
    console.log('业务返回结果',res)
    if(res.code == '-100') {
      wx.redirectTo({url : '../userMsg/userMsg'});
    } else if(res.code == '1') {
      wx.setStorage({
        key: 'userInfo',
        data: res.data 
      })
      if(res.data.userType == 1) {
        wx.redirectTo({url : '../list/list'});
      } else {
        wx.redirectTo({url : `../tuideList/tuideList?name=${res.data.name}&area=${res.data.area}`});
      }
      
    }
  },
})