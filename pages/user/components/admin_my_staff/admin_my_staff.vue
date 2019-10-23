<template>
	<view>
		<view class="cu-list menu-avatar">
			<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in datalist" :key="index">
				<view class="cu-avatar round lg imgHelp">
					<image :src="'/static/avatar/avatar'+item.avatarIndex+'.png'" mode="aspectFill"></image>
				</view>
				<view class="content ">
					<view class="text-grey">
						<text class="text-black cuIcon-my" style="width: 120px;">{{item.username}}</text><text style="width: 150px;"
						 class="cuIcon-mobile margin-left-lg text-sm">{{item.phone_num}}</text></view>
					<view class="text-grey text-sm">
						<text class="cuIcon-weixin" style="width: 120px;">{{item.contact_wx}}</text><text style="width: 150px;" class="cuIcon-edit margin-left-lg">{{item.salesman_formal.length}}</text>
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
	export default {
		data() {
			return {};
		},
		name: 'admin_my_staff',
		props: {
			datalist: {
				type: Array,
				default: () => []
			}
		},
		methods: {}

	}
</script>

<style scoped lang="scss">
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
