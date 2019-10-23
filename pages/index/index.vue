<template>
	<view class="container">
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper class="carousel" circular @change="swiperChange" autoplay='true' duration="800">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToAboutUs(item.is_jump)">
					<image :src="item.picutre" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>
		<!-- 分类 -->
		<view class="cate-section">
			<block v-for="(item,index) in homeBrandList" :key='index' v-if="homeBrandList.length>1">
				<view class="cate-item" @tap="navToList(item.url,item.brand_name)">
					<image :src="item.brand_picture"></image>
					<text>{{item.brand_name}}</text>
				</view>
			</block>

			<view class="cate-item" @tap="navToList('more','more')">
				<image src="/static/temp/more.png"></image>
				<text>更多</text>
			</view>
		</view>
		<!--公告滚动 -->
		<uni-notice-bar show-icon="true" scrollable="true" speed='60' single="true" :text="scroll_announcement">
		</uni-notice-bar>
		<!-- 分类推荐楼层 -->
		<view class="f-header m-t">
			<image src="/static/temp/h1.png"></image>
			<view class="tit-box">
				<text class="tit">精选分类</text>
				<text class="tit2">Selected Classification For You</text>
			</view>
		</view>
		<block v-for="(item,index) in goodListAll" :key='index'>
			<view class="hot-floor">
				<view class="floor-img-box">
					<image class="floor-img" :src="item.bg_picture" mode="scaleToFill"></image>
				</view>
				<scroll-view class="floor-list" scroll-x>
					<view class="scoll-wrapper">
						<view v-for="(item, index) in item.brand" :key="index" class="floor-item" @click="navToDetailPage(item,'class')"
						 v-if="index<6">
							<image :src="item.brand_picture" mode="aspectFill"></image>
							<text class="title clamp text-center">{{item.brand_name}}</text>
						</view>
						<view class="more" @tap="navToList('more','more')">
							<text>查看全部</text>
							<text>More+</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</block>
		<!-- 热门 -->
		<view class="f-header m-t">
			<image src="/static/temp/h1.png"></image>
			<view class="tit-box">
				<text class="tit">热门产品</text>
				<text class="tit2">Guess You Like It</text>
			</view>
		</view>
		<view class="guess-section">
			<view v-for="(item, index) in hotGoodList" :key="index" class="guess-item" @click="navToDetailPage(item,'good')">
				<view class="image-wrapper">
					<image :src="item.describe_picture[0].describe_picture" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.class_name}}</text>
				<text class="price">￥{{item.general_configure[0].price}}</text>
			</view>
		</view>
		<!-- 公告弹窗 -->
		<view class="cu-modal" :class="modalName=='Image'?'show':''" @touchmove.stop.prevent="moveHandle">
			<view class="cu-dialog">
				<block v-for="(item,index) in notice_pop_all" :key='index'>
				</block>
				<view class="cu-bar justify-end text-black">
					<view class="content text-bold">
						{{notice_pop_all[notice_current].notice_title}}
					</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close "></text>
					</view>
				</view>
				<scroll-view scroll-y @touchmove.prevent>
					<view style="width: 100%;height: 340px;">
						<view class="padding-sm margin-bottom">
							<u-parse :content="notice_pop_all[notice_current].notice_content" :imageProp='imageProp' @preview="preview"
							 @navigate="navigate"></u-parse>
						</view>
					</view>
				</scroll-view>
				<!-- </view> -->
				<uni-pagination prev-text='上一条' next-text='下一条' :total="pop_notice_length" pageSize='1' @change='pagination_change'></uni-pagination>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="hideModal">我知道了</view>
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
	import uParse from '@/components/uParse/src/wxParse.vue'
	import uniNoticeBar from "@/components/uni-notice-bar/uni-notice-bar.vue";
	import uniPagination from "@/components/uni-pagination/uni-pagination.vue";
	export default {
		components: {
			uniNoticeBar,
			uniPagination,
			uParse
		},
		data() {
			return {
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				imageProp: {
					mode: 'aspectFit',
					padding: 0,
					lazyLoad: true,
					domain: "liangxuan.natapp1.cc"
				},
				// 公告弹窗
				modalName: 'Image',
				notice_pop_all: [],
				notice_current: 0,
				pop_notice_length: null,
				goodListAll: [],
				scroll_announcement: [],
				homeBrandList: [],
				hotGoodList: [],
				trueImgList: []
			};
		},
		computed: {
			...mapState(['token'])
		},
		onPullDownRefresh() {
			var _self = this;
			this.getTrueImgList();
			this.getHomeBrandList();
			this.getHotGoodList();
			this.loadData();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 600)
		},
		onLoad() {
			uni.showLoading({
				title: '加载中...'
			})
			setTimeout(() => {
				this.getPopNotice();
				this.getTrueImgList();
				this.getHomeBrandList();
				this.getHotGoodList();
				this.loadData();
				uni.hideLoading();
			}, 600)
		},
		methods: {
			// 跳转到关于我们
			navToAboutUs(is_jump){
				if(is_jump){
					uni.navigateTo({
						url:'/pages/set/aboutUs/aboutUs'
					})
				}
			},
			
			getTrueImgList() {
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/picture/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						this.check_statusCode(res.statusCode)
						this.trueImgList = res.data;
						this.getGoodListAll();
					}
				});
			},
			getHotGoodList() {
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/hot_good_class/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						this.check_statusCode(res.statusCode)
						this.hotGoodList = res.data
					}
				});
			},
			getGoodListAll() {
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/home_good_type/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						this.check_statusCode(res.statusCode)
						this.goodListAll = res.data
						for (var i = 0; i < this.goodListAll.length; i++) {
							this.goodListAll[i].bg_picture = this.trueImgList[i].picture
						}
					}
				});
			},
			getHomeBrandList() {
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/home_brand/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						this.check_statusCode(res.statusCode)
						this.homeBrandList = res.data

					}
				});
			},
			// 解决蒙层滚动问题
			moveHandle() {
				return;
			},
			// 测试数据
			navToList(detail_url, title_name) {
				if (detail_url == 'more') {
					uni.showLoading({
						title: "跳转中..."
					})
					setTimeout(() => {
						uni.switchTab({
							url: '../category/category'
						})
						uni.hideLoading();
					}, 500)
				} else {
					var data = {
						detail_url: detail_url,
						title_name: title_name
					}
					uni.navigateTo({
						url: '/pages/product/list?data=' + JSON.stringify(data)

					})
				}
			},
			hideModal(e) {
				this.modalName = null
			},
			pagination_change(e) {
				this.notice_current = e.current - 1;
			},
			getScroll_announcements() {
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/announcements/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						this.check_statusCode(res.statusCode);
						// this.scroll_announcement=res.data.results
						for (var i = 0; i < res.data.results.length; i++) {
							var announcementItem = "【" + res.data.results[i].title + "】" + "　" + res.data.results[i].content + "　　　　　　";
							this.scroll_announcement.push(announcementItem);
						}
						this.scroll_announcement.join("|==|");
					}
				});
			},
			getBanners() {
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/banners/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						res.data.results
						let carouselList = res.data;
						this.swiperLength = carouselList.length;
						this.carouselList = carouselList;
					}
				});
			},
			getPopNotice() {
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/popnotice/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						// res.data = res.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
						this.pop_notice_length = res.data.length;
						this.notice_pop_all = res.data;
					}
				});
			},
			loadData() {
				// 加载banners
				this.getBanners();
				this.getScroll_announcements();
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			//详情页
			navToDetailPage(item, type) {
				var item_url = item.url
				var title_name = item.brand_name
				if (type == 'class') {
					var data = {
						detail_url: item_url,
						title_name: title_name
					}
					uni.navigateTo({
						url: '/pages/product/list?data=' + JSON.stringify(data)

					})
				} else {
					uni.navigateTo({
						url: `/pages/product/product?item_url=${item_url}`
					})
				}
				return;
			},
		},
	}
