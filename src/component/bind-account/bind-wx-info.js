import React from 'react';

class BindWxInfo extends React.Component {
 
    render() {
        return (
        	<div>
        		<p>以下微信号将与手机号<span>{this.props.wxInfo.phoneNum}</span>绑定</p>
        		<a>绑定微信号</a>
        	</div>
        );
    }
}

module.exports = BindWxInfo;
