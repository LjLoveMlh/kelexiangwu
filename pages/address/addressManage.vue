<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" @input="setValue('name',addressData.name)" type="text" v-model="addressData.name" placeholder="收货人姓名"
			 placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" @input="setValue('mobile',addressData.mobile)" type="number" v-model="addressData.mobile"
			 placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">地址</text>
			<view class="input flex justify-between padding-right" >
				<view>
					 <input type="text"
					 disabled='true'
						class="input"
						:value="temp_address"
					  placeholder="收货人地址"
					  @blur="setValue('address',temp_address)" />
				</view>
				<view  class="yticon icon-shouhuodizhi" @click="chooseLocation"></view>
			</view>
		</view>
		<view class="row b-b">
			<text class="tit">门牌号</text>
			<input class="input" @input="setValue('area',addressData.area)" type="text"  v-model="addressData.area" placeholder="楼号、门牌"
			 placeholder-class="placeholder" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			wPicker
		},
		data() {
			return {
				addressData: {},
				temp_add_address: true,
				temp_address:''
			}
		},
		computed: {
			...mapState(['token','userInfo'])
		},
		onLoad(option) {
			let title = '新增收货地址';
			if (option.type === 'edit') {
				this.temp_add_address = false;
				title = '编辑收货地址'
				this.addressData = JSON.parse(option.data)
				this.temp_address=this.addressData.address
			} else {
				this.addressData = {}
			}
		
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			setValue(do_what, value) {
				switch (do_what) {
					case 'name':
						this.addressData.name = value;
						break;
					case 'mobile':
						this.addressData.mobile = value;
						break;
					case 'area':
						this.addressData.area = value;
						break;
					case 'address':
						this.addressData.address = value;
				}
			},
			//地图选择地址
			chooseLocation() {
				var _self=this;
				_self.selfInput=false;
				uni.chooseLocation({
					success: (data) => {
						_self.temp_address=''
						_self.addressData.address = data.address;
						_self.temp_address=data.address
					}
				})
			},

			//提交
			confirm() {
				var that=this;
				uni.showModal({
					title: '提示',
					content: '确定添加该地址吗？',
					success: function(res) {
						if (res.confirm) {
							let data = that.addressData;
							
							if (!data.name) {
								that.$api.msg('请填写收货人姓名');
								return;
							}
							if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.mobile)) {
								that.$api.msg('请输入正确的手机号码');
								return;
							}
							if (!data.area) {
								that.$api.msg('请填写门牌号信息');
								return;
							}
							var now_token = that.token
										
							// 修改新增数据
							var temp_data = {
								consignee_name: that.addressData.name,
								consinfee_address: that.addressData.address,
								phone_num: that.addressData.mobile,
								note: that.addressData.area,
								belong_user: that.userInfo.id
							}
							var temp_url = null;
							var temp_method = null;
							if (that.temp_add_address) {
								temp_url = that.global_baseUrl + '/user_address/';
								temp_method = 'POST';
							} else {
								temp_url = that.global_baseUrl + '/user_address_detail/' + that.addressData.id + "/";
								temp_method = 'PUT';
							}
							uni.request({
								url: temp_url,
								header: {
									'Authorization': ' Token ' + now_token
								},
								data: temp_data,
								method: temp_method,
								success: (res) => {
									that.check_statusCode(that.statusCode)
								}
							});
							//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
							// this.$api.prePage().refreshList(data, this.manageType);
							// this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
							setTimeout(() => {
								uni.navigateBack()
							}, 500)
						} else if (res.cancel) {
				
						}
					}
				});
				
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
