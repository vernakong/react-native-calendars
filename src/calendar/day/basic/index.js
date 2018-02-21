import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import PropTypes from 'prop-types';

import styleConstructor from './style';

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    date: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    const changed = ['state', 'children', 'marking', 'onPress', 'lunarDate'].reduce((prev, next) => {
      if (prev) {
        return prev;
      } else if (nextProps[next] !== this.props[next]) {
        return next;
      }
      return prev;
    }, false);
    if (changed === 'marking') {
      let markingChanged = false;
      if (this.props.marking && nextProps.marking) {
        markingChanged = (!(
          this.props.marking.marked === nextProps.marking.marked
          && this.props.marking.selected === nextProps.marking.selected
          && this.props.marking.dotColor === nextProps.marking.dotColor
          && this.props.marking.disabled === nextProps.marking.disabled));
      } else {
        markingChanged = true;
      }
      // console.log('marking changed', markingChanged);
      return markingChanged;
    } else {
      // console.log('changed', changed);
      return !!changed;
    }
  }

  render() {
    const containerStyle = [this.style.base];
    const dateContainerStyle = [this.style.dateBase, this.style.viewBase];
    const lunarDateContainerStyle = [this.style.viewBase];
    const textStyle = [this.style.text];
    const lunarTextStyle = [this.style.text, this.style.lunarText];
    const dotStyle = [this.style.dot];

    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true
      };
    }

    //TODO: handling highlight of text here
    // let dot;
    // if (marking.marked) {
    //   dotStyle.push(this.style.visibleDot);
    //   if (marking.dotColor) {
    //     dotStyle.push({backgroundColor: marking.dotColor});
    //   }
    //   dot = (<View style={dotStyle}/>);
    // }

    if (typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled') {
      //disabled date
      if (this.props.date && this.props.date.weekDay === 0){
        //disabled sunday
        textStyle.push(this.style.disabledHolidayText);
        lunarTextStyle.push(this.style.disabledHolidayText);
      } else {
        textStyle.push(this.style.disabledText);
        lunarTextStyle.push(this.style.disabledText);
      }
    } else {
      //enabled date
      if(this.props.date && this.props.date.weekDay === 0){
        //sunday
        textStyle.push(this.style.holidayText);
        lunarTextStyle.push(this.style.holidayText);
      }
      if (marking.marked) {
        let bgColor = marking.dotColor? marking.dotColor: '#f5a623';
        dateContainerStyle.push(this.style.selected);
        dateContainerStyle.push({backgroundColor: bgColor});
        textStyle.push(this.style.selectedText);
      }
      if (marking.selected) {
        //selected date
        dateContainerStyle.push(this.style.selected);
        // dotStyle.push(this.style.selectedDot);
        textStyle.push(this.style.selectedText);
      }
    }

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={this.onDayPress}
        disabled={
          typeof marking.disabled !== 'undefined'
            ? marking.disabled
            : this.props.state === 'disabled'
        }
      >
      <View>
        <View style={dateContainerStyle}>
          <Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text>
        </View>
        <View style={lunarDateContainerStyle}>
          <Text allowFontScaling={false} style={lunarTextStyle}>{this.props.lunarDate? this.props.lunarDate: ' '}</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  }
}

export default Day;
