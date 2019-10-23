<template>
	<view class="content b-t">
		<view class="cu-list menu-avatar padding-bottom-sm">
			<view class='cu-item' v-for="(item, index) in addressList" :class="modalName2=='move-box-2'+ index?'move-cur':''"
			 @touchstart="ListTouchStart2" @touchmove="ListTouchMove2" @touchend="ListTouchEnd2" :data-target="'move-box-2' + index"
			 :key="index" @click="checkAddress(item)">
				<view class="wrapper padding-lr">
					<view class="address-box">
						<text v-if="item.default" class="tag" style="width: 46px !important; align-content: center; height: 18px;">默认</text>
						<text class="address">{{item.address}} {{item.area}}</text>
					</view>
					<view class="u-box">
						<text class="name">{{item.name}}</text>
						<text class="mobile">{{item.mobile}}</text>
					</view>
				</view>
				<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
				<view class="move">
					<view class="bg-grey" @tap.stop="setDefault(item)">默认</view>
					<view class="bg-red" @tap.stop="deleteAddress(item)">删除</view>
				</view>
			</view>
		</view>
		<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			提示：向左侧滑动即可删除或设为默认地址
		</text>
		<button class="add-btn" @click="addAddress('add',null)">新增地址</button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				source: 0,
				addressList: [],
				modalName2: null,
				listTouchStart: 0,
			}
		},
		computed: {
			...mapState(['token'])
		},
		onLoad(option) {
			this.source = option.source;
		},
		onShow() {
			this.addressList = []
			this.getUserAddress();
		},
		methods: {
			setDefault(item) {
				var that = this;
				var now_token = that.token
				uni.request({
					url: that.global_baseUrl + '/set_default/' + item.id + "/",
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						that.check_statusCode(res.statusCode)
						that.addressList = [];
						that.getUserAddress();
					}
				});
			},
			// 删除地址
			deleteAddress(item) {
				var that = this;
				uni.showModal({
					title: '提示',
					content: '确定删除该地址吗？',
					success: function(res) {
						if (res.confirm) {
							var now_token = that.token
							uni.request({
								url: that.global_baseUrl + '/user_address_detail/' + item.id + "/",
								header: {
									'Authorization': ' Token ' + now_token
								},
								method: "DELETE",
								success: (res) => {
									that.check_statusCode(res.statusCode)
									that.addressList = [];
									that.getUserAddress();
								}
							});
						} else if (res.cancel) {

						}
					}
				});
			},
			getUserAddress() {
				this.addressList = [];
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/user_address/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						this.check_statusCode(res.statusCode);
						for (var i = 0; i < res.data.length; i++) {
							var temp_address = {
								id: res.data[i].id,
								name: res.data[i].consignee_name,
								mobile: res.data[i].phone_num,
								address: res.data[i].consinfee_address,
								default: i == 0 ? true : false,
								area: res.data[i].note,
								belong_user: res.data[i].belong_user
							}
							this.addressList.push(temp_address);
						}
					},

				});
			},
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item) {
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			// ListTouch触摸开始
			ListTouchStart2(e) {
				this.listTouchStart2 = e.touches[0].pageX

			},
			// ListTouch计算方向
			ListTouchMove2(e) {
				this.listTouchDirection2 = e.touches[0].pageX - this.listTouchStart2 > 0 ? 'right' : 'left';
			},

			// ListTouch计算滚动
			ListTouchEnd2(e) {
				if (this.listTouchDirection2 == 'left') {
					this.modalName2 = e.currentTarget.dataset.target
				} else {
					this.modalName2 = null
				}
				this.listTouchDirection2 = null
			},
			//添加或修改成功之后回调
			// refreshList(data, type){
			//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
			// this.addressList.unshift(data);
			// }
		}
	}
</script>

<style lang='scss'>
	page {
		padding-bottom: 120upx;
	}

	.content {
		position: relative;
	}

	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		;
		background: #fff;
		position: relative;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		align-items: center;

		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address {
			font-size: 30upx;
			color: $font-color-dark;
		}
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
