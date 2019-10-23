<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view class="cart-item" :class="{'b-b': index!==cartList.length-1}">
						<view class="image-wrapper">
							<image :src="item.goods.picture" :class="[item.loaded]" mode="aspectFill" lazy-load @load="onImageLoad('cartList', index)"
							 @error="onImageError('cartList', index)"></image>
							<view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}" @click="check('item', index)"></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.goods.title}}</text>
							<text class="attr">{{item.goods.value}}</text>
							<text class="price">¥{{item.goods.price}}</text>
							<uni-number-box class="step" :min="1" :max="999" :value="item.nums" :index="index" @eventChange="numberChange"></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image :src="allChecked?'/static/selected.png':'/static/select.png'" mode="aspectFit" @click="check('all')"></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price text-red text-lg">¥{{total}}</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>

		<!-- 不在购买时间内 禁止弹窗 -->
		<view class="cu-modal" :class="modalName_can_buy=='show'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content text-bold">当前不在购买时间段</view>
					<view class="action" @tap="hideModal_can_buy">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view><text class='text-red'>开启时间</text> ：{{current_buy_time.start_time}}~{{current_buy_time.end_time}}</view>
					<view class="margin-top-sm margin-left">
						<text class='text-green'>剩余时间</text>：
						<uni-countdown v-if="le_H" :show-day="false" color="#FFFFFF" background-color="#00B26A" border-color="#00B26A"
						 :hour="le_H" :minute="le_M" :second="le_S" />
					</view>

				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="hideModal_can_buy">我知道了</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import uniCountdown from "@/components/uni-countdown/uni-countdown.vue"
	export default {
		components: {
			uniNumberBox,
			uniCountdown
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				current_can_buy: false,
				current_buy_time: {},
				modalName_can_buy: null,
				le_H: 0,
				le_M: 0,
				le_S: 0,
				now_time: '',
			};
		},
		onLoad() {
			this.cartList = [];
			uni.showLoading({
				title: '加载中...'
			})
			this.getCartInfo();
			this.getBuyTimeSpan();
		},
		onShow() {
			if (this.cartList.length === 0) {
				uni.showLoading({
					title: '加载中...'
				})
				this.getCartInfo();
				
			}
			this.getBuyTimeSpan();
		},
		watch: {
			//显示空白页
			cartList(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			}
		},

		computed: {
			...mapState(['hasLogin', 'global_cart', 'token', 'buy_time', 'can_buy'])
		},
		methods: {
			...mapMutations(['can_buy_change', 'add_global_cart', 'set_buy_time']),
			showModalName_can_buy() {
				this.modalName_can_buy = 'show';
			},
			hideModal_can_buy() {
				this.modalName_can_buy = null;
			},
			setLeftTime() {
				// 后台时分
				var _self = this;
				_self.current_buy_time = _self.buy_time
				let current_start_time = _self.buy_time.start_time;
				let current_end_time = _self.buy_time.end_time
				let date = new Date();
				_self.now_time = date.getTime()
				//当前时分秒
				let n_h = date.getHours();
				let n_m = date.getMinutes();
				let n_s = date.getSeconds();
				let start_time_h = current_start_time.substring(0, 2);
				let start_time_m = current_start_time.substring(3);
				let end_time_h = current_end_time.substring(0, 2);
				let end_time_m = current_end_time.substring(3);
				let now_total = n_h * 3600 + n_m * 60 + n_s;
				let old_total = start_time_h * 3600 + start_time_m * 60;
				let old_total_end = end_time_h * 3600 + end_time_m * 60;
				let target_time = 0;
				if (now_total > old_total && now_total < old_total_end) {
					var data = 1
					_self.can_buy_change(data);
				} else {
					var data = 0
					_self.can_buy_change(data);
					if (n_h > start_time_h) {
						old_total = old_total + 24 * 3600;
						target_time = old_total - now_total;
					} else {
						target_time = old_total - now_total;
					}
					this.le_H = parseInt(target_time / 3600) % 24;
					this.le_M = parseInt(target_time / 60) % 60;
					this.le_S = parseInt(target_time % 60);
				}

				_self.current_can_buy = _self.can_buy

			},
			// 获取购买时间段
			getBuyTimeSpan() {
				var _self = this;
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/shoptime/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						_self.check_statusCode(res.statusCode)
						var temp_data = {
							id: res.data[0].id,
							startTime: res.data[0].start_time,
							endTime: res.data[0].end_time,
						}
						_self.current_buy_time = temp_data;
						_self.set_buy_time(temp_data)
						_self.setLeftTime();
					}
				});
			},
			getCartInfo() {
				var _self = this;
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/cartinfo/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						_self.check_statusCode(res.statusCode)
						// 封装购物车列表（此时无名称）
						_self.cartList = res.data;
						_self.cartList.forEach(item => {
							// item.goods.good_class
							uni.request({
								url: this.global_baseUrl + '/good_class/' + item.goods.good_class + '/',
								header: {
									'Authorization': ' Token ' + now_token
								},
								method: "GET",
								success: (res) => {
									_self.check_statusCode(res.statusCode)
									item.goods.title = res.data.class_name
								},

							});
						})
						uni.hideLoading();
						// _self.calcTotal(); //计算总价
					}
				});

			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			//选中状态处理
			check(type, index) {
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item => {
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data) {
				this.cartList[data.index].nums = data.number;
				this.calcTotal();
			},
			//删除
			deleteCartItem(index) {
				var that = this;
				var now_token = this.token
				uni.showModal({
					title: '提示',
					content: '确定删除该条记录吗',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							setTimeout(() => {
								uni.request({
									url: that.global_baseUrl + '/cartinfo/' + that.cartList[index].goods.id,
									header: {
										'Authorization': ' Token ' + now_token
									},
									method: "DELETE",
									success: (res) => {
										that.check_statusCode(res.statusCode);
										uni.showToast({
											icon: 'success',
											title: '操作成功！'
										}, 500);
										that.cartList = [];
										that.getCartInfo()
									}
								});
								uni.hideLoading();
							}, 600)
						} else if (res.cancel) {

						}
					}
				});
			},
			//清空
			clearCart() {
				var that = this;
				var now_token = this.token
				uni.showModal({
					content: '清空购物车？',
					success: (e) => {
						if (e.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							setTimeout(() => {
								that.cartList.forEach(item => {
									uni.request({
										url: that.global_baseUrl + '/cartinfo/' + item.goods.id,
										header: {
											'Authorization': ' Token ' + now_token
										},
										method: "DELETE",
										success: (res) => {
											that.check_statusCode(res.statusCode);
										}
									});
								})
								uni.showToast({
									icon: 'success',
									title: '操作成功！'
								}, 500);
								that.cartList = [];
								uni.hideLoading();
							}, 600)

						}
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true) {
						total += item.goods.price * item.nums;
					} else if (checked === true) {
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder() {
				if (this.current_can_buy) {
					let list = this.cartList;
					let goodsData = [];
					list.forEach(item => {
						if (item.checked) {
							goodsData.push(item)
						}
					})
					if (goodsData.length == 0) {
						uni.showModal({
							content: '您还未选择商品，请选择',
							showCancel: false,
							success: (e) => {
								if (e.confirm) {
									// this.cartList = [];
								}
							}
						})
					} else {
						uni.navigateTo({
							url: `/pages/order/createOrder?data=${JSON.stringify({
							goodsData: goodsData
						})}`
						})
					}
				} else {
					this.showModalName_can_buy();
				}



			}
		}
	}
</script>

<style lang='scss'>
	.container {
		padding-bottom: 134upx;

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	/* 购物车列表项 */
	.cart-item {
		display: flex;
		position: relative;
		padding: 30upx 40upx;

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.checkbox {
			position: absolute;
			left: -16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		margin-bottom: 100upx;
		/* #endif */
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.checkbox {
			height: 52upx;
			position: relative;

			image {
				width: 52upx;
				height: 100%;
				position: relative;
				z-index: 5;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: .2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: $font-lg;
				/* color: $font-color-dark; */
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}

		.confirm-btn {
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}

	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}
</style>
