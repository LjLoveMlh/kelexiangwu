<template>
	<view>
		<!-- 快捷设置 -->
		<uni-collapse accordion="false">
			<uni-collapse-item title="快捷设置">
				<view style="">
					<uni-collapse-item title="购买时间段设置" class='margin-left-sm text-df'>
						<view class="flex padding-lr-lg padding-tb">
							<view class="title flex-sub">当前时间段:</view>
							<view class="flex-sub flex justify-between padding-lr-lg">
								<view>
									<picker mode="time" :value="current_buy_time.start_time" @change="TimeChange_start">
										<view class="picker text-green text-lg">
											{{current_buy_time.start_time}}
										</view>
									</picker>
								</view>
								<view>至</view>
								<view>
									<picker mode="time" :value="current_buy_time.end_time" @change="TimeChange_end">
										<view class="picker text-red text-lg">
											{{current_buy_time.end_time}}
										</view>
									</picker>
								</view>
							</view>
						</view>
					</uni-collapse-item>
					<uni-collapse-item title="公告内容设置" class='margin-left-sm text-df'>
						<view style="padding: 20upx;">
							<uni-collapse-item title="滚动公告">
								<view class="cu-list menu-avatar padding-bottom-sm">
									<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in scroll_content"
									 :key="index" @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index"
									 @tap="edit_scroll_content(item,item.id)">
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
										<view class="move">
											<view class="bg-grey" @tap.stop="toUp_scroll_item(item.id)">置顶</view>
											<view class="bg-red" @tap.stop="remove_scroll_content(item.id)">删除</view>
										</view>
									</view>
									<button class="cu-btn block line-red lg radius" @tap="add_scroll_content">
										<text class="cuIcon-roundadd margin-right-sm"></text> 新增一个
									</button>
								</view>
							</uni-collapse-item>
							<uni-collapse-item title="弹窗公告">
								<view class="cu-list menu-avatar  padding-bottom-sm">
									<view class="cu-item" :class="modalName2=='move-box-2'+ index?'move-cur':''" v-for="(item,index) in pop_content"
									 :key="index" @touchstart="ListTouchStart2" @touchmove="ListTouchMove2" @touchend="ListTouchEnd2"
									 :data-scroll_content_item='item' :data-target="'move-box-2' + index" @tap="add_pop_notice('edit',item)">
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
										<view class="move">
											<view class="bg-grey" @tap.stop="toUp_pop_item(item.id)">置顶</view>
											<view class="bg-red" @tap.stop="remove_pop_content(item.id)">删除</view>
										</view>
									</view>
									<button class="cu-btn block line-red lg radius" @tap="add_pop_notice('add','add')">
										<text class="cuIcon-roundadd margin-right-sm"></text> 新增一个
									</button>
								</view>

							</uni-collapse-item>
						</view>
					</uni-collapse-item>
				</view>
			</uni-collapse-item>
		</uni-collapse>


		<!-- 我的业务员 -->
		<uni-collapse accordion="false">
			<uni-collapse-item title="我的业务员">
				<view>
					<admin-my-staff :datalist='staff_dataList' />
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<!-- 滚动公告修改弹窗 -->
		<view class="cu-modal" :class="modalName_eidt=='Image'?'show':''" v-if="scroll_content_temp!=null">
			<view class="cu-dialog">
				<view class="cu-bar text-black">
					<view class="margin-left flex justify-between" v-if="!scroll_content_do_add">
						<view class="text-gray">最近修改时间</view>
						<view class="margin-left-lg text-sm padding-top-xs">
							{{scroll_content_temp.scroll_content.edit_date}} {{scroll_content_temp.scroll_content.edit_time}}</view>
					</view>
					<view class="action margin-right-xs" @tap="hideModal">
						<text class="cuIcon-close"></text>
					</view>
				</view>
				<view class="padding-lr-lg">
					<input type="text" @input="input_title_check" class="margin-bottom text-bold text-black margin-lr align-center"
					 :value="scroll_content_temp.scroll_content.title" placeholder="请输入标题...">
					<textarea @input='input_check' placeholder="请输入公告内容..." :value="scroll_content_temp.scroll_content.content" />
					</view>
					<view class="cu-bar bg-white">
						<view class="action margin-0 flex-sub  solid-left text-red" @tap="confir_edit">
							{{scroll_content_do_add?"确认增加":"确认修改"}}
							</view>
					</view>
				</view>
				
			</view>
		</view>

	</view>
