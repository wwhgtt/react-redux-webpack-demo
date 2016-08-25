import React from 'react';

class BindPhoneValidate extends React.Component {
    handleClick(e) {
        const phoneInfo = {};
        const phoneCode = this.refs.phoneCode.value;
        const phoneNum = this.refs.phoneNum.value;

        phoneInfo.phoneCode = phoneCode;
        phoneInfo.phoneNum = phoneNum;
        this.props.onBindPhone(phoneInfo);
    }

    render() {
        return (
            <div>
            	<form className="">
            		<div>
                        <input
                        type="text"
                        ref="phoneNum" />
            			<input
                        type="text"
                        ref="phoneCode"
                         />
            			<a className="btn btn--yellow" onClick = {(e) => this.handleClick(e)}>绑定手机号</a>
            		</div>
            	</form>
            </div>
        )
    }
}

module.exports = BindPhoneValidate;
