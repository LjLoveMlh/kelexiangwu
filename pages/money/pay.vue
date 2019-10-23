<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{all_data.first_data.count_price}}</text>
		</view>
		<view class="pay-type-list">
			<view class="type-item" @click="changePayType(3)">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">线下支付</text>
					<text>请尽早在账期内完成打款</text>
				</view>
				<label class="radio">
					<radio value="" disabled="true" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
		</view>
		<text class="mix-btn" @click="confirm">确认下单</text>

		<!-- 登录密码验证 -->
		<view class="cu-modal" :class="modalName=='DialogModal2'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">为了您的账户安全,请输入账号密码标题</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<input placeholder="请输入账号密码..." password='true' name="input" @blur="getPassWord"></input>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="checkPassWord">确定</view>
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
		data() {
			return {
				payType: 1,
				all_data: {},
				modalName: null,
				temp_password: ''
			};
		},
		computed: {
			...mapState(['token'])
		},
		onLoad(options) {

			if (options.all_data) {
				this.all_data = JSON.parse(options.all_data);

			}
		},

		methods: {
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			// 登录密码校验模态框
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			getPassWord(e) {
				// console.log(e)
				// this.temp_password=
			},
			checkPassWord(e) {
				// // console.log(e)
				// var now_token = this.token
				// uni.request({
				// 	url: this.global_baseUrl + '/picture/',
				// 	header: {
				// 		'Authorization': ' Token ' + now_token
				// 	},
				// 	method: "GET",
				// 	success: (res) => {
				// 		this.check_statusCode(res.statusCode)
				// 	}
				// });
			},
			//确认支付
			confirm: async function() {
				uni.showLoading({
					title: '创建订单中...'
				})
				var _self = this;
				var temp_data = this.all_data.first_data;
				var now_token = this.token
				setTimeout(function() {
					uni.request({
						url: _self.global_baseUrl + '/orders/',
						header: {
							'Authorization': ' Token ' + now_token
						},
						method: "POST",
						data: temp_data,
						success: (res) => {
							_self.check_statusCode(res.statusCode)
							var temp_id = res.data.id;
							// 第二部请求的信息
							if (_self.all_data.isFromCart) {
								_self.all_data.second_need_data.forEach(item => {
									var temp_data2 = {
										price: item.goods.price,
										value: item.goods.value,
										name: item.goods.title,
										picture: item.goods.picture,
										goods_num: item.nums,
										order: temp_id,
										goods: item.goods.id,
									}
									uni.request({
										url: _self.global_baseUrl + '/cart_goods',
										header: {
											'Authorization': ' Token ' + now_token
										},
										method: "POST",
										data: temp_data2,
										success: (res) => {
											_self.check_statusCode(res.statusCode)
											uni.redirectTo({
												url: '/pages/money/paySuccess'
											})
										}
									});
								})
							} else {
								var temp_data2 = {
									price: _self.all_data.second_need_data.price,
									value: _self.all_data.second_need_data.value,
									name: _self.all_data.second_need_data.good_info.title,
									picture: _self.all_data.second_need_data.picture,
									goods_num: _self.all_data.second_need_data.count_num,
									order: temp_id,
									goods: _self.all_data.second_need_data.id
								}
								uni.request({
									url: _self.global_baseUrl + '/single_goods',
									header: {
										'Authorization': ' Token ' + now_token
									},
									method: "POST",
									data: temp_data2,
									success: (res) => {
										_self.check_statusCode(res.statusCode)
									}
								});
							}
							// console.log(temp_id);
							// temp_data.order=temp_id;
							// console.log(temp_data);
							var addressData = temp_data.address;
							addressData.order=temp_id;
							uni.request({
								url: _self.global_baseUrl + '/orderaddress/',
								header: {
									'Authorization': ' Token ' + now_token
								},
								method: "POST",
								data: addressData,
								success: (res) => {
									_self.check_statusCode(res.statusCode)
									uni.showToast({
										icon: 'success',
										title: '下单成功！'
									})
									setTimeout(() => {
										uni.redirectTo({
											url: '/pages/money/paySuccess'
										})
									}, 500)

								}
							});
						}
					});
					uni.hideLoading();
				}, 600);


			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
