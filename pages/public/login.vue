<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack" v-if="showAuth"></view>
		<view class="right-top-sign"></view>
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<block v-if="showLoginButton">
				<view class="input-content">
					<view class="input-item">
						<text class="tit">账号</text>
						<input type="tex" :value="mobile" placeholder="请输入账号" maxlength="11" data-key="mobile" @input="inputChange" />
					</view>
					<view class="input-item">
						<text class="tit">密码</text>
						<input type="mobile" value="" placeholder="请输入密码" placeholder-class="input-empty" maxlength="20" :password='newPwdShow'
						 data-key="password" @input="inputChange" @confirm="toLogin" />
						<view class="ljAbsolute" @tap.stop="changeEyeState('newPwd')">
							<text class="cuIcon-attentionforbid" v-if="newPwdShow"></text>
							<text class="cuIcon-attentionfavor" v-else></text>
						</view>
					</view>
				</view>
				<button class="confirm-btn" @click="toLogin" :disabled="logining">下一步</button>
			</block>
			<block v-if="showAuth">
				<button class="confirm-btn margin-top-xl" open-type="getUserInfo" @getuserinfo="wxGetUserInfo" withCredentials="true">微信授权并登录</button>
			</block>
		</view>
		<view class="register-section">
			想成为代理？
			<text @click="toRegist">马上申请</text>
		</view>
		<!-- 申请弹窗 -->
		<view class="cu-modal" :class="modalName=='Image'?'show':''" @touchmove.stop.prevent="moveHandle">
			<view class="cu-dialog">
				<view class="cu-bar justify-end text-black">
					<view class="content text-bold">
						<!-- 申请提示 -->
						{{applicationGuide.title}}
					</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close "></text>
					</view>
				</view>
				<scroll-view scroll-y @touchmove.prevent>
					<view style="width: 100%;height: 400px;">
						<view class="padding-sm margin-bottom">
							<u-parse :content="applicationGuide.content" :imageProp='imageProp' @preview="preview" @navigate="navigate"></u-parse>
						</view>
					</view>
				</scroll-view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="hideModal">我知道了</view>
				</view>
			</view>
		</view>

	</view>
