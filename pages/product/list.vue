<template>
	<view class="content">
		<view class="navbar" :style="{position:headerPosition,top:headerTop}">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				综合排序
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				销量优先
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text :class="[flagListPic?'cuIcon-list':'cuIcon-cascades']" class="cate-item " @tap="toggleCateMask('show')"></text>
		</view>
		<!-- 列表 -->
		<block>
			<!-- 内容列表 列表样式 左右 -->
			<view class="ljProductListList bg-white" v-if="flagListPic">
				<block v-for="(item,index) in goodsList" :key='index' >
					<view class="ljProductItemList flex padding-lr-sm" @tap="navToDetailPage(item.url)">
						<view class="list_itemLeft padding-sm">
							<view class="imgHelp">
								<image mode="aspectFill" :src="item.image"></image>
							</view>
						</view>
						<view class="list_itemRight padding-tb-sm">
							<view class="list_itmeTitle  ">
								{{item.title}}
							</view>
							<view class='list_itemCenter padding-bottom'>
								<view class="padding-bottom-sm">
									<text class="text-lg text-bold text-red">￥{{item.price}}</text>
								</view>
								<view class="text-gray text-sm">已售 {{item.sales}}</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</block>
		<!-- 图文 上下-->
		<block>
			<view class="goods-list" v-if="!flagListPic">
				<view v-for="(item, index) in goodsList" :key="index" class="goods-item">
					<view @tap="navToDetailPageCopy(item.url)">
						<view class="image-wrapper">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<text class="title clamp">{{item.title}}</text>
						<view class="price-box">
							<text class="price">{{item.price}}</text>
							<text>已售 {{item.sales}}</text>
						</view>
					</view>
				</view>
			</view>
		</block>
		<!-- <uni-load-more :status="loadingType"></uni-load-more> -->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		computed: {
			...mapState(['token'])
		},
		data() {
			return {
				cateMaskState: 0, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				cateId: 0, //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				get_url: null,
				flagListPic: false,
				res_goodlist: null
			};
		},

		onLoad(options) {
			var last_data = JSON.parse(options.data);
			this.get_url = last_data.detail_url;
			this.setNavgatBar(last_data.title_name);
			uni.showLoading({
				title: '加载中'
			})
			this.getGoodList();

		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
		methods: {
			setNavgatBar(title) {
				uni.setNavigationBarTitle({
					title: title
				});
			},
			// lj获取商品
			getGoodList() {
				var now_token = this.token;
				uni.request({ // url: this.global_baseUrl + '/banners/',
					url: this.get_url,
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						var temp_data = res.data.good_class;
						var temp_goodsList = []
						if (temp_data.length == 0) {
							uni.showModal({
								title: '提示',
								content: '该分类下暂无商品！',
								showCancel: false,
								confirmText: '好的',
								success: function(res) {
									if (res.confirm) {
										uni.navigateBack({})
									}
								}
							});

						} else {
							temp_data.forEach(item => {
								try {
									var temp_goodItem = {
										image: item.describe_picture["0"].describe_picture,
										title: item.class_name,
										price: item.general_configure[0].price,
										sales: item.sales,
										url: item.url,
									}
									temp_goodsList.push(temp_goodItem)
								} catch (e) {
									uni.showModal({
										title: '提示',
										content: '该商品数据不完整！',
										showCancel: false,
										confirmText: '好的',
										success: function(res) {
											if (res.confirm) {
												uni.navigateBack({})
											}
										}
									});
								}

							})
							this.res_goodlist = temp_goodsList;
							this.loadData();
						}
					}
				});
				uni.hideLoading();
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				this.goodsList = [];
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more'
				}
				// this.goodsList = this.res_goodlist;
				let goodsList = this.res_goodlist;
				if (type === 'refresh') {
					this.goodsList = [];
				}
				//筛选，测试数据直接前端筛选了
				if (this.filterIndex === 1) {
					goodsList.sort((a, b) => b.sales - a.sales)
				}
				if (this.filterIndex === 2) {
					goodsList.sort((a, b) => {
						if (this.priceOrder == 1) {
							return a.price - b.price;
						}
						return b.price - a.price;
					})
				}
				this.goodsList = this.goodsList.concat(goodsList);
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				// this.loadingType = this.goodsList.length > 20 ? 'nomore' : 'more';
				// if (type === 'refresh') {
				// 	if (loading == 1) {
				// 		uni.hideLoading()
				// 	} else {
				// 		uni.hideLoading()
				// 		uni.stopPullDownRefresh();
				// 		
				// 	}
				// }
			},
			//筛选点击
			tabClick(index) {
				uni.showLoading({
					title: '正在加载'
				});
				setTimeout(() => {
					if (this.filterIndex === index && index !== 2) {
						return;
					}
					this.filterIndex = index;
					if (index === 2) {
						this.priceOrder = this.priceOrder === 1 ? 2 : 1;
					} else {
						this.priceOrder = 0;
					}
					uni.pageScrollTo({
						duration: 300,
						scrollTop: 0
					})
					this.loadData('refresh', 1);
					uni.hideLoading()
				}, 1000)
			},
			//显示分类面板
			toggleCateMask(type) {
				uni.showLoading({
					title: '切换中...'
				})
				setTimeout(() => {
					this.flagListPic = !this.flagListPic;
					uni.hideLoading();
				}, 500)

			},
			//详情
			navToDetailPage(item_url) {
				uni.navigateTo({
					url: `/pages/product/product?item_url=${item_url}`
				})
			},
			navToDetailPageCopy(item_url) {
				uni.navigateTo({
					url: `/pages/product/product?item_url=${item_url}`
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}

	.content {
		padding-top: 96upx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
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
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}


	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
	}

	// 产品列表，列表样式
	.ljProductListList {
		.ljProductItemList {

			.list_itemLeft {
				.imgHelp {
					width: 250upx;
					height: 250upx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 4upx;
					}
				}


			}

			.list_itemRight {
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.list_itemCenter {
					display: flex;
					flex-direction: column;
					justify-content: space-between;

				}

				.list_itmeTitle {
					margin-top: 4px;
					font-size: 16px;
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					height: 83upx;
					text-overflow: clip !important;

					.ljCutag {
						padding: 1upx 4upx;
						padding-top: 4upx;
						color: #f43f3b;
						font-weight: bold;
						border-radius: 1upx;
						font-size: 20upx;
						margin-left: 4upx;
						margin-right: 8upx;
						margin-top: 0px !important;
						border: 0.01upx solid #f43f3b;
					}
				}

				.LJcuTicket {
					font-size: 20upx;
					width: 80upx;
					border-radius: 2upx;
					padding: 4upx;

					view {
						margin: auto;
						text-align: center;
					}
				}
			}
		}
	}
</style>
