<template>
	<div id="find">
		<div>
			<div>
				<h2>找回密码</h2>
				<router-link to="/">回到登录</router-link>
			</div>
			<el-steps :active="active" finish-status="success">
				<el-step title="填写手机号">

				</el-step>
				<el-step title="填写验证码">

				</el-step>
				<el-step title="修改密码">

				</el-step>
			</el-steps>
			<div v-show="active ==0" class="find-content">
				<div>
					<i class="el-icon-user"></i>
					<input type="text" v-model="phoneNumber" placeholder="手机号/邮箱/账号">
				</div>
			</div>
			<div v-show="active ==1" class="find-content">
				<div>
					<i class="el-icon-key"></i>
					<input type="text" v-model="result" placeholder="请输入验证码">
				</div>
			</div>
			<div v-show="active ==2" class="find-content pass-content">
				<div>
					<div>
						<span>新密码:</span>
						<input type="text" v-model="password" placeholder="新密码">
					</div>
					<div>
						<span>确认密码:</span>
						<input type="text" placeholder="确认密码">
					</div>
				</div>
			</div>
			<div>
				<el-button style="margin-top: 12px;" v-if="active!=0" @click="onnext">{{onbottonTitle}}</el-button>
				<el-button style="margin-top: 12px;" @click="next">{{bottonTitle}}</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: "find",
		data() {
			return {
				active: 0,
				bottonTitle: "下一步",
				onbottonTitle: "上一步",
				phoneNumber: "",
				uuid: "",
				result: "",
				password: ""
			};
		},
		methods: {
			onnext() {
				this.bottonTitle = "下一步"
				if (this.active-- == 0) {
					this.onbottonTitle = ""
				}
			},
			next() {
				if (this.active++ == 1) {
					this.bottonTitle = "完成"
				}
			},
			verifyPhone() {
				axios({
					method: "get",
					url: "/api/user/verify/"+this.phoneNumber
				}).then(res => {
					if(res.data.status==200){
						this.uuid = res.data.data
					}else{
						this.active =1 
						this.$message.error(res.data.msg);
					}
				})
			},
			verifyCode() {
				axios({
					method: "post",
					url: "/api/user/verify/code",
					params: {
						"uuid": this.uuid,
						"result": this.result,
						"phoneNumber": this.phoneNumber
					}
				}).then(res => {
					if(res.data.status==200){
						this.$message({message: '验证成功',type: 'success'});
					}else{
						this.active =2 
						this.$message.error(res.data.msg);
					}
				})
			},
			changePassword(){
				axios({
					method: "post",
					url: "/api/user/verify/change",
					params: {
						"phoneNumber": this.phoneNumber,
						"password": this.password
					}
				}).then(res => {
					if(res.data.status==200){
						this.$message({message: '修改密码成功 请重新登录',type: 'success'});
						this.$router.push("/")
					}else{
						this.active =3
						this.$message.error(res.data.msg);
					}
				})
			}
		},
		watch:{
			active(){
				if(this.active == 1){
					this.verifyPhone()
				}
				if(this.active==2){
					this.verifyCode()
				}
				if (this.active==3){
					this.changePassword()
				}
				
			}
		}
	}
</script>

<style lang="less" scoped>
	html,
	body {
		width: 100%;
		height: 100%;
		padding: 0px;
		margin: 0px;
	}

	#find {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url(../assets/beijing.jpg);

		>div {
			width: 50%;
			position: absolute;
			top: 50px;

			.find-content {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;

				>div {
					width: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					margin: 50px 0px;

					i {
						color: #200117;
						font-size: 25px;
						margin: 5px;
					}

					input {
						margin: 5px;
						font-size: 20px;
						padding: 5px;
						border: 0px;
						opacity: 0.3;
					}

					input:focus {
						opacity: 0.8;
						outline: none;

					}
				}
			}

			.pass-content {
				>div {
					display: flex;
					justify-content: space-between;
					flex-direction: column;
					align-items: flex-start;
					>div {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						span {
							font-size: 20px;
							margin-left: 50px;
							text-align: end;
							width: 30%;
						}
						input{
							width: 50%;
							text-align: center;
						}
					}
				}
			}
			
			>div:nth-of-type(1) {
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				a{
					margin-right: 30px;
					text-decoration: none;
					color: #000;
				}
			}

			>div:nth-of-type(6) {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}
</style>
