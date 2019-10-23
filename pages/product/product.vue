<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper" @tap="ViewImage(imgList,index)">
						<image :src="item.src" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{good_second_content.title}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{good_second_content.price}}</text>
			</view>
			<view class="bot-row">
				<text>销量: {{good_second_content.sales}}</text>
				<text>库存: {{good_second_content.stock}}</text>
				<text>浏览量: {{good_second_content.pageview }}</text>
			</view>
		</view>
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec('none')">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.value}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
		</view>
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<u-parse :content="desc" :imageProp='imageProp' @preview="preview" @navigate="navigate"></u-parse>

		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="ljButtonHelp">
				<button open-type="share" class="ljButtonTemp">
					<text class="cuIcon-share text-gray" style="font-size:40rpx ! important ;"></text>
					<text class="btnText">分享</text>
				</button>
			</view>
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" :class="can_buy?'':'bg'" @click="buy">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn " @tap='addCart'>加入购物车</button>
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
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="specChildList[current_price_index].picture" @tap="ViewImage2(specChildList[current_price_index].picture)"></image>
					<view class="right">
						<text class="price">{{specChildList[current_price_index].price}}</text>
						<text class="stock">库存：{{good_second_content.stock}}</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.value}}
							</text>
						</view>
					</view>
				</view>
				<scroll-view scroll-y style="height: 400px;">
					<view v-for="(item,index) in specList" :key="index" class="attr-list">
						<text>{{item.name}}</text>
						<view class="item-list">
							<text v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id" :key="childIndex" class="tit"
							 :class="{selected: childItem.selected}" @click="selectSpec(childIndex, childItem.pid)">
								{{childItem.value}}
							</text>
						</view>
					</view>
				</scroll-view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>

	</view>
</template>
<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex';
	import uParse from '@/components/uParse/src/wxParse.vue'
	import uniCountdown from "@/components/uni-countdown/uni-countdown.vue"
	export default {
		components: {
			uniCountdown,
			uParse,
		},
		data() {
			return {
				specClass: 'none',
				specSelected: [],
				imgList: [],
				imageProp: {
					mode: 'aspectFit',
					padding: 0,
					lazyLoad: true,
					domain: "liangxuan.natapp1.cc"
				},
				desc: null,
				specList: [{
					id: 1,
					name: '参数',
				}],
				specChildList: [

				],
				colourList: [],
				current_can_buy: false,
				current_buy_time: {},
				modalName_can_buy: null,
				le_H: 0,
				le_M: 0,
				le_S: 0,
				now_time: '',
				get_url: null,
				good_second_content: {},
				current_price_index: 0,
				proList: [],
				lastType: '',

			};
		},
		computed: {
			...mapState(['token', 'buy_time', 'can_buy']),
		},
		async onLoad(options) {
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			let item_url = options.item_url;
			this.get_url = item_url;
			this.getDataAll()
			this.getBuyTimeSpan();
			//规格 默认选中第一条
			this.specList.forEach(item => {
				for (let cItem of this.specChildList) {
					if (cItem.temp_id === item.id) {
						this.$set(cItem, 'selected', true);
						this.specSelected.push(cItem);
						break; //forEach不能使用break
					}
				}
			})
			this.shareList = await this.$api.json('shareList');
			this.current_can_buy = this.getCan_buy_state();

		},
		methods: {
			...mapMutations(['can_buy_change', 'set_buy_time']),
			...mapGetters(['getCan_buy_state']),
			shareEvn() {
				uni.showLoading({
					title: '正在加载...'
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 500)
			},
			ViewImage2(e) {
				var imgList = [];
				imgList.push(e)
				uni.previewImage({
					urls: imgList,
				});
			},

			// 预览图片
			ViewImage(list, curr) {
				var imgList = [];
				list.forEach(item => {
					imgList.push(item.src);
				})
				uni.previewImage({
					urls: imgList,
					current: curr
				});
			},
			// 加入购物车
			addCart() {
				var _self = this;
				if (this.specSelected.length === 0) {
					uni.showModal({
						title: '提示',
						showCancel: false,
						content: '您还未选择商品参数，请选择！',
						success: function(res) {
							if (res.confirm) {
								_self.lastType = 'add'
								_self.toggleSpec('add_cart');
							}
						}
					});
				} else {
					this.lastType = '';
					var obj = {
						nums: 1,
						goods: this.specSelected[0].id
					}
					var now_token = this.token
					uni.request({
						url: this.global_baseUrl + '/cartinfo/',
						header: {
							'Authorization': ' Token ' + now_token
						},
						method: "POST",
						data: obj,
						success: (res) => {
							_self.check_statusCode(res.statusCode)
							uni.showToast({
								title: "添加购物车成功！"
							})
						}
					});
				}
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
			getDataAll() {
				if (this.get_url) {
					var now_token = this.token;
					uni.request({ // url: this.global_baseUrl + '/banners/',
						url: this.get_url,
						header: {
							'Authorization': ' Token ' + now_token
						},
						method: "GET",
						success: (res) => {
							// 封装imgList 轮播
							res.data.describe_picture.forEach(item => {
								var temp_imgList = {
									src: item.describe_picture
								}
								this.imgList.push(temp_imgList);
							})
							// 封装中间内容
							this.good_second_content = {
								title: res.data.class_name,
								price: res.data.general_configure[0].price,
								pageview: res.data.pageview,
								stock: res.data.stock,
								sales: res.data.sales
							}
							this.desc = res.data.describe_content
							// 封装属性参数
							res.data.general_configure.forEach(item => {
								var temp_pro = item;
								temp_pro.pid = 1;
								this.specChildList.push(temp_pro);
							})
						}
					});
				}
			},

			showModalName_can_buy() {
				this.modalName_can_buy = 'show';
			},

			//规格弹窗开关
			toggleSpec(form) {
				var _self = this;
				if (_self.specClass === 'show') {
					_self.specClass = 'hide';
					setTimeout(() => {
						_self.specClass = 'none';
					}, 250);
					if (_self.specSelected.length === 0) {

					} else {
						if (_self.lastType == 'buy') {
							_self.lastType == '';
							var temp_good_data = _self.specChildList[_self.current_price_index];
							temp_good_data.count_num = 1;
							temp_good_data.good_info = _self.good_second_content;
							uni.navigateTo({
								url: '/pages/order/createOrder?temp_good_data=' + JSON.stringify(temp_good_data)
							})
						} else if (_self.lastType == 'add') {
							_self.addCart();
						}
					}
				} else if (_self.specClass === 'none') {
					_self.specClass = 'show';

				}

			},
			//选择规格
			selectSpec(index, pid) {
				this.current_price_index = index;
				let list = this.specChildList;
				list.forEach(item => {
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				})
				this.$set(list[index], 'selected', true);
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
					}
				})
			},
			buy() {
				var that = this;
				if (this.current_can_buy) {
					if (this.specSelected.length === 0) {
						uni.showModal({
							title: '提示',
							showCancel: false,
							content: '您还未选择商品参数，请选择！',
							success: function(res) {
								if (res.confirm) {
									that.lastType = 'buy';
									that.toggleSpec('buy');
								}
							}
						});
					} else {
						var temp_good_data = this.specChildList[this.current_price_index];
						temp_good_data.count_num = 1;
						temp_good_data.good_info = this.good_second_content;
						uni.navigateTo({
							url: '/pages/order/createOrder?temp_good_data=' + JSON.stringify(temp_good_data)
						})
					}

				} else {
					this.showModalName_can_buy();
				}
			},

			stopPrevent() {},
			hideModal_can_buy() {
				this.modalName_can_buy = null;
			},
		},

	}