</template>
<script>
	import {
		mapMutations,
		mapState
	} from 'vuex';
	import uParse from '@/components/uParse/src/wxParse.vue'
	export default {
		components: {
			uParse
		},
		data() {
			return {
				mobile: '',
				password: '',
				logining: false,
				ready_back: false,
				modalName: null,
				applicationGuide: {},
				imageProp: {
					mode: 'aspectFit',
					padding: 0,
					lazyLoad: true,
					domain: "www.litiyingxiao.com"
				},
				showLoginButton: false,
				showAuth: false,
				current_openid: '',
				newPwdShow: true,
			}
		},
		onLoad(options) {
			var that = this;
			if (options.isFirst) {
				if (options.isFirst == 0) {
					this.ready_back = true;
				}
			}
			uni.showLoading({
				title: '本地登录信息校验中...'
			})
			setTimeout(() => {
				if (this.token != '') {
					var now_token = this.token
					uni.request({
						url: that.global_baseUrl + '/user_self/',
						header: {
							'Authorization': ' Token ' + now_token
						},
						method: "GET",
						success: (res) => {
							// 是否是超级管理员
							// 是否是业务员
							var temp_role = 2;
							if (res.data.is_superuser) {
								// 是超级管理员
								temp_role = 0;
								this.set_role(temp_role);
							} else {
								// 不是超级管理员
								if (res.data.is_staff) {
									temp_role = 1;
									this.set_role(temp_role);
								} else {
									// 是用户
									temp_role = 2;
									this.set_role(temp_role);
								}
							}
							that.logining = true;
							that.login(res.data);
							if (that.userInfo == null) {
								uni.showModal({
									showCancel: false,
									title: '提示',
									content: '本地的登录状态失效，请重新登录',
									confirmText: '重新输入',
									success: function(res) {
										that.showLoginButton = true;
									}
								});
							} else {
								uni.showToast({
									title: '登录成功',
									duration: 3000
								});
								uni.setStorageSync('local_token', that.token);
								if (that.role == 0 || that.role == 1) {
									that.showLoginButton = false;
									that.showAuth = true;
									uni.switchTab({
										url: '/pages/index/index'
									});
								} else {
									try {
										var date = new Date();
										var seperator1 = "-";
										var year = date.getFullYear();
										var month = date.getMonth() + 1;
										var strDate = date.getDate();
										if (month >= 1 && month <= 9) {
											month = "0" + month;
										}
										if (strDate >= 0 && strDate <= 9) {
											strDate = "0" + strDate;
										}
										var currentdate = year + seperator1 + month + seperator1 + strDate;
										let sDate1 = currentdate;
										let sDate2 = that.userInfo.end_time.substring(0, 10);
										let current_let_days = that.datedifference(sDate1, sDate2)
										if (current_let_days >= 0) {
											that.change_let_days(current_let_days);
											that.showLoginButton = false;
											that.showAuth = true;
											// uni.switchTab({
											// 	url: '/pages/index/index'
											// });
										} else {
											let content_text = '您的账号已过期' + Math.abs(current_let_days).toString() + '天，请联系工作人员处理！';
											uni.showModal({
												title: '提示',
												content: content_text,
												showCancel: false,
												success: function(res) {
													if (res.confirm) {
														uni.reLaunch({
															url: '/pages/public/login'
														})
													}
												}
											});
										}
									} catch (e) {
										that.logining = false;
										uni.showModal({
											showCancel: false,
											title: '提示',
											content: '本地的登录状态失效，请重新登录',
											confirmText: '重新输入',
											success: function(res) {
												that.showLoginButton = true;
											}
										});
									}

								}
							}
							uni.hideLoading();
						}
					});
				} else {
					uni.showModal({
						showCancel: false,
						title: '提示',
						content: '本地的登录状态失效，请重新登录',
						confirmText: '重新输入',
						success: function(res) {
							that.showLoginButton = true;
						}
					});
				}
				uni.hideLoading();
			}, 1000)

			this.getApplicationGuide();
		},
		computed: {
			...mapState(['token', 'role', 'userInfo', 'wx_userinfo'])
		},
		methods: {
			// 转成方法
			...mapMutations(['login', 'set_wx_userinfo', 'set_token', 'set_role', 'change_let_days']),
			changeEyeState(state) {
				var that = this;
				switch (state) {
					case 'newPwd':
						that.newPwdShow = !that.newPwdShow
						break;
					default:
						break;
				}

			},


			wxGetUserInfo: function(res) {
				var that = this;
				var now_token = that.token;
				if (!res.detail.iv) {
					uni.showToast({
						title: "您取消了授权,登录失败",
						icon: "none"
					});
					return false;
				} else {
					uni.getProvider({
						service: 'oauth',
						success: function(res) {
							if (res.provider[0] === 'weixin') {
								uni.login({
									provider: 'weixin',
									success: function(loginRes) {
										var token_cur = that.token
										uni.request({
											url: that.global_baseUrl + '/get_openid/',
											header: {
												'Authorization': ' Token ' + token_cur,
												'content-type': 'application/x-www-form-urlencoded'
											},
											data: {
												appid: 'wx6a6623e190d66015',
												secret: 'b1aacd070298e14396ea88df3b2f2577',
												code: loginRes.code
											},
											method: 'POST',
											success(res) {
												let temp_openid_t = res.data.openid
												that.current_openid = temp_openid_t
												if (that.token && that.current_openid != '') {
													var now_token = that.token
													uni.request({
														url: that.global_baseUrl + '/user_self/',
														header: {
															'Authorization': ' Token ' + now_token
														},
														method: "GET",
														success: (res) => {
															if (res.data.openid === '') {
																// 新帐号，绑定
																uni.request({
																	url: that.global_baseUrl + '/bind_openid/',
																	method: 'POST',
																	data: {
																		openid: that.current_openid
																	},
																	header: {
																		'Authorization': ' Token ' + now_token,
																		'content-type': 'application/x-www-form-urlencoded'
																	},
																	success: (res) => {
																		// 是否是超级管理员
																		// 是否是业务员
																		var temp_role = 2;
																		if (res.data.is_superuser) {
																			// 是超级管理员
																			temp_role = 0;
																			that.set_role(temp_role);
																		} else {
																			// 不是超级管理员
																			if (res.data.is_staff) {
																				temp_role = 1;
																				that.set_role(temp_role);
																			} else {
																				// 是用户
																				temp_role = 2;
																				that.set_role(temp_role);
																			}
																		}
																		that.logining = true;
																		that.login(res.data);
																		uni.showToast({
																			title: '登录成功',
																			duration: 3000
																		});
																		uni.switchTab({
																			url: '/pages/index/index'
																		});
																	}
																})
															} else {
																//判断是不是本账号
																// 不是本账号
																if (res.data.openid != temp_openid_t) {
																	uni.showModal({
																		showCancel: false,
																		title: '提示',
																		content: '此账号与您的微信信息不匹配！',
																		confirmText: '重新登录',
																		success: function(res) {
																			if (res.confirm) {
																				
																				uni.clearStorageSync('local_token');
																				that.set_token('')
																				if (uni.getStorageSync('local_token')) {
																					uni.clearStorageSync('local_token')
																				} else {
																					uni.reLaunch({
																						url: '/pages/public/login'
																					})
																				}

																			}
																		}
																	});
																} else {
																	// 是否是超级管理员
																	// 是否是业务员
																	var temp_role = 2;
																	if (res.data.is_superuser) {
																		// 是超级管理员
																		temp_role = 0;
																		that.set_role(temp_role);
																	} else {
																		// 不是超级管理员
																		if (res.data.is_staff) {
																			temp_role = 1;
																			that.set_role(temp_role);
																		} else {
																			// 是用户
																			temp_role = 2;
																			that.set_role(temp_role);
																		}
																	}
																	that.logining = true;
																	that.login(res.data);
																	// 是本账号
																	uni.showToast({
																		title: '登录成功',
																		duration: 3000
																	});
																	uni.switchTab({
																		url: '/pages/index/index'
																	});

																}
															}
															if (that.userInfo == null) {
																uni.showModal({
																	showCancel: false,
																	title: '提示',
																	content: '输入的账号或密码不正确！',
																	confirmText: '重新输入',
																	success: function(res) {}
																});
															} else {
																// uni.showToast({
																// 	title: '登录成功',
																// 	duration: 3000
																// });
																uni.setStorageSync('local_token', that.token);
																if (that.role == 0 || that.role == 1) {
																	that.showLoginButton = false;
																	that.showAuth = true;
																	uni.switchTab({
																		url: '/pages/index/index'
																	});
																} else {
																	var date = new Date();
																	var seperator1 = "-";
																	var year = date.getFullYear();
																	var month = date.getMonth() + 1;
																	var strDate = date.getDate();
																	if (month >= 1 && month <= 9) {
																		month = "0" + month;
																	}
																	if (strDate >= 0 && strDate <= 9) {
																		strDate = "0" + strDate;
																	}
																	var currentdate = year + seperator1 + month + seperator1 + strDate;
																	let sDate1 = currentdate;
																	let sDate2 = that.userInfo.end_time.substring(0, 10);
																	let current_let_days = that.datedifference(sDate1, sDate2)
																	if (current_let_days >= 0) {
																		that.change_let_days(current_let_days);
																		that.showLoginButton = false;
																		that.showAuth = true;
																		uni.switchTab({
																			url: '/pages/index/index'
																		});
																	} else {
																		let content_text = '您的账号已过期' + Math.abs(current_let_days).toString() + '天，请联系工作人员处理！';
																		uni.showModal({
																			title: '提示',
																			content: content_text,
																			showCancel: false,
																			success: function(res) {
																				if (res.confirm) {
																					uni.reLaunch({
																						url: '/pages/public/login'
																					})
																				}
																			}
																		});
																	}
																}
															}

														}
													});
												}

											}
										})
										uni.showLoading({
											title: "登录中..."
										})

										setTimeout(() => {
											// that.showLoginButton = true;
											uni.hideLoading();
										}, 700)
									}
								});
							}
						}
					});
				}

			},


			// 解决蒙层滚动问题
			moveHandle() {
				return;
			},
			getApplicationGuide() {
				uni.request({
					url: this.global_baseUrl + '/applicationguidance/',
					method: "GET",
					success: (res) => {
						this.applicationGuide = res.data[0];
					}
				});
			},
			hideModal(e) {
				this.modalName = null
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			toRegist() {
				this.modalName = 'Image'

			},
			datedifference(sDate1, sDate2) {
				var dateSpan,
					tempDate,
					iDays;
				sDate1 = Date.parse(sDate1);
				sDate2 = Date.parse(sDate2);
				dateSpan = sDate2 - sDate1;
				iDays = Math.floor(dateSpan / (24 * 3600 * 1000));

				return iDays
			},
			async toLogin() {
				var that = this;
				const {
					mobile,
					password
				} = this;
				if (this.mobile == '' || this.password == '') {
					uni.showModal({
						showCancel: false,
						title: '提示',
						content: '输入的账号或密码不能为空！',
						confirmText: '重新输入',
						success: function(res) {
							if (res.confirm) {

							}
						}
					});
				} else {
					var user_data = {
						username: mobile,
						password: password
					}
					uni.showLoading({
						title: '正在验证...'
					});
					uni.request({
						url: this.global_baseUrl + '/api/token/',
						data: user_data,
						method: "POST",
						success: (res) => {
							if (res.data.access) {
								this.set_token(res.data.access);
								if (that.token) {
									setTimeout(() => {
										uni.hideLoading();
									}, 600)
									uni.showToast({
										icon: 'none',
										title: '验证成功！'
									});
									that.showLoginButton = false;
									that.showAuth = true;
								} else {

								}

							} else {
								uni.hideLoading();
								uni.showModal({
									showCancel: false,
									title: '提示',
									content: '输入的账号或密码不正确！',
									confirmText: '重新输入',
									success: function(res) {}
								});
							}
						},
					});

				}
			}
		},
	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		position: relative;

		.ljAbsolute {
			position: absolute;
			right: 4px;
			top: 55%;
			font-size: 18px;
			width: 22px;
			height: 22px;
		}

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
