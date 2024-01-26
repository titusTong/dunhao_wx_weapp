const http = (url, params, method, credentials = true) => {
	// 参数类型校验
	if (typeof url !== 'string') {
		throw Error('api参数应为字符串')
	}
	if (typeof params !== 'object') {
		throw Error('params参数应为对象')
	}
	if (typeof method !== 'string') {
		throw Error('type参数应为字符串')
	}

	for (let key in params) {
		if (params[key] == null || params[key] == 'null') {
			delete params[key]
		}
	}
	// 默认请求线上后端域名；
	let apiUrl;
	let appId = wx.getAccountInfoSync().miniProgram.appId;


	if (appId === 'wxb645fe894de98aff') { // 测试环境
		apiUrl = `https://koa-8qe8-89486-7-1323848466.sh.run.tcloudbase.com/api/${url}`
	} else {
		console.log('找不到对应的appId', appId);
	}
	// 获取用户的登录key
	return new Promise((resolve, reject) => {
		let options = {
			url: apiUrl,
			method: method === 'post' ? 'post' : 'get',
			data: params,
			header: {
				'content-type': 'application/json',
			},
			success(res) {
				if (res.statusCode === 200) {
					if (!!res.data.version) {
						resolve(res.data)
					} else {
						resolve(res.data.data)
					}
				} else {
					// 请求失败
					wx.showToast({
						title: '请求失败',
						icon: 'none',
						duration: 1500,
					});
				}
			},
			fail(err) {
				// 请求失败
				wx.showToast({
					title: '请求失败',
					icon: 'none',
					duration: 1500,
				});
			}
		}

		if (credentials) {
			options.header = {
				'content-type': 'application/json',
				// 'wechatUserCode': wx.getStorageSync('userinfo') ? wx.getStorageSync('userinfo').user_code : '',
				// 'roomId': wx.getStorageSync('roomId'),
				// 'version': '2.11.0'
			}
		}

		wx.request(options)
	})
}





export default http;