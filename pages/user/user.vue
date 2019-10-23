<template>
	<view class="container">
		<view class="user-section">
			<image class="bg" :src="userInfo.door_photo==''&&temp_role==2?userInfo.door_photo :contentData.back_map"></image>
			<view class="user-info-box" @tap="navToUserInfo()">
				<!-- #ifdef MP -->
				<view class="portrait-box">
					<view class="ljavatar">
						<open-data type="userAvatarUrl"></open-data>
					</view>
				</view>
				<view class="info-box ">
					<open-data class="ljNickName" type="userNickName"></open-data>
				</view>
				<!-- #endif -->
				<view class="flex justify-between ljPosition">
					<view class="cuIcon-noticefill  text-white margin-right-sm" @tap.stop="toWhere('通知')"></view>
					<view class="cuIcon-settingsfill  text-white" @tap.stop="toWhere('设置')"></view>
				</view>
			</view>

			<view class="vip-card-box">
				<image class="card-bg" :src="contentData.card_map" mode=""></image>
				<view class="b-btn bg-red">
					{{contentData.identy_type}}
				</view>
				<view class="tit">
					<text class="yticon icon-iLinkapp-"></text>
					{{contentData.title_simple}}
				</view>
				<text class="e-m">{{contentData.title_detail}}</text>
				<text class="e-b">{{contentData.desrc}}</text>
			</view>
		</view>

		<view class="cover-container" :style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
		 @touchstart="coverTouchstart" @touchmove="coverTouchmove" @touchend="coverTouchend">
			<image class="arc" src="/static/arc.png"></image>
			<block>
				<view class="tj-sction">
					<view class="tj-item">
						<text class=" text-red text-lg">{{show_data.order_count}}</text>
						<text>订单总数</text>
					</view>
					<view class="tj-item">
						<text class=" text-orange text-lg">{{show_data.order_allPice}}</text>
						<text>总金额</text>
					</view>
					<view class="tj-item">
						<text class=" text-green text-lg">{{show_data.letTime}}</text>
						<text>剩余天数</text>
					</view>
				</view>
			</block>
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/order/order?state=0')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-shouye"></text>
					<text>全部订单</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=1')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-daifukuan"></text>
					<text>待确认</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=2')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-yishouhuo"></text>
					<text>已确认</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=3')" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-shouhoutuikuan"></text>
					<text>售后中</text>
				</view>
			</view>
			</block>
			<view class="history-section icon">
				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="地址管理" @eventClick="navTo('/pages/address/address')"></list-cell>
				<list-cell icon="icon-shezhi1" iconColor="#e07472" title="设置" border="" @eventClick="navTo('/pages/set/set')"></list-cell>
			</view>
		</view>

		<view class="ljFixBottom">
			<view class="cu-bar btn-group" v-if="temp_role==0">
				<button class="cu-btn bg-gradual-red shadow-blur round lg" @tap="entry_admin">管理员入口</button>
			</view>
			<view class="cu-bar btn-group" v-if="temp_role==1">
				<button class="cu-btn bg-gradual-red shadow-blur round lg" @tap="entry_staff">业务员入口</button>
			</view>
		</view>
	</view>
