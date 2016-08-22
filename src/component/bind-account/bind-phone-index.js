import React from 'react';

class BindPhoneIndex extends React.Component {
	render() {
		return (
			<div>
				<div>图片</div>
				<div>
					<p>您还没有绑定手机号</p>
					<p>绑定手机号码可以关联原有的手机号信息</p>
					<button>绑定手机号</button>
				</div>
			</div>
		)
	}
}

module.exports = BindPhoneIndex;