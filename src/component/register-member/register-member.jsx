import React from 'react';

class RegisterMember extends React.Component {
	render () {
		return (
			<div className="register-member ">
				<div className="register-banner">
					<img className="register-banner-img" src="http://7i7ie3.com2.z0.glb.qiniucdn.com/o_1an1m1l19j5hapvdl468i18jf9.jpg" />
				</div>
				<div className="">
					<div className="options-group">
						<div className="option">
							<span className="option-title">手机号</span>
							<input type="tel" className="option-input register-input" placeholder="请填写手机号" />	
						</div>
					</div>

					<div className="options-group">
						<div className="option">
							<span className="option-title">姓名</span>
							<input type="text" className="option-input register-input" placeholder="请填写姓名" />	
						</div>
						<div className="option">
							<span className="option-title">生日</span>
							<span className="btn-arrow-right"></span>
							<input type="text" className="option-input register-input" placeholder="请选择出生日期" />	

						</div>
						<div className="option">
							<span className="option-title">交易密码</span>
							<span className="btn-arrow-right"></span>
							<input type="tel" className="option-input register-input" placeholder="请填写6位数字密码" maxLength="6" />
						</div>
					</div>
				</div>
				<button className="register-btn btn--yellow btn-bottom">注册会员</button>
			</div>
		)
	}
}

module.exports = RegisterMember;