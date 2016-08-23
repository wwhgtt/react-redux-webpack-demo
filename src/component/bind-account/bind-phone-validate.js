import React from 'react';

class BindPhoneValidate extends React.Component {
    handleClick : function(){
        const phoneInfo = {};
        let phoneCode = this.refs.phoneCode.value;
        phoneInfo.phoneCode = phoneCode;
        this.props.onBindPhone(phoneInfo);
    }

    render() {
        return (
        	<form>
        		<div>
        			<input
                    type="text"
                    ref="phoneCode"
                     />
        			<a onClick = {this.handleClick}>绑定手机号</a>
        		</div>
        	</form>
        )
    }
}

module.exports = BindPhoneValidate;