</script>

<style lang='scss' scoped>
	.ljButtonHelp {
		font-size: 40rpx;
		line-height: 48rpx;
		color: #909399;
		.btnText{
			margin-top: 10rpx;
			font-size: 24rpx;
			color: #606266;

		}
		button::after {
			border: none;
		}

		button {
			margin-left: 0;
			margin-right: 0;
			padding-left: 0;
			padding-right: 0;
			line-height: 1;
			color: #1c1c1c;
			font-size: 28rpx;
			background: none;
		}

		.button-hover {
			color: #1c1c1c;
			background: none;
		}

		.ljButtonTemp {
			display: flex;
			flex-direction: column;
			text-align: center;
			align-content: center;
			padding: 4rpx 14rpx;

		}
	}



	@font-face {
		font-family: 'font_family';
		/* project id 1065286 */
		src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot');
		src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff') format('woff'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.svg#font_family') format('svg');
	}

	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}



	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}




	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			flex-direction: column;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;



			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}

	.share-pro {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-direction: column;
		z-index: 5;
		line-height: 1;
		box-sizing: border-box;

		.share-pro-mask {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.5);
		}

		.share-pro-dialog {
			width: 750rpx;
			height: 310rpx;
			overflow: hidden;
			background-color: #fff;
			border-radius: 24rpx 24rpx 0px 0px;
			position: relative;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;

			.close-btn {
				padding: 20rpx 15rpx;
				position: absolute;
				top: 0rpx;
				right: 29rpx;
			}

			.share-pro-title {
				font-size: 28rpx;
				color: #1c1c1c;
				padding: 28rpx 41rpx;
				background-color: #f7f7f7;
			}

			.share-pro-body {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				font-size: 28rpx;
				color: #1c1c1c;

				.share-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					justify-content: space-around;

					.share-icon {
						text-align: center;
						font-size: 70rpx;
						margin-top: 39rpx;
						margin-bottom: 16rpx;
						color: #42ae3c;
					}

					&:nth-child(2) {
						.share-icon {
							color: #ff5f33;
						}
					}
				}
			}
		}

		/* 显示或关闭内容时动画 */
		.open {
			transition: all 0.3s ease-out;
			transform: translateY(0);
		}

		.close {
			transition: all 0.3s ease-out;
			transform: translateY(310rpx);
		}

	}

	.canvas {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		display: block !important;
		width: 100% !important;
		height: 100% !important;
		z-index: 10;
	}
</style>
