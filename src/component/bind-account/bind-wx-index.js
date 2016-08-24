import React from 'react';

class BindWxIndex extends React.Component {
	render () {
		return (
			<div>
				<p>您还没有绑定微信号</p>
				<p>绑定微信号可以在您下次登录时使用微信号登录</p>
				<a href="#bind-info">绑定微信号</a>
			</div>
		)
	}
}

module.exports = BindWxIndex;