<template>
	<view>
		<form @submit="confirmAddSalesMan" enctype='multipart/form-data'>
			<!-- 账号相关 -->
			<block>
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-titles text-orange "></text>账号
					</view>
				</view>
				<view class="cu-form-group ">
					<view class="title">用户名</view>
					<input placeholder="用户名" :value="username" name='username' data-key="username" @input='inputChage'></input>
				</view>
				<view class="cu-form-group">
					<view class="title">密码</view>
					<input placeholder="密码" :value="password" name="password" data-key="password" @input='inputChage'></input>
				</view>
				<view class="cu-form-group">
					<view class="title">确认密码</view>
					<input placeholder="确认密码" :value="re_password" name="re_password" data-key="re_password" @input='inputChage'></input>
				</view>
			</block>
			<!-- 个人信息相关 -->
			<block>
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-titles text-blue "></text>个人信息
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">手机号</view>
					<input placeholder="手机号" :value="phone_num" name='phone_num' data-key="phone_num" @input='inputChage'></input>
				</view>
				<view class="cu-form-group">
					<view class="title">QQ</view>
					<input placeholder="QQ" :value="contact_qq" name='contact_qq' data-key="contact_qq" @input='inputChage'></input>
				</view>
				<view class="cu-form-group">
					<view class="title">微信</view>
					<input placeholder="微信" :value="contact_wx" name="contact_wx" data-key="contact_wx" @input='inputChage'></input>
				</view>
			</block>
			<!-- 重要日期 -->
			<input style="display: none;" :value="last_login" name="last_login" :disabled="true"></input>
			<input style="display: none;" :value="start_time" name="date_joined" :disabled="true"></input>
			<block>
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-titles text-red "></text>重要日期
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">账户生效时间</view>
					<view class="flex">
						<picker style=" width:150px;margin-right: -50px;" class="ljPicker1" mode="date" :value="date_start" data-type='date_start'
						 start="2015-09-01" end="2020-09-01" @change="DateChange">
							<view class="picker">
								{{date_start}}
							</view>
						</picker>
						<picker mode="time" :value="time_start" start="09:01" end="21:01" data-type='time_start' @change="TimeChange">
							<view class="picker">
								{{time_start}}
							</view>
						</picker>
					</view>
					<input style="display: none;" :value="[date_start+' '+ time_start]" name="start_time" :disabled="true" :v-show="false"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">账户失效时间</view>
					<view class="flex">
						<picker style=" width:150px;margin-right: -50px;" class="ljPicker1" mode="date" data-type='date_end' :value="date_end"
						 start="2015-09-01" end="2020-09-01" @change="DateChange">
							<view class="picker">
								{{date_end}}
							</view>
						</picker>
						<picker mode="time" :value="time_end" start="09:01" end="21:01" data-type='time_end' @change="TimeChange">
							<view class="picker">
								{{time_end}}
							</view>
						</picker>
					</view>
					<input style="display: none;" :value="[date_end+' '+ time_end]" name="end_time" :disabled="true" :v-show="false"></input>
				</view>
			</block>

			<!-- 代理信息相关 -->
			<block>
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-titles text-green "></text>代理信息
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">商户名称</view>
					<input placeholder="商户名称" :value="store_name" name="store_name" data-key="store_name" @input='inputChage'></input>
				</view>
				<view class="cu-form-group">
					<view class="title">负责人</view>
					<input placeholder="负责人" :value="charge_man" name="charge_man" data-key="charge_man" @input='inputChage'></input>
				</view>
				<view class="cu-form-group">
					<view class="title">身份证号</view>
					<input placeholder="身份证号" :value="idcard_num" name="idcard_num" data-key="idcard_num" @input='inputChage'></input>
				</view>
				<block v-for="(item,index) in imgListInfo" :key='index'>
					<input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" :name='item.input_name'>
					<input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" :name='item.input_name'>
					<input  type="file" accept="image/png, image/jpeg, image/gif, image/jpg" :name='item.input_name'>
					<input  type="file" accept="image/png, image/jpeg, image/gif, image/jpg" :name='item.input_name'>
				</block>
				<!-- 图片相关 -->
				<!-- <block v-for="(item,index) in imgListInfo" :key='index'>
					<input style="display: none;" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" :name='item.input_name' >
					<view class="cu-bar bg-white ">
						<view class="action text-black">
							{{item.text}}
						</view>
						<view class="action">
							{{item.index}}/4
						</view>
					</view>
					<view class="cu-form-group">
						<view class="grid col-4 grid-square flex-sub">
							<view class="bg-img" @tap="ViewImage(item.imgPath)" :data-url="item.imgPath" v-if="item.imgPath!=''">
								<image :src="item.imgPath" mode="aspectFill"></image>
								<view class="cu-tag bg-red" @tap.stop="DelImg(item.index)" :data-index="index">
									<text class='cuIcon-close'></text>
								</view>
							</view>
							<view class="solids" @tap="ChooseImage(item.index)" v-if="item.index ==index+1">
								<text class='cuIcon-cameraadd'></text>
							</view>
						</view>
					</view>
			 </block> -->

				<view class="cu-form-group">
					<view class="title">推荐人</view>
					<input placeholder="推荐人" :value="recommender" name='recommender' data-key="recommender" @input='inputChage'></input>
				</view>
				<view class="cu-form-group">
					<view class="title">所属业务员</view>
					<view class="action">
						当前业务员
					</view>
				</view>
			</block>
			<view class="padding flex flex-direction margin-tb-xl">
				<button form-type="submit" class="cu-btn bg-gradual-red margin-tb-sm lg">提交</button>
			</view>
		</form>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				index: -1,
				time: '12:01',
				date: '2018-12-25',
				time_start: '12:01',
				date_start: '2018-12-25',
				time_end: '12:01',
				date_end: '2018-12-25',
				last_login: '2019-08-01 00:00',
				imgList: [],
				imgListInfo: [{
						text: '身份证正面',
						index: 1,
						imgPath: '',
						input_name: 'idcard_positive'
					},
					{
						text: '身份证反面',
						index: 2,
						imgPath: '',
						input_name: 'idcard_negative'
					},
					{
						text: '营业执照',
						index: 3,
						imgPath: '',
						input_name: 'business_license'
					},
					{
						text: '门头照',
						index: 4,
						imgPath: '',
						input_name: 'door_photo'
					}
				],
				modalName: null,
				textareaAValue: '',
				textareaBValue: '',
				current_userInfo: {
					password: "",
					username: "",
					phone_num: "",
					contact_qq: "",
					contact_wx: "",
					store_name: "",
					idcard_num: "",
					recommender: "",
					charge_man: "",
				}
			};
		},
		computed: {
			...mapState(['token'])
		},
		methods: {
			inputChage(e) {
				console.log(e.currentTarget.dataset.key)
				const key = e.currentTarget.dataset.key;
				thi.current_userInfo[key] = e.detail.value;
			},
			TimeChange(e) {
				console.log('时间')
				console.log(e)
				// this.time = e.detail.value
			},
			DateChange(e) {
				console.log('日期')
				console.log(e)
				// this.date = e.detail.value
			},
			ChooseImage(index) {
				var _self = this;
				if (_self.imgListInfo[index - 1].imgPath != '') {
					uni.showModal({
						title: '提示',
						content: '您已经选择一张了，是否重新选则',
						success: function(res) {
							if (res.confirm) {
								uni.chooseImage({
									count: 1, //默认9
									sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
									sourceType: ['album'], //从相册选择
									success: (res) => {
										_self.imgListInfo[index - 1].imgPath = '';
										_self.imgListInfo[index - 1].imgPath = res.tempFilePaths;
									}
								});
							} else if (res.cancel) {

							}
						}
					});
				} else {
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], //从相册选择
						success: (res) => {
							_self.imgListInfo[index - 1].imgPath = res.tempFilePaths;
						}
					});
				}

			},
			ViewImage(e) {
				uni.previewImage({
					urls: e,
				});
			},
			DelImg(index) {
				uni.showModal({
					title: '提示',
					content: '是否删除该图片，并重新选择',
					cancelText: '手滑',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgListInfo[index - 1].imgPath = '';
							this.ChooseImage();
						}
					}
				})
			},
			confirmAddSalesMan(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				var _self = this;
				const {
					password,
					username,
					phone_num,
					contact_qq,
					contact_wx,
					store_name,
					idcard_num,
					recommender,
					charge_man,
				} = this;
				var temp_data = {};
				console.log(this.current_userInfo);
				// 				var now_token = this.token
				// 				uni.request({
				// 					url: this.global_baseUrl + '/users/',
				// 					header: {
				// 						'Authorization': ' Token ' + now_token
				// 					},
				// 				data:temp_data,
				// 					method: "POST",
				// 					success: (res) => {
				// 						this.check_statusCode(res.statusCode)
				// 						
				// 				
				// 					}
				// 				});
				// 				var temp_media_list = [{
				// 						url: '/media/IDCard/'
				// 					},
				// 					{
				// 						url: '/media/IDCard/'
				// 					},
				// 					{
				// 						url: '/media/Business_License/'
				// 					},
				// 					{
				// 						url: '/media/Door_Photo/'
				// 					}
				// 				]
				// 				for (var i == 0; i < this.imgListInfo.length; i++) {
				// 					uni.uploadFile({
				// 						url: this.global_baseUrl + temp_media_list[i].url,
				// 						filePath: this.imgListInfo[i].imgPath,
				// 						name: 'file',
				// 						success: function(uploadFileRes) {
				// 							console.log(uploadFileRes.data);
				// 						}
				// 					});
				// 
				// 				}
			},
		}

	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}

	.ljPicker1:after {
		display: none !important;
	}
</style>
