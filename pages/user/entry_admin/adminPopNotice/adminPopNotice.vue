<template>
	<view class="bg-white">

		<!--标题输入  -->
		<view class="bg-white solids-bottom ">
			<view class="ljTextAreaFa padding-top margin-lr   solid-top  " @tap="focusipt">
				<view class="margin-lr-xs solid-bottom  padding-bottom-sm">
					<textarea @input="textareaAInput" :value='textareaAValue' placeholder-class='PH_articleTitle' :focus="isfocus"
					 class="ljTextArea  align-center  " auto-height='true' maxlength="35" placeholder="请输入弹窗公告标题..." rows=1 name=s1
					 cols=2 onpropertychange="this.style.posHeight=this.scrollHeight "></textarea>
					<view class="text-right margin-top-sm text-sm">请控制字数<text class="text-red">35</text>以内</view>
				</view>

			</view>
		</view>


		<!-- 编辑器 -->
		<view>
			<ly-markdown v-if="textareaData!=null" :showPreview="showPreview" :textareaData.sync="textareaData"
			 :textareaHtml.sync="textareaHtml"></ly-markdown>
		</view>


		<!-- 底部登录按钮 -->
		<view class="ljBottomButton  " @tap="addNewPopNotice">
			<view class=" ljButtHelp flex justify-center bg-red text-white text-center padding-tb">
				提交
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import lyMarkdown from '@/components/ly-markdown/ly-markdown.vue'
	export default {
		components: {
			lyMarkdown
		},
		data() {
			return {

				// 原来的富文本编辑器
				textareaData: null,
				textareaHtml: null,
				showPreview: false,
				name: '七月_',
				textareaAValue: null,
				isfocus: false,
				add_new_popNotice: true,
				last_page_data: null,


				// 官方原版富文本编辑器
				placeholder: '开始输入...'

			};
		},
		watch: {
			"textareaData": function() {
				this.showPreview = true;
			}
		},
		computed: {
			...mapState(['token'])
		},
		onLoad(options) {
			var trans_data = JSON.parse(options.trans_data)
			if (trans_data.do_what == 'edit') {
				this.add_new_popNotice = false;
				this.last_page_data = uni.getStorageSync("edit_content");
				console.log(this.last_page_data)
				this.textareaAValue = this.last_page_data.item.notice_title;
				this.textareaData = this.last_page_data.item.notice_content;
			} else {
				this.textareaData = '';
			}

		},
		methods: {
			focusipt() {
				this.isfocus = true;
			},
			// 粘贴文本
			textareaAInput(e) {
				this.textareaAValue = e.detail.value
			},
			addNewPopNotice() {
				var _self = this;
				uni.showModal({
					title: '提示',
					content: '是否确认提交？',
					success: function(res) {
						uni.showLoading({
							title: '提交中...'
						});
						if (res.confirm) {
							var temp_url = null;
							var temp_method = null;
							if (_self.add_new_popNotice) {
								console.log(_self.textareaAValue)
								temp_url = _self.global_baseUrl + '/popnotice/';
								temp_method = 'POST'
							} else {
								console.log(_self.last_page_data)
								var edit_id = _self.last_page_data.item.id
								temp_url = _self.global_baseUrl + '/popnotice/' + edit_id + '/';
								temp_method = 'PUT';
							}
							var now_token = _self.token
							uni.request({
								url: temp_url,
								header: {
									'Authorization': ' Token ' + now_token
								},
								data: {
									notice_title: _self.textareaAValue,
									notice_content: _self.textareaData
								},
								method: temp_method,
								success: (res) => {
									_self.check_statusCode(res.statusCode)
									setTimeout(function() {
										uni.hideLoading();
									}, 1000);
									uni.navigateBack()
								}
							});
						} else if (res.cancel) {
							uni.hideLoading();
						}
					}
				});

			}
		}


	}
</script>

<style lang="scss" scoped="">
	// 文章标题
	// 顶部textArea
	.ljTextAreaFa {

		// padding-top: 80upx;
		.ljTextArea {
			width: 100%;
			font-size: 40upx;
			font-weight: bold;
			height: 80upx;
		}
	}

	.input-content {
		width: 100%;
	}

	.input-content textarea {
		padding: 16upx 25upx 15upx 25upx;
		font-size: 30upx;
		min-height: 500upx;
		line-height: 1.5;
	}

	.preview {
		border-top: 1upx solid #e0e0e0;
		width: 100%;
	}

	.toolbar {
		width: 100%;
		border: none;
		box-shadow: 0 0upx 4upx rgba(0, 0, 0, 0.157), 0 0upx 4upx rgba(0, 0, 0, 0.227);
	}

	.toolbar .iconfont {
		display: inline-block;
		cursor: pointer;
		height: 61.6upx;
		width: 61.6upx;
		margin: 13upx 0 11upx 0upx;
		font-size: 33upx;
		padding: 10upx 13upx 11upx 8upx;
		color: #757575;
		border-radius: 11upx;
		text-align: center;
		background: none;
		border: none;
		outline: none;
		line-height: 2.2;
		vertical-align: middle;
	}

	// 底部按钮
	.ljBottomButton {
		left: 0;
		right: 0;
		font-size: 28upx;
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		height: 50px;

		.ljButtHelp {
			width: 100%;
			height: 100%;

		}

	}
</style>
