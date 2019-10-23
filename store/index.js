import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		can_buy: true,
		buy_time:{
			id:0,
			start_time:'00:00',
			end_time:'23:59',
		},
		wx_userinfo: {},
		token: "",
		role: 2,
		let_days:0,
		
	},

	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
		},
		can_buy_change(state, provider) {
			if (provider === 1) {
				state.can_buy = true
			} else {
				state.can_buy = false;
			}
		},
		set_buy_time(state,provider){
			state.buy_time.id=provider.id;
			state.buy_time.start_time=provider.startTime;
			state.buy_time.end_time=provider.endTime;
		},
		set_wx_userinfo(state, provider) {
			state.wx_userinfo = provider;
		},
		set_token(state, provider) {
			state.token = provider;
		},
		set_role(state, provider) {
			state.role = provider;
		},
		change_let_days(state, provider){
			state.let_days = provider;
		}
		
	},
	actions: {

	},
	getters: { // getters
		getCan_buy_state(state) {
			return state.can_buy
		},
		get_wx_userinfo(state) {
			return state.wx_userinfo
		}
	}
})

export default store
