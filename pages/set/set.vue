<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="navTo('个人资料')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">个人资料</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('密码修改')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">密码修改</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('收货地址')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">收货地址</text>
			<text class="cell-more yticon icon-you"></text>
		</view>

		<view class="list-cell  m-t b-b" @click="navTo('关于我们')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于我们</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell">
			<text class="cell-tit">版本信息</text>
			<text class="cell-tip">当前版本 1.0.1</text>
			<text class="cell-more"></text>
		</view>
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">退出登录</text>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {

			};
		},
		methods: {
			...mapMutations(['logout', 'set_role', 'set_token']),
			navTo(url) {
				switch (url) {
					case '个人资料':
						uni.navigateTo({
							url: '/pages/userinfo/userinfo'
						})
						break;
					case '关于我们':
						uni.navigateTo({
							url: '/pages/set/aboutUs/aboutUs'
						})
						break;
					case '收货地址':
						uni.navigateTo({
							url: '/pages/address/address'
						})
						break;
					case '密码修改':
						uni.navigateTo({
							url: '/pages/set/changePwd/changePwd'
						})
						break;
				}
			},
			//退出登录
			toLogout() {
				uni.showModal({
					content: '确定要退出登录么',
					success: (e) => {
						if (e.confirm) {
							uni.clearStorageSync('local_token');
							this.set_token('')
							this.logout();
							this.set_role(2);
							setTimeout(() => {
								uni.reLaunch({
									url: '../public/login'
								})
							}, 200)
						}
					}
				});
			},
		}
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
	}

	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 20upx $page-row-spacing;
		line-height: 60upx;
		position: relative;
		background: #fff;
		justify-content: center;

		&.log-out-btn {
			margin-top: 40upx;

			.cell-tit {
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		&.m-t {
			margin-top: 16upx;
		}

		.cell-more {
			align-self: baseline;
			font-size: $font-lg;
			color: $font-color-light;
			margin-left: 10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: $font-base;
			color: $font-color-light;
		}

		switch {
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
