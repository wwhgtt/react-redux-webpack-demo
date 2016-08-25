import React from 'react';

class BindPhoneSuccess extends React.Component {
    render() {
        return (
    		<div className="bind-account mt40">
    			<div className="phone-img-green"></div>
                <div className="account-info">
        			<div className="account-info-current">当前绑定的手机号</div>
                    <span className="account-info-userName">{this.props.phoneNum}</span>
                </div>
    		</div>
        	
        )
    }
}

module.exports = BindPhoneSuccess;
