import Vue from 'vue'
import store from './store'
import App from './App'
// 全局都会用的请求
import uCharts from '@/components/u-charts/u-charts.js';
import Json from './Json' //测试用数据
const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type => {
	//模拟异步请求数据
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

const baseUrl = "https://www.litiyingxiao.com:9080";

Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {
	msg,
	json,
	prePage
};
Vue.prototype.uCharts = uCharts
Vue.prototype.global_baseUrl = baseUrl
Vue.prototype.check_statusCode=function(e)
{
	if (e == '401') {
		uni.showModal({
			title: '提示',
			content: '为了您的账户安全，需要重新验证登录',
			showCance: false,
			success: function(res) {
				if (res.confirm) {
					uni.redirectTo({
						url: '/pages/public/login?isFirst=0'
					})
				}
			}
		});
	}
};
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
