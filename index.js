/*
 * @Author: kanglang
 * @Date: 2020-11-09 13:42:18
 * @LastEditors: kanglang
 * @LastEditTime: 2022-02-07 13:55:07
 * @Description: 短信读秒倒计时组件
 */

import React, { Component } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, Dimensions,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // 屏幕宽高
const uiWidthPx = 750;
function px2dp(uiElementPx) {
  if (screenWidth > screenHeight) {
    return (uiElementPx * screenHeight) / uiWidthPx;
  }
  return (uiElementPx * screenWidth) / uiWidthPx;
}

const XMCountDownButtonState = {
  XMCountDownButtonActive: 0,
  XMCountDownButtonDisable: 1,
};

const timeRecodes = []; // 根据id来记录SecondCountdown的信息

export default class SecondCountdown extends Component {
  static defaultProps = {
    id: 'id', // 按钮的身份标识,同一个页面的按钮是同一个id
    beginText: '获取验证码', // 初始状态按钮title
    endText: '重新获取', // 读秒结束后按钮的title
    count: 60, // 总的计时数 单位是秒s
    pressAction: () => { }, // 按下按钮的事件,但是触发倒数(startCountDown)需要你自己来调用
    changeWithCount: () => { }, // 读秒变化的函数,该函数带有一个参数count,表示当前的剩余时间
    end: () => { }, // 读秒完毕后的回调,读秒结束触发
    style: {}, // 按钮样式
    disableStyle: {}, // 按钮禁用的时候样式                 (有默认,见底部styles)
    activeStyle: {}, // active情况下按钮样式              (有默认,见底部styles)
    disableTextStyle: {}, // 按钮禁用的时候里面文字的样式        (有默认,见底部styles)
    activeTextStyle: {}, // active情况下按钮里面文字的样式      (有默认,见底部styles)
  }

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      btnTitle: '默认',
      buttonState: XMCountDownButtonState.XMCountDownButtonActive,
      isLock: false,
      shouldSetState: true
    };
  }

  componentDidMount() {
    const { id, changeWithCount, beginText } = this.props;
    this.setState({
      btnTitle: beginText
    });
    for (let i = 0; i < timeRecodes.length; i++) {
      const obj = timeRecodes[i];
      if (obj.id === id) {
        const liveTime = Date.now() - obj.startTime;
        if (liveTime < obj.deathCount * 1000) {
          // 避免闪动
          const detalTime = Math.round(liveTime / 1000);
          const content = changeWithCount(obj.deathCount - detalTime);
          this.setState({
            btnTitle: content,
          });
          // 手动调用倒计时
          this.startCountDownWithCount(obj.startTime);
        }
      }
    }
  }

  componentWillUnmount() {
    this.setState({ shouldSetState: false });
    this.clearTime();
  }

  render() {
    const { buttonState, btnTitle } = this.state;
    const isDisable = buttonState === XMCountDownButtonState.XMCountDownButtonDisable;
    const {
      style,
      disableStyle,
      activeStyle,
      disableTextStyle,
      activeTextStyle,
    } = this.props;
    return (
      <TouchableOpacity
        disabled={isDisable}
        onPress={this.buttonPressed}
        style={
          [
            styles.buttonCommonStyle,
            isDisable ? styles.disableButtonStyle : styles.activeButtonStyle,
            isDisable ? disableStyle : activeStyle,
            style,
          ]
        }
      >
        <Text
          style={
            [
              styles.txtCommonStyle,
              isDisable ? styles.disableTxtStyle : styles.activeTxtStyle,
              isDisable ? disableTextStyle : activeTextStyle,
            ]
          }
        >
          {btnTitle}
        </Text>
      </TouchableOpacity>
    );
  }

  clearTime() {
    if (this.interval) {
      this.setState({ isLock: false });
      clearInterval(this.interval);
    }
  }

  startCountDownWithCount(startTime) {
    const {
      changeWithCount,
      endText,
      count,
      end,
    } = this.props;
    const { shouldSetState } = this.state;
    this.startTime = startTime;
    this.interval = setInterval(() => {
      // 已计时多久
      const detalTime = Math.round((Date.now() - this.startTime) / 1000);
      // 剩余多少时间
      let content = changeWithCount(count - detalTime);
      if (detalTime >= count) {
        content = endText;
        this.clearTime();
        end && end();
        this.setState({
          buttonState: XMCountDownButtonState.XMCountDownButtonActive,
          isLock: false,
        });
      } else {
        this.setState({
          buttonState: XMCountDownButtonState.XMCountDownButtonDisable,
        });
      }
      if (shouldSetState) {
        this.setState({
          btnTitle: content,
        });
      }
    }, 1000);
  }

  recordButtonInfo() {
    const {
      id,
      count,
    } = this.props;
    let hasRecord = false;
    for (let i = 0; i < timeRecodes.length; i++) {
      const obj = timeRecodes[i];
      if (obj.id === id) {
        obj.startTime = Date.now();
        hasRecord = true;
        break;
      }
    }
    if (!hasRecord) {
      const buttonInfo = {
        id,
        deathCount: count,
        startTime: Date.now(),
      };
      timeRecodes.push(buttonInfo);
    }
  }

  // 组件外部调用回调方法
  startCountDown(callback) {
    const { isLock } = this.state;
    if (isLock) return;
    this.setState({ isLock: true });
    this.startCountDownWithCount(Date.now());
    this.recordButtonInfo();
    callback && callback();
  }

  buttonPressed = () => {
    const { pressAction } = this.props;
    pressAction && pressAction();
  }
}

const styles = StyleSheet.create({
  buttonCommonStyle: {
    borderRadius: 3,
    borderWidth: px2dp(1),
    borderColor: '#F2F4F7',
    paddingRight: px2dp(20) * 2,
    paddingLeft: px2dp(8) * 2,
    height: px2dp(48) * 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // 禁用时候的TouchableOpacity样式
  disableButtonStyle: {
    backgroundColor: '#F2F4F7',
  },
  // 可以点击时候的TouchableOpacity样式
  activeButtonStyle: {
    backgroundColor: '#fff',
  },

  txtCommonStyle: {
    fontSize: px2dp(14) * 2,
  },
  // 禁用时候的Text样式
  disableTxtStyle: {
    color: '#919599',
  },
  // 可以点击时候的Text样式
  activeTxtStyle: {
    color: '#248BFF',
  },
});
