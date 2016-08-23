import React from 'react';

class BindPhoneValidate extends React.Component {
    handleClick(e) {
        const phoneInfo = {};
        const phoneCode = this.refs.phoneCode.value;
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
        			<a onClick = {(e) => this.handleClick(e)}>绑定手机号</a>
        		</div>
        	</form>
        )
    }
}

module.exports = BindPhoneValidate;
