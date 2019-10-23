<template>
	<view>
		<view class="padding-sm margin-bottom">
			<u-parse :content="aboutUsContent.content" :imageProp='imageProp' @preview="preview" @navigate="navigate"></u-parse>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uParse from '@/components/uParse/src/wxParse.vue'
	export default {
		components: {
			uParse
		},
		data() {
			return {
				aboutUsContent: '',
				imageProp: {
					mode: 'aspectFit',
					padding: 0,
					lazyLoad: true,
					domain: "liangxuan.natapp1.cc"
				},
			};
		},
		computed: {
			...mapState(['token'])
		},
		onLoad() {
			var _self = this;
			var now_token = this.token
			uni.request({
				url: this.global_baseUrl + '/aboutus/',
				header: {
					'Authorization': ' Token ' + now_token
				},
				method: "GET",
				success: (res) => {
					_self.check_statusCode(res.statusCode)
					_self.aboutUsContent = res.data[0]
				}
			});
		}
	}
</script>

<style lang="scss">

</style>