</template>
<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import listCell from '@/components/mix-list-cell';
	import {
		mapState
	} from 'vuex';
	
	let startY = 0, moveY = 0, pageAtTop = true;
	export default {
		components: {
			listCell
		},
		data() {
			return {
				show_data: {},
				contentData: {},
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				wx_user_info: {},
				temp_role: 2,
				TabCur: 0,
				scrollLeft: 0,
				current_nav: 0,
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'wx_userinfo', 'role', 'token','let_days'])
		},
		onLoad() {
			uni.showLoading({
				title: '加载中...'
			})
			this.temp_role = this.role;
			this.getContentData();
			var _self = this;
		
		},
		onShow() {},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
		methods: {
			toWhere(url) {
				if (url == '通知') {
					uni.navigateTo({
						url: '/pages/notice/notice'
					})
				} else {
					uni.navigateTo({
						url: '/pages/set/set'
					})
				}
			},

			navToUserInfo() {
				uni.navigateTo({
					url: '/pages/userinfo/userinfo'
				})
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			entry_admin() {
				uni.navigateTo({
					url: '/pages/user/entry_admin/entry_admin',
					success: res => {}
				});
			},
			entry_staff() {
				uni.navigateTo({
					url: '/pages/user/entry_staff/entry_staff',
					success: res => {},

				});
			},
			getContentData() {
				var _self = this;
				var now_token = _self.token
				uni.request({
					url: _self.global_baseUrl + '/cardinfo/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						_self.check_statusCode(res.statusCode)
						res.data.forEach(item => {
							if (_self.temp_role == item.role) {
								_self.contentData = item;
							}
						})
					}
				});
				// if (_self.temp_role == 2) {
					uni.request({
						url: _self.global_baseUrl + '/orders/',
						header: {
							'Authorization': ' Token ' + now_token
						},
						method: "GET",
						success: (res) => {
							_self.check_statusCode(res.statusCode)
							let temp_show_data = {}
							let temp_order_count = res.data.length;
							let temp_order_allPice = 0;
							res.data.forEach(item => {
								temp_order_allPice += parseFloat(item.count_price);
							})
							if (_self.userInfo) {
								temp_show_data = {
									order_count: temp_order_count,
									order_allPice: temp_order_allPice,
									letTime: _self.let_days
								}
							}
							_self.show_data = temp_show_data;
						}
					});
				// }
				uni.hideLoading();
			},
			
			navTo(url) {
				if (!this.hasLogin) {
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url
				})
			},

			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e) {
				if (pageAtTop === false) {
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e) {
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if (moveDistance < 0) {
					this.moving = false;
					return;
				}
				this.moving = true;
				if (moveDistance >= 80 && moveDistance < 100) {
					moveDistance = 80;
				}

				if (moveDistance > 0 && moveDistance <= 80) {
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend() {
				if (this.moving === false) {
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			}
		}
	}
</script>
<style lang='scss'>
	.ljPosition {
	position: absolute;
	top: 20px;
	right: -8px;
	padding: 10px 20px;
	font-size: 26px;
	}

	.ljNickName {
		font-size: 44rpx;
		padding: 10rpx 20rpx;
	}

	.ljavatar {
		position: relative;
		margin-left: 8px;
		width: 150upx;
		height: 150upx;
		clip-path: circle(60rpx at center);
	}

	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 10upx;
	}

	.user-section {
		height: 520upx;
		padding: 100upx 30upx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}
	}

	.user-info-box {
		height: 180upx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;

		.portrait {
			width: 130upx;
			height: 130upx;
			border: 5upx solid #fff;
			border-radius: 50%;

		}

		.username {
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
			margin-left: 20upx;
		}
	}

	.vip-card-box {
		display: flex;
		flex-direction: column;
		color: #f7d680;
		height: 240upx;
		background: linear-gradient(left, rgba(0, 0, 0, .7), rgba(0, 0, 0, .8));
		border-radius: 16upx 16upx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20upx 24upx;

		.card-bg {
			position: absolute;
			top: 20upx;
			right: 0;
			width: 380upx;
			height: 260upx;
		}

		.b-btn {
			position: absolute;
			right: 20upx;
			top: 16upx;
			width: 132upx;
			height: 40upx;
			text-align: center;
			line-height: 40upx;
			font-size: 22upx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(left, #f9e6af, #ffd465);
			z-index: 1;
		}

		.tit {
			font-size: $font-base+2upx;
			color: #f7d680;
			margin-bottom: 28upx;

			.yticon {
				color: #f6e5a3;
				margin-right: 16upx;
			}
		}

		.e-b {
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10upx;
		}
	}

	.cover-container {
		background: $page-color-base;
		margin-top: -150upx;
		padding: 0 30upx;
		position: relative;
		background: #f5f5f5;
		padding-bottom: 20upx;

		.arc {
			position: absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}

	.tj-sction {
		@extend %section;

		.tj-item {
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}

		.num {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}

	.order-section {
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;

		.order-item {
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
		}

		.yticon {
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #fa436a;
		}

		.icon-shouhoutuikuan {
			font-size: 44upx;
		}
	}

	.history-section {
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius: 10upx;

		.sec-header {
			display: flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;

			.yticon {
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}

		.h-list {
			white-space: nowrap;
			padding: 30upx 30upx 0;

			image {
				display: inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}

	.ljFixBottom {
		width: 100%;
		position: fixed;
		bottom: 20px;
	}

	.ljtext-xl {
		font-size: 24px !important;
		margin-top: 10px;
		margin-bottom: 10px;

	}



	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		margin-top: 10px;
		margin-left: -12px;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.qiun-padding {
		padding: 2%;
		width: 96%;
	}

	.qiun-wrap {
		display: flex;
		flex-wrap: wrap;
	}

	.qiun-rows {
		display: flex;
		flex-direction: row !important;
	}

	.qiun-columns {
		display: flex;
		flex-direction: column !important;
	}

	.qiun-common-mt {
		margin-top: 10upx;
	}

	.qiun-bg-white {
		background: #FFFFFF;
	}

	.qiun-title-bar {
		width: 96%;
		padding: 10upx 2%;
		flex-wrap: nowrap;
	}

	.qiun-title-dot-light {
		border-left: 10upx solid #0ea391;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000
	}
</style>
