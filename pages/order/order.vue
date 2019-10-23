<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time">{{item.time}}</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
							<text v-if="item.state===1" class="del-btn  cuIcon-roundclose text-grey text-lg" @click="deleteOrder(item.id,'close')"></text>
							<text v-if="item.state===2" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(item.id,'delete')"></text>
						</view>
						<scroll-view v-if="item.goodsList.length > 1" class="goods-box" scroll-x>
							<view v-for="(goodsItem, goodsIndex) in item.goodsList" :key="goodsIndex" class="goods-item">
								<image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view v-if="item.goodsList.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.goodsList"
						 :key="goodsIndex">
							<image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.title}}</text>
								<text class="attr-box">{{goodsItem.attr}} x {{goodsItem.number}}</text>
								<text class="price">{{goodsItem.price}}</text>
							</view>
						</view>
						<view class="flex justify-between padding-tb-sm padding-right padding-left-sm">
							<view class="text-red text-sm" @tap="seeMore">更多信息</view>
							<view class="price-box">
								共
								<text class="num">{{item.count_num}}</text>
								件商品 实付款
								<text class="price">{{item.count_price}}</text>
							</view>
						</view>
						<!-- 查看更多-->
						<view class="cu-modal" :class="seeMoreFlag?'show':''" @touchmove.stop.prevent="moveHandle">
							<view class="cu-dialog">
								<view class="cu-bar justify-end text-black">
									<view class="content text-bold">
										更多信息
									</view>
									<view class="action" @tap="hideModalMore">
										<text class="cuIcon-close "></text>
									</view>
								</view>
								<scroll-view scroll-y @touchmove.prevent>
									<view style="width: 100%;height: 350px;">
										<block>
											<view class="cu-bar bg-white solid-bottom margin-top-sm">
												<view class="action">
													<text class="cuIcon-title text-orange"></text>物流信息
												</view>
											</view>
											<view class="cu-list menu">
												<view class="cu-item flex">
													<view class="text">物流方式</view>
													<view>{{item.deliver_type!=='null'?item.deliver_type:'暂无信息'}}</view>
												</view>
												<view class="cu-item flex">
													<view class="text">物流公司</view>
													<view>{{item.deliver_com!=='null'?item.deliver_com:'暂无信息'}}</view>
												</view>
												<view class="cu-item flex">
													<view class="text">物流单号</view>
													<view>{{item.deliver_num!=='null'?item.deliver_num:'暂无信息'}}</view>
												</view>
											</view>
										</block>
										<block>
											<view class="cu-bar bg-white solid-bottom margin-top-sm">
												<view class="action">
													<text class="cuIcon-title text-orange"></text>收货信息
												</view>
											</view>
											<view class="cu-list menu">
												<view class="cu-item flex">
													<view class="text">收货人</view>
													<view>{{item.address_info.consignee_name!==''?item.address_info.consignee_name:'暂无信息'}}</view>
												</view>
												<view class="cu-item flex">
													<view class="text">联系电话</view>
													<view>{{item.address_info.phone_num!==''?item.address_info.phone_num:'暂无信息'}}</view>
												</view>
												<view class="cu-item flex">
													<view class="text">收货地址</view>
													<view>{{item.address_info.consinfee_address!==''?item.address_info.consinfee_address:'暂无信息'}}</view>
												</view>
												<view class="cu-item flex">
													<view class="text">地址详情</view>
													<view>{{item.address_info.note!==''?item.address_info.note:'暂无信息'}}</view>
												</view>
											</view>
										</block>
										<block>
											<view class="cu-bar bg-white solid-bottom margin-top-sm">
												<view class="action">
													<text class="cuIcon-title text-orange"></text>用户信息
												</view>
											</view>
											<view class="cu-list menu">
												<view class="cu-item flex">
													<view class="text">用户备注</view>
													<view>{{item.user_note!=''?item.user_note:'暂无信息'}}</view>
												</view>

											</view>
										</block>
									</view>
								</scroll-view>

								<view class="cu-bar bg-red">
									<view class="action margin-0 flex-sub  solid-left" @tap="hideModalMore">我知道了</view>
								</view>
							</view>
						</view>
					</view>
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import Json from '@/Json';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待确认',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '已确认',
						loadingType: 'more',
						orderList: []
					}, {
						state: 3,
						text: '售后中',
						loadingType: 'more',
						orderList: []
					}
				],
				ljOrderList: [],
				seeMoreFlag: false
			};
		},
		computed: {
			...mapState(['token'])
		},
		onLoad(options) {
			var _self = this;
			_self.tabCurrentIndex = options.state;
			uni.showLoading({
				title: '加载中...',
			});
			_self.getljOrderList();
			if (_self.ljOrderList.length >= 1) {
				setTimeout(() => {
					uni.hideLoading();
				}, 1000)
				// }
			}

		},
		onShow() {
			var _self = this;
			uni.showLoading({
				title: '加载中...',
			});
			if (_self.navList[0].orderList.length <= 1) {
				_self.tabCurrentIndex = _self.tabCurrentIndex;
				_self.loadData('tabChange');
				if (_self.ljOrderList.length >= 1) {
					_self.loadData();
				}
				setTimeout(() => {
					uni.hideLoading();
				}, 1000)

			}
			_self.changeTabFade(_self.tabCurrentIndex)
		},
		onPullDownRefresh() {
			var _self = this;
			_self.ljOrderList = [];
			_self.getljOrderList();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 500)
		},
		methods: {
			// 解决蒙层滚动问题
			moveHandle() {
				return;
			},
			hideModalMore() {
				this.seeMoreFlag = false;
			},
			seeMore() {
				this.seeMoreFlag = true;
			},
			//获取订单列表
			getljOrderList() {
				var _self = this;
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/orders/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						_self.check_statusCode(res.statusCode);
						res.data.forEach(item => {
							var temp_url = item.url;
							uni.request({
								url: temp_url,
								header: {
									'Authorization': ' Token ' + now_token
								},
								method: "GET",
								success: (res) => {
									var tempGoodList = []
									_self.check_statusCode(res.statusCode)
									// 封装时间 // 封装总价，总数量
									try {
										var tempData = {
											time: res.data.order_create_time.substring(0, 10) + ' ' + res.data.order_create_time.substring(11,
												16),
											count_num: res.data.count_num,
											count_price: res.data.count_price,
											deliver_type: res.data.deliver_type,
											deliver_com: res.data.deliver_com,
											deliver_num: res.data.deliver_num,
											user_note: res.data.user_note,
											id: res.data.id,
											address_info: res.data.buy_address[0],
										}
										// 封装状态
										var temp_state = 0;
										switch (res.data.order_status) {
											case '待确认':
												temp_state = 1;
												break;
											case '已确认':
												temp_state = 2;
												break;
											case '售后中':
												temp_state = 3;
												break;
										}
										tempData.state = temp_state;
										// 封装商品列表
										// 只有一个商品时候，多个同时用
										res.data.buy_good.forEach(item => {
											var tempGoodListItem = {
												title: item.name,
												price: item.price,
												image: item.picture,
												number: item.goods_num,
												attr: item.value
											}
											tempGoodList.push(tempGoodListItem);
										})
										tempData.goodsList = tempGoodList;
										_self.ljOrderList.push(tempData)
									} catch (e) {
										uni.showModal({
											title: '提示',
											content: '未知错误，请重新操作！',
											showCancel: false,
											success: function(res) {
												if (res.confirm) {
													uni.redirectTo({
														url: '/pages/index/index'
													})
												}
											}
										});
									}
								}
							});
						});
					}
				});
				// _self.loadData();
			},
			loadData(source) {
				this.navList = [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待确认',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '已确认',
						loadingType: 'more',
						orderList: []
					}, {
						state: 3,
						text: '售后中',
						loadingType: 'more',
						orderList: []
					}
				];
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				if (source === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				navItem.loadingType = 'loading';
				// setTimeout(() => {
				// 过滤器
				let orderList = this.ljOrderList.filter(item => {
					//添加不同状态下订单的表现形式
					item = Object.assign(item, this.orderStateExp(item.state));
					// 演示数据所以自己进行状态筛选
					if (state === 0) {
						//0为全部订单
						return item;
					}
					return item.state === state
				});
				orderList.forEach(item => {
					navItem.orderList.push(item);
				})
				//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
				this.$set(navItem, 'loaded', true);
				// 判断是否还有数据， 有改为 more， 没有改为noMore 
				navItem.loadingType = 'noMore';
				setTimeout(() => {
					uni.hideLoading();
				}, 500);

			},
			changeTabFade(e) {
				var tempIndex = e + 1 - 1;
				this.tabCurrentIndex = tempIndex;
			},
			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(index, do_what) {
				var that = this;
				var now_token = this.token
				var text_content = "";
				if (do_what == 'delete') {
					text_content = '您确定删除该订单吗'
				} else {
					text_content = '您确定取消该交易吗'
				}
				uni.showModal({
					title: '提示',
					content: text_content,
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							})
							setTimeout(() => {
								uni.request({
									url: that.global_baseUrl + '/orders/' + index,
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
										this.ljOrderList = [];
										that.getljOrderList();
									}
								});
								uni.hideLoading();
							}, 600)
						} else if (res.cancel) {

						}
					}
				});

			},
			//订单状态文字和颜色
			orderStateExp(state) {
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch (+state) {
					case 1:
						stateTip = '待确认';
						break;
					case 2:
						stateTip = '已确认';
						break;
					case 3:
						stateTip = '售后中';
						stateTipColor = '#909399';
						break;
				}
				return {
					stateTip,
					stateTipColor
				};
			}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;

		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.time {
				flex: 1;
			}

			.state {
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;

			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;

			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}

				.price {
					font-size: $font-base + 2upx;
					color: $font-color-dark;

					&:before {
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}

		.price-box {
			display: flex;
			// justify-content: flex-end;
			align-items: baseline;
			// padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}

			.price {
				font-size: $font-lg;
				color: $font-color-dark;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}

		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
