<template>
	<div class="cron">
	    <el-popover v-model="cronPopover">
	      <el-input slot="reference" @click="cronPopover=true" v-model="cron" placeholder="请输入定时策略" style="width: 40% ;margin-left: -50%"></el-input>
	      <cron @change="changeCron" @close="cronPopover=false" i18n="en"></cron>
	    </el-popover>
	  </div>
</template>

<script>
	import {cron} from 'vue-cron';
	  export default {
	    components: { cron },
	    data(){
	      return {
	        cronPopover:false,
	        cron:''
	      }
	    },
	    methods: {
	      changeCron(val){
	        this.cron=val
	      },
	
	    },
	  }
</script>

<style lang="less">
	html,body{
		width: 100%;
		height: 100%;
		margin: 0px;
		padding: 0px;
	}
</style>