</script>

<style lang="scss">
	/* #ifdef MP */
	.mp-search-box {
		position: absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;

		.ser-input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, .6);
		}
	}

	page {
		.cate-section {
			position: relative;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			z-index: 5;
			border-radius: 16upx 16upx 0 0;
			margin-top: -20upx;
		}
		.carousel-section {
			padding: 0;

			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel {
				.carousel-item {
					padding: 0;
				}
			}
			.swiper-dots {
				left: 45upx;
				bottom: 40upx;
			}
		}
	}

	/* #endif */
	page {
		background: #f5f5f5;
	}
	.m-t {
		margin-top: 16upx;
	}
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}

	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 25%;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}

	.ad-1 {
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;

		image {
			width: 100%;
			height: 100%;
		}
	}


	.f-header {
		display: flex;
		align-items: center;
		height: 140upx;
		padding: 6upx 30upx 8upx;
		background: #fff;

		image {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}

		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.tit {
			font-size: $font-lg +2upx;
			color: #font-color-dark;
			line-height: 1.3;
		}

		.tit2 {
			font-size: $font-sm;
			color: $font-color-light;
		}

		.icon-you {
			font-size: $font-lg +2upx;
			color: $font-color-light;
		}
	}


	/* 分类推荐楼层 */
	.hot-floor {
		width: 100%;
		overflow: hidden;
		margin-bottom: 20upx;

		.floor-img-box {
			width: 100%;
			height: 320upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255, 255, 255, .06) 30%, #f8f8f8);
			}
		}

		.floor-img {
			width: 100%;
			height: 100%;
		}

		.floor-list {
			white-space: nowrap;
			padding: 20upx;
			padding-right: 50upx;
			border-radius: 6upx;
			margin-top: -140upx;
			margin-left: 30upx;
			background: #fff;
			box-shadow: 1px 1px 5px rgba(0, 0, 0, .2);
			position: relative;
			z-index: 1;
		}

		.scoll-wrapper {
			display: flex;
			align-items: flex-start;
		}

		.floor-item {
			width: 180upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;
			text-align: center;

			image {
				width: 180upx;
				height: 180upx;
				border-radius: 6upx;
			}
		}

		.more {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			border-radius: 6upx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;

			text:first-child {
				margin-bottom: 4upx;
			}
		}
	}

	/* 猜你喜欢 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.guess-item {
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

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
</style>
