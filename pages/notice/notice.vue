<template>
	<view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center solid-bottom shadow shadow-lg">
				<view class="cu-item flex-sub" :class="index==TabCur?'text-red cur':''" v-for="(item,index) in noticeList" :key="index"
				 @tap="tabSelect" :data-id="index">
					{{item.text}}
				</view>
			</view>
		</scroll-view>

		<!-- 滚动公告显示 -->
		<view class="cu-list menu-avatar  padding-bottom-sm" v-if="TabCur==0">
			<view class="cu-item" v-for="(item,index) in scroll_content" :key="index" @tap="showScrollModel(item)">
				<view class="cu-avatar round">
					<text class="cuIcon-notification text-sm"></text>
				</view>
				<view class="content text-cut">
					<view class="text-black">{{item.title}}</view>
					<view class="text-gray text-sm text-cut">
						{{item.content}}</view>
				</view>
				<view class="action" style="width:55px">
					<view class="text-grey text-xs">{{item.edit_date}}</view>
					<view class="sm">{{item.edit_time}}</view>
				</view>
			</view>
		</view>
		
		<!-- 弹窗公告显示 -->
		<view class="cu-list menu-avatar  padding-bottom-sm"  v-if="TabCur==1">
			<view class="cu-item"  v-for="(item,index) in pop_content" :key="index"  @tap="navDetail(item)">
				<view class="cu-avatar round ">
					<text class="cuIcon-notice text-sm"></text>
				</view>
				<view class="content">
					<view class="text-black">{{item.notice_title}}</view>
					<view class="text-gray text-sm text-cut">
						{{item.notice_content}}</view>
				</view>
				<view class="action" style="width:55px">
					<view class="text-grey text-xs">{{item.edit_date}}</view>
					<view class="sm">{{item.edit_time}}</view>
				</view>
			</view>
		</view>
		
		<!-- 滚动公告模态框 -->
		<view class="cu-modal" :class="modalName_eidt=='Image'?'show':''" v-if="modalName_eidt=='Image'">
			<view class="cu-dialog">
				<view class="cu-bar text-black">
					<view class="margin-left flex justify-between">
						<view class="text-gray">最近修改时间</view>
						<view class="margin-left-lg text-sm padding-top-xs">
							{{scitem.edit_date}} {{scitem.edit_time}}</view>
					</view>
					<view class="action margin-right-xs" @tap="hideModal">
						<text class="cuIcon-close"></text>
					</view>
				</view>
				<view class="padding-lr-lg">
					<input type="text" disabled='true' class="margin-bottom text-bold text-black margin-lr align-center" :value="scitem.title">
					<textarea disabled='true' :value="scitem.content" />
					</view>
					<view class="cu-bar bg-white">
						<view class="action margin-0 flex-sub  solid-left text-red" @tap="hideModal">
							关闭
						</view>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex';
	export default {
		data() {
			return {
				pop_content:[],
				scitem:null,
				scroll_content: [],
				scroll_content_temp: null,
				TabCur: 0,
				scrollLeft: 0,
				noticeList: [{
						text: '滚动通知'
					},
					{
						text: '弹窗通知'
					}
				],
				modalName_eidt:null
			}
		},
		computed: {
			...mapState(['token','buy_time'])
		},
		onLoad() {
			uni.showLoading({
				title:'加载中...'
			});
			this.getScroll_announcements();
			this.getpPopNotice();
			setTimeout(()=>{
				uni.hideLoading();
			},400);
	
		},
		methods: {
			hideModal(){
				this.modalName_eidt=null
			}
			,
			showScrollModel(item){
				this.scitem=item
				if(this.scitem!=null){
					this.modalName_eidt='Image'
				}
				
			},
			// 解决蒙层滚动问题
			moveHandle() {
				return;
			},
			navDetail(item){
				uni.setStorageSync('popItem',item);
				uni.navigateTo({
					url:'/pages/notice/noticePop/noticePop'
				})
			},
			
			tabSelect(e) {
				uni.showLoading({
					title:'加载中'
				})
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				setTimeout(()=>{
				uni.hideLoading();
				},400);
				
				
			},
			getpPopNotice(){
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/popnotice/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						this.check_statusCode(res.data.statusCode);
						res.data.forEach(item => {
							let temp_item = {
								id: item.id,
								notice_title:item.notice_title,
								notice_content: item.notice_content,
								edit_date: item.create_time.substring(0,10),
								edit_time: item.create_time.substring(11,16)
							}
							this.pop_content.push(temp_item);
						})
				
					}
				});
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
						this.check_statusCode(res.data.statusCode);
						res.data.results.forEach(item => {
							let temp_item = {
								id: item.id,
								title: item.title,
								content: item.content,
								edit_date: item.create_time.substring(0, 10),
								edit_time: item.create_time.substring(11, 16)
							}
							this.scroll_content.push(temp_item);
						})

					}
				});
			},
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	.content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	}

	.title {
		display: flex;
		align-items: center;
		height: 90upx;
		font-size: 32upx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 260upx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}
</style>
