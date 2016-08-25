const React = require('react');
const connect = require('react-redux').connect;
const Toast = require('../../component/mui/toast.jsx');
require('../../asset/style/style.scss');
require('./application.scss');

import * as actions from '../../action/register-member/register-member.js';


const RegisterMemberApplication = React.createClass( {
	// 监听hash变化
	componentWillMount () {
		
	},

	render() {
		
		return (
			<div className="flex-columns">
				<div><img /></div>
				<div className="flex-rest">
					<div className="options-group">
						<div className="option">
							<span className="option-title">手机号</span>
							<input type="tel" className="option-input" />	
						</div>
					</div>

					<div className="options-group">
						<div className="option">
							<span className="option-title">姓名</span>
							<input type="text" className="option-input" />	
						</div>
						<div className="option">
							<span className="option-title">生日</span>
							<input type="text" className="option-input" />	
						</div>
						<div className="option">
							<span className="option-title">交易密码</span>
							<input type="text" className="option-input" />
							<input type="password" />	
						</div>
					</div>
				</div>
				<button className="btn--yellow">注册会员</button>
			</div>
		)
		
		
		
	}
})

module.exports = connect(state => state, actions)(RegisterMemberApplication);