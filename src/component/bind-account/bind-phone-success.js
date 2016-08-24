import React from 'react';

class BindPhoneSuccess extends React.Component {
    render() {
        return (
        	
    		<div>
    			<div>图片</div>
    			<div>当前绑定手机号</div>
                <span>{this.props.phoneNum}</span>
    		</div>
        	
        )
    }
}

module.exports = BindPhoneSuccess;
