<template>
	<view v-if="salesman_dataList.length>0">
		<view class="cu-list menu-avatar"  >
			<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in salesman_dataList"
			 :key="index"
			 :data-target="'move-box-' + index">
				<view class="cu-avatar round lg imgHelp" @tap="ViewImage(item.door_photo)">
					<image :src="item.door_photo" mode="aspectFill"></image>
				</view>
				<view class="content ">
					<view class="text-grey">
						<text class="text-black" style="width: 120px;">{{item.username}}</text><text style="width: 150px;" class="margin-left-lg text-sm">{{item.phone_num}}</text></view>
					<view class="text-grey text-sm">
						<text class="cuIcon-weixin"  style="width: 120px;">{{item.contact_wx}}</text><text  class="cuIcon-myfill margin-left-lg" style="width: 120px;" >{{item.charge_man}}</text>
					</view>
				</view>
				<view class="action" style="width:150rpx;">
					<view class="text-green text-sm">{{item.start_time}}</view>
					<view class="text-red  text-sm">{{item.end_time}}</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		components: {},
		data() {
			return {
				salesman_dataList: [],
				listTouchStart: 0,
				listTouchDirection: null,
				modalName: null,
			}
		},
		computed: {
			...mapState(['token'])
		},
		methods: {
			 getSalesManData() {
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/salesman/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						this.check_statusCode(res.statusCode);
						this.salesman_dataList = res.data[0].salesman_formal;
					}
				});
			},
			ViewImage(e) {
				var imgList=[];
				imgList.push(e)
				uni.previewImage({
					urls: imgList,
				});
			},
		},
		onLoad() {
			uni.showLoading({
				title:'数据加载中'
			})
			this.getSalesManData();
			setTimeout(() => {
				uni.hideLoading();
			}, 1000)
		},


	}
</script>


<style scoped lang="scss">
	// 悬浮按钮
	.circle-float {
		position: fixed;
		left: 50%;
		bottom: 70rpx;
		transform: translate(-50%, -50%);
		/* 50%为自身尺寸的一半 */
		-webkit-transform: translate(-50%, -50%);

		.btn_add_text {
			font-size: 40upx;
			font-weight: bold;
		}
	}
	.imgHelp {
		width: 96rpx;
		height: 96rpx;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
</style>
