<template>
	<view>
		<view class="padding-sm margin-bottom">
			<u-parse :content="popContent.notice_content" :imageProp='imageProp' @preview="preview" @navigate="navigate"></u-parse>
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
				popContent: {},
				imageProp: {
					mode: 'aspectFit',
					padding: 0,
					lazyLoad: true,
					domain: "liangxuan.natapp1.cc"
				},
			};
		},
		onLoad(options) {
			if (uni.getStorageSync('popItem')) {
				this.popContent = uni.getStorageSync('popItem')
				uni.clearStorageSync();
				this.setNavgatBar(this.popContent.notice_title);
			}

		},
		methods:{
			setNavgatBar(title) {
				uni.setNavigationBarTitle({
					title: title
				});
			},
		}
	}
</script>

<style lang="scss">

</style>