</template>
<script>

	import {
		mapState,mapMutations
	} from 'vuex';
	import uniCollapse from '@/components/uni-collapse/uni-collapse';
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item';
	import adminMyStaff from '@/pages/user/components/admin_my_staff/admin_my_staff.vue';
	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			adminMyStaff
		},
		data() {
			return {
				start_time: "08:00",
				end_time: "21:00",
				modalName: null,
				modalName2: null,
				listTouchStart: 0,
				listTouchStart2: 0,
				modalName_eidt: null,
				scroll_content: [],
				scroll_content_temp:null,
				add_scroll_content_value:null,
				scroll_content_do_add:false,
				pop_content:[],
				current_buy_time:null,
				staff_dataList:[]
			}
		},
		computed: {
			...mapState(['token','buy_time'])
		},
		onShow(){
			this.pop_content=[];
			this.getpPopNotice();
			this.getCurrentBuyTime();
		},  
		methods: {
			...mapMutations(['can_buy_change','set_buy_time','logout','set_wx_userinfo','set_token']),
			
			// 获取我的业务员数据
			getMyStaffData(){
				var _self = this;
				var now_token = this.token;
				var temp_staffList=[]
				uni.request({
					url: _self.global_baseUrl + '/salesman/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "GET",
					success: (res) => {
						_self.check_statusCode(res.statusCode)
						_self.staff_dataList=res.data[0].salesman_formal;
						_self.staff_dataList.forEach(item=>{
							item.avatarIndex=Math.floor(Math.random() * 10) + 1;
						})
					}
				});
				uni.hideLoading();
			},
			// 获取开启时间
				getCurrentBuyTime() {
				this.current_buy_time = this.buy_time;
			},
			// 修改开启时间
			editBuyTimeSpan() {
				uni.showLoading({
					title:'加载中...'
				})
				// 一些列处理后
				var _self=this;
				var temp_data=this.current_buy_time
				var now_token = this.token
				uni.request({
					url: this.global_baseUrl + '/shoptime/'+this.current_buy_time.id+'/',
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: "PUT",
					data:temp_data,
					success: (res) => {
						_self.check_statusCode(res.statusCode)
						uni.showToast({
							title: '操作成功！',
							icon:'success',
						});
						uni.hideLoading();
						var temp_data = {
							id:res.data.id,
							startTime:res.data.start_time,
							endTime:res.data.end_time,
						}
						_self.set_buy_time(temp_data);
						_self.getCurrentBuyTime();
					}
				});
			},
			
			// 弹窗公告新增/修改
			add_pop_notice(do_what,item){
				var trans_data={
						do_what:do_what,
						item:item
					}
					if(do_what=='edit')
					{
						let temp_edit_data=trans_data
						trans_data={
							do_what:do_what,
							item:null
						}
						uni.setStorageSync("edit_content",temp_edit_data);
							uni.navigateTo({
							url:'./adminPopNotice/adminPopNotice?trans_data='+JSON.stringify(trans_data)
						})
					}else{
							uni.navigateTo({
							url:'./adminPopNotice/adminPopNotice?trans_data='+JSON.stringify(trans_data)
						})
					}
					
			
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
			
			getScroll_announcements(){
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
								title:item.title,
								content: item.content,
								edit_date: item.create_time.substring(0,10),
								edit_time: item.create_time.substring(11,16)
							}
							this.scroll_content.push(temp_item);
						})
				
					}
				});
			},
			remove_scroll_content(e){
				var _self=this
				// this.scroll_content.splice(e,1);
				uni.showModal({
    title: '提示',
    content: '确定删除该公告吗？',
    success: function (res) {
        if (res.confirm) {
          	var temp_url=null;
          var temp_method=null;
          var edit_id=e
          	temp_url=_self.global_baseUrl + '/announcements/'+ edit_id+'/';
          	temp_method='DELETE';
          
          var now_token = _self.token
          uni.request({
          	url: temp_url,
          	header: {
          		'Authorization': ' Token ' + now_token
          	},
          	method: temp_method,
          	success: (res) => {
          		_self.check_statusCode(res.statusCode)
          		_self.scroll_content=[];
          		_self.getScroll_announcements();
          	}
          });	
        } else if (res.cancel) {
           
        }
    }
});
			},
			edit_scroll_content(item, index) {
				this.scroll_content_do_add=false;
				this.modalName_eidt='Image';
				this.scroll_content_temp={
					scroll_content:item,
					index:index
				};
			},
			add_scroll_content(e) {
				this.modalName_eidt='Image';
				this.scroll_content_do_add=true;
				this.scroll_content_temp={
					scroll_content:{
						id:this.scroll_content.length,
						title:'',
						content:"",
						edit_date:"",
						edit_time:""
					},
					index:this.scroll_content.length
				}
				
			},
			//滚动内容输入
			input_check(e){
			this.scroll_content_temp.scroll_content.content=e.detail.value;
			this.add_scroll_content_value=e.detail.value;
			},
			// 滚动标题输入
			input_title_check(e){
				this.scroll_content_temp.scroll_content.title=e.detail.value;
			},
			// 时间  补零
			ljDateTimeFormat(e){
				if(e>=10){
					return e;
				}else{
					return Number("0"+e.toString());
				}
			},
			confir_edit(){
				let index=this.scroll_content_temp.index;
				let item=this.scroll_content_temp.scroll_content;
				this.scroll_content.splice(index,1,item);
				//向服务器传递新增
				var temp_url=null;
				var temp_method=null;
				if(this.scroll_content_do_add){
					temp_url=this.global_baseUrl + '/announcements/';
					temp_method='POST'
				}else{
					var edit_id=index
					temp_url=this.global_baseUrl + '/announcements/'+ edit_id+'/';
					temp_method='PUT';
				}
				var now_token = this.token
				uni.request({
					url: temp_url,
					header: {
						'Authorization': ' Token ' + now_token
					},
				data:{
					title:this.scroll_content_temp.scroll_content.title,
					content:this.scroll_content_temp.scroll_content.content
				},
					method: temp_method,
					success: (res) => {
						this.check_statusCode(res.statusCode)
						uni.showToast({
							title: '操作成功！',
							icon:'success',
						});
						this.scroll_content=[];
						this.getScroll_announcements();
					}
				});				
				this.scroll_content_temp=null;
				this.modalName_eidt=null;
				this.add_scroll_content_value=null;
				
			},
			hideModal(){
				this.modalName_eidt=null;
				this.scroll_content_temp=null;
			},
			// 滚动置顶
			toUp_scroll_item(e){
				var _self=this
				uni.showModal({
				title: '提示',
				content: '您确定置顶该公告吗',
				success: function (res) {
				if (res.confirm) {
				   var temp_url=null;
				   var temp_method=null;
				   var edit_id=e
					temp_url=_self.global_baseUrl + '/content/min_set_top/'+ edit_id+'/';
					temp_method='GET';
				   var now_token = _self.token
				   uni.request({
					url: temp_url,
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: temp_method,
					success: (res) => {
						_self.check_statusCode(res.statusCode)
						uni.showToast({
							title: '操作成功！',
							icon:'success',
						});
						_self.scroll_content=[];
						_self.getScroll_announcements();
					}
				   });	
				} else if (res.cancel) {
				 
				}
			}})
			},
			// 弹窗置顶
			toUp_pop_item(e){
			var _self=this
			uni.showModal({
			title: '提示',
			content: '您确定置顶该公告吗',
			success: function (res) {
			if (res.confirm) {
			   var temp_url=null;
			   var temp_method=null;
			   var edit_id=e
				temp_url=_self.global_baseUrl + '/content/set_top/'+ edit_id+'/';
				temp_method='GET';
			   var now_token = _self.token
			   uni.request({
				url: temp_url,
				header: {
					'Authorization': ' Token ' + now_token
				},
				method: temp_method,
				success: (res) => {
					_self.check_statusCode(res.statusCode)
					uni.showToast({
						title: '操作成功！',
						icon:'success',
					});
					_self.pop_content=[];
					_self.getpPopNotice();
				}
			   });	
			} else if (res.cancel) {
			 
			}
			}})
			},
			// 弹窗删除
			remove_pop_content(e){
				var _self=this
				uni.showModal({
				title: '提示',
				content: '您确定删除改公告吗',
				success: function (res) {
				if (res.confirm) {
				   var temp_url=null;
				   var temp_method=null;
				   var edit_id=e
					temp_url=_self.global_baseUrl + '/popnotice/'+ edit_id+'/';
					temp_method='DELETE';
				   
				   var now_token = _self.token
				   uni.request({
					url: temp_url,
					header: {
						'Authorization': ' Token ' + now_token
					},
					method: temp_method,
					success: (res) => {
						_self.check_statusCode(res.statusCode)
						uni.showToast({
							title: '操作成功！',
							icon:'success',
						});
						_self.pop_content=[];
						_self.getpPopNotice();
					}
				   });	
				} else if (res.cancel) {
				 
				}
			}
		});
			},
		
			// 滚动公告
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			// 弹窗公告
			showModal2(e) {
				this.modalName2 = e.currentTarget.dataset.target
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
			TimeChange_start(e) {
				this.current_buy_time.start_time = e.detail.value
				this.editBuyTimeSpan();
			},
			TimeChange_end(e) {
				if(e.detail.value.toString().substring(0,3)>this.current_buy_time.start_time.toString().substring(0,3)){
					this.current_buy_time.end_time = e.detail.value
					this.editBuyTimeSpan()
				}else{
					uni.showModal({
					    title: '提示',
					    content: '截止时间不能小于起始时间！',
						showCancel:false,
					    success: function (res) {
					        if (res.confirm) {
					           
					        } 
					    }
					});
				}
				
			},
			loadData(){
				this.getScroll_announcements();
				this.getMyStaffData();
			}
		},
		onLoad(){
			uni.showLoading({
				title: '加载中...'
			});
		this.loadData();
		
	}
	}
	
</script>

<style lang="scss" scoped>
.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		}
</style>
