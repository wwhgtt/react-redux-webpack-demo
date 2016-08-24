import React from 'react';
require('./bind-account.scss');

class BindPhoneIndex extends React.Component {
	render() {
		return (
			<div className="bind-account">
				<div className="account-info">
					<div className="account-phone-img">图片</div>
					<p className="account-info-state">您还没有绑定手机号</p>
					<p className="account-info-tips">绑定手机号码可以关联原有的手机号信息</p>
				</div>
				<a className="btn account-btn btn--yellow" href="#bind-validate">绑定手机号</a>
			</div>
		)
	}
}

module.exports = BindPhoneIndex;