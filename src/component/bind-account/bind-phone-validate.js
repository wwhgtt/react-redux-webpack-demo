import React from 'react';
const PhoneVerficationCode = require('../mui/phone-verification-code.jsx');

class BindPhoneValidate extends React.Component {
    getInitialState() {
        return {
            phoneNum: '',
            phoneCode: ''  
        };
    }

    handleClick(e) {
        // const phoneInfo = {};
        // const phoneCode = this.refs.phoneCode.value;
        // const phoneNum = this.refs.phoneNum.value;
        // phoneInfo.phoneCode = phoneCode;
        // phoneInfo.phoneNum = phoneNum;
        // this.props.onBindPhone(phoneInfo);

        const {phoneNum, phoneCode} = this.state || {};
        if(!phoneNum){
            alert('不能为空');
        }

        alert(JSON.stringify(this.state));
        this.props.onBindPhone({phoneNum, phoneCode});
    }

    handleChange(obj) {
        debugger;
        this.setState({phoneCode: obj.code, phoneNum: obj.phoneNum});
    }

    render() {
        return (
            <div>
            	<form className="">
            		<div>
                    <PhoneVerficationCode onVerificationCodeChange={this.handleChange} />
            			<a className="btn btn--yellow" onClick = {this.handleClick}>绑定手机号</a>
            		</div>
            	</form>
            </div>
        )
    }
}

module.exports = BindPhoneValidate;
