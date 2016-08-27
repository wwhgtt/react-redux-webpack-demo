import React from 'react';
const PhoneVerficationCode = require('../mui/phone-verification-code.jsx');

const BindPhoneValidate = React.createClass ({
    getInitialState() {
        return {
            phoneNum: '',
            phoneCode: ''  
        };
    },

    handleClick(e) {
        const {phoneNum, phoneCode} = this.state || {};
        console.log(this.state);
        if(!phoneNum){
            return;
        }

        this.props.onBindPhone({phoneNum, phoneCode});
    },

    handleChange(obj) {
        this.setState({phoneCode: obj.code, phoneNum: obj.phoneNum});
    },

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
})

module.exports = BindPhoneValidate;