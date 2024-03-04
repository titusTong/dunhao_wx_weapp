// custom-tab-bar/index.js
Component({
  data: {
    active: 0,
    list: [
      {
        icon: 'home-o',
        text: '首页',
        url: '/pages/list/list'
      },
      {
        icon: 'user-o',
        text: '我的',
        url: '/pages/myAdd/myAdd'
      },
    ]
  },
  methods: {
    onChange(event) {
      let _this = this;
      wx.switchTab({
        url: _this.data.list[event.detail].url,
        success: function(e) {
          const page = getCurrentPages().pop();
          page.onLoad();
        }
      })
      console.log('1',event.detail);
      // event.detail 的值为当前选中项的索引
      // wx.nextTick(() => {
      //   _this.setData({ active: event.detail });
      // })
      
    },
    init() {
      const page = getCurrentPages().pop();
      console.log('page', page);
      this.setData({
        active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
    }
  }
})