<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>

		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				密码请牢记，如有遗失，请联系专员处理！
			</view>
			<block>
				<view class="input-content">
					<view class="input-item">
						<text class="tit">原密码</text>
						<input type="tex" placeholder="请输入原密码" maxlength="20" data-key="oldPwd" :password='oldPwdShow' @input="inputChange" />
						<view class="ljAbsolute" @tap.stop="changeEyeState('oldPwd')">
							<text class="cuIcon-attentionforbid" v-if="oldPwdShow"></text>
							<text class="cuIcon-attentionfavor" v-else></text>
						</view>

					</view>
					<view class="input-item">
						<text class="tit">新密码</text>
						<input type="mobile" placeholder="请输入新密码" placeholder-class="input-empty" maxlength="20" :password='newPwdShow'
						 data-key="newPwd" @input="inputChange" />
						<view class="ljAbsolute" @tap.stop="changeEyeState('newPwd')">
							<text class="cuIcon-attentionforbid" v-if="newPwdShow"></text>
							<text class="cuIcon-attentionfavor" v-else></text>
						</view>
					</view>
					<view class="input-item">
						<text class="tit">新密码确认</text>
						<input type="mobile" placeholder="请输入新密码" placeholder-class="input-empty" maxlength="20" :password='newPwdConfirmShow'
						 data-key="newPwdConfirm" @input="inputChange" />
						<view class="ljAbsolute" @tap.stop="changeEyeState('newPwdConfirm')">
							<text class="cuIcon-attentionforbid" v-if="newPwdConfirmShow"></text>
							<text class="cuIcon-attentionfavor" v-else></text>
						</view>

					</view>
				</view>
				<button class="confirm-btn" @click="confirmSubmit">提交修改</button>
			</block>
		</view>
	</view>
</template>


<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				oldPwdShow: true,
				newPwdShow: true,
				newPwdConfirmShow: true
			};
		},
		computed: {
			...mapState(['token'])
		},
		methods: {
	...mapMutations(['logout', 'set_role', 'set_token']),
			changeEyeState(state) {
				var that = this;
				switch (state) {
					case 'oldPwd':
						that.oldPwdShow = !that.oldPwdShow
						break;
					case 'newPwd':
						that.newPwdShow = !that.newPwdShow
						break;
					case 'newPwdConfirm':
						that.newPwdConfirmShow = !that.newPwdConfirmShow
						break;
					default:
						break;
				}

			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			confirmSubmit() {
				const {
					oldPwd,
					newPwd,
					newPwdConfirm
				} = this;

				var now_token = this.token
				var that = this;
				if (oldPwd || newPwd || newPwdConfirm) {
					if (newPwd || newPwdConfirm) {
						if (oldPwd == '' || newPwd == '' || newPwdConfirm == '') {
							uni.showModal({
								showCancel: false,
								title: '提示',
								content: '输入的密码不能为空！',
								confirmText: '重新输入',
								success: function(res) {
									if (res.confirm) {

									}
								}
							});
						} else {
							if (newPwd === newPwdConfirm) {
								uni.showModal({
									title: '提示',
									content: '是否确认修改？',
									confirmText: '确定',
									cancelText: '取消',
									success: function(res) {
										if (res.confirm) {
											uni.showLoading({
												title: '正在提交...'
											})
											uni.request({
												url: that.global_baseUrl + '/set_pwd/',
												header: {
													'Authorization': ' Token ' + now_token,
													'content-type': 'application/x-www-form-urlencoded'
												},
												method: "POST",
												data: {
													oldPwd: that.oldPwd,
													newPwd: that.newPwd,
													newPwdConfirm: that.newPwdConfirm
												},
												success: (res) => {
													that.check_statusCode(res.statusCode);
													if(res.data.state==='ok'){
														setTimeout(() => {
															uni.hideLoading();
															uni.showToast({
																title: '密码修改成功！请重新登录！',
																icon: 'success'
															})
														}, 600);
														uni.clearStorageSync('local_token');
														that.set_token('')
														that.logout();
														that.set_role(2);
														if(that.token===''){
															uni.redirectTo({
																url: '/pages/public/login'
															})
														}
													}else{
														setTimeout(() => {
															uni.hideLoading();
															uni.showToast({
																	title: '修改失败！请检查原密码！',
																	icon: 'none'
																})
														}, 600);
													}
													
												}
											});

										} else {

										}
									}
								});

							} else {
								uni.showModal({
									showCancel: false,
									title: '提示',
									content: '两次新密码不一致！',
									confirmText: '重新输入',
									success: function(res) {
										if (res.confirm) {

										}
									}
								});
							}

						}
					} else {
						uni.showModal({
							showCancel: false,
							title: '提示',
							content: '输入的密码不能为空！',
							confirmText: '重新输入',
							success: function(res) {
								if (res.confirm) {

								}
							}
						});
					}
				} else {
					uni.showModal({
						showCancel: false,
						title: '提示',
						content: '输入的密码不能为空！',
						confirmText: '重新输入',
						success: function(res) {
							if (res.confirm) {

							}
						}
					});
				}
			},
		}
	}
</script>

<style lang='scss' scoped>
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
		font-size: 32upx;
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
