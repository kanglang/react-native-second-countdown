<!--
 * @Author: kanglang
 * @Date: 2022-01-19 15:08:26
 * @LastEditors: kanglang
 * @LastEditTime: 2022-02-07 15:00:53
 * @Description: 读秒倒计时组件
-->

# react-native-second-countdown

## Usage 使用
```javascript
import SecondCountdown from 'react-native-second-countdown';

// TODO: What to do with the module?
<SecondCountdown 
	style={styles.sendBtn}
	count={10}
	pressAction={this.sendMsgCode}
	changeWithCount={(count) => `${count}秒后重试`}
    id='test'
/>

sendMsgCode = (startCountDownCallback) => {
	startCountDownCallback(() => {
		// 这里执行发送短信验证码
		msg.emit('app:tip', { text: '发送短信验证码，开始倒计时' });

	});
}

```
## Prop Introduce 属性介绍

| Prop                 | Description                    | Type             | Default     |
| ------------------- | -----------------------  | -------------   | ---------  |
| id                  | 唯一标识 (一个页面可能使用多个倒计时组件，分别计算倒计时)    | string         | 'default'      |
| beginText            | 按钮初始状态 展示文字              | string          | 获取验证码       |
| endText              | 倒计时结束按钮 展示文字            | string      | 重新获取 |
| count             	|倒计时秒         				   | number  |  60       |
| style             	|按钮样式         				   | object  |  {}       |
| disableStyle             	|按钮禁用的时候样式         				   | object  |  {backgroundColor: '#F2F4F7'}      |
| activeStyle             	|按钮激活的时候样式         				   | object  |  { backgroundColor: '#ffffff'}       |
| disableTextStyle          |按钮禁用时文字的样式         				   | object  |  {color: '#919599'}       |
| activeTextStyle           |按钮激活时文字的样式        				   | object  |  {color: '#248BFF'}       |
| pressAction             	|触发倒计时事件 有参数回调方法startCountDownCallback       				   | Func  |  ()=>{}       |
| changeWithCount           |监听剩余时间事件        				   | Func  |  (count) => `${count}s后重试`      |
| end             			|监听读秒结束后的回调事件         				   | Func  |  ()=>{}      |

