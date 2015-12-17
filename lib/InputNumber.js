'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcUtil = require('rc-util');

var _rcUtil2 = _interopRequireDefault(_rcUtil);

function noop() {}

function isValueNumber(value) {
  return (/^-?\d+?$/.test(value + '')
  );
}

function preventDefault(e) {
  e.preventDefault();
}

var InputNumber = _react2['default'].createClass({
  displayName: 'InputNumber',

  propTypes: {
    onChange: _react2['default'].PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      prefixCls: 'rc-input-number',
      max: Infinity,
      min: -Infinity,
      style: {},
      defaultValue: '',
      onChange: noop
    };
  },

  getInitialState: function getInitialState() {
    var value = undefined;
    var props = this.props;
    if ('value' in props) {
      value = props.value;
    } else {
      value = props.defaultValue;
    }
    return {
      value: value,
      focused: props.autoFocus
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value
      });
    }
  },

  onChange: function onChange(event) {
    var props = this.props;
    var val = event.target.value.trim();
    if (!val) {
      this.setValue(val);
    } else if (isValueNumber(val)) {
      val = Number(val);
      if (val < props.min) {
        return;
      }
      if (val > props.max) {
        return;
      }
      this.setValue(val);
    } else if (val === '-') {
      if (props.min >= 0) {
        return;
      }
      this.setState({
        value: val
      });
    }
  },

  onKeyDown: function onKeyDown(e) {
    if (e.keyCode === 38) {
      this.up(e);
    } else if (e.keyCode === 40) {
      this.down(e);
    }
  },

  onFocus: function onFocus() {
    this.setState({
      focused: true
    });
  },

  onBlur: function onBlur() {
    this.setState({
      focused: false
    });
    if (this.state.value === '-') {
      this.setValue('');
    }
  },

  setValue: function setValue(v) {
    if (!('value' in this.props)) {
      this.setState({
        value: v
      });
    }
    this.props.onChange(v);
  },

  step: function step(type, e) {
    if (e) {
      e.preventDefault();
    }
    var props = this.props;
    if (props.disabled) {
      return;
    }
    var value = this.state.value;
    if (isNaN(value)) {
      return;
    }
    var stepNum = props.step || 1;
    var val = value;
    if (type === 'down') {
      val -= stepNum;
    } else if (type === 'up') {
      val += stepNum;
    }
    if (val > props.max || val < props.min) {
      return;
    }
    this.setValue(val);
    this.refs.input.focus();
  },

  down: function down(e) {
    this.step('down', e);
  },

  up: function up(e) {
    this.step('up', e);
  },

  render: function render() {
    var _rcUtil$classSet;

    var props = this.props;
    var prefixCls = props.prefixCls;
    var classes = _rcUtil2['default'].classSet((_rcUtil$classSet = {}, _defineProperty(_rcUtil$classSet, prefixCls, true), _defineProperty(_rcUtil$classSet, props.className, !!props.className), _defineProperty(_rcUtil$classSet, prefixCls + '-disabled', props.disabled), _defineProperty(_rcUtil$classSet, prefixCls + '-focused', this.state.focused), _rcUtil$classSet));
    var upDisabledClass = '';
    var downDisabledClass = '';
    var value = this.state.value;
    if (isValueNumber(value)) {
      var val = Number(value);
      if (val >= props.max) {
        upDisabledClass = prefixCls + '-handler-up-disabled';
      }
      if (val <= props.min) {
        downDisabledClass = prefixCls + '-handler-up-disabled';
      }
    } else {
      upDisabledClass = prefixCls + '-handler-up-disabled';
      downDisabledClass = prefixCls + '-handler-up-disabled';
    }
    // ref for test
    return _react2['default'].createElement(
      'div',
      { className: classes, style: props.style },
      _react2['default'].createElement(
        'div',
        { className: prefixCls + '-handler-wrap' },
        _react2['default'].createElement(
          'a',
          { unselectable: 'unselectable',
            ref: 'up',
            onClick: upDisabledClass ? noop : this.up,
            onMouseDown: preventDefault,
            className: prefixCls + '-handler ' + prefixCls + '-handler-up ' + upDisabledClass },
          _react2['default'].createElement('span', { unselectable: 'unselectable', className: prefixCls + '-handler-up-inner',
            onClick: preventDefault })
        ),
        _react2['default'].createElement(
          'a',
          { unselectable: 'unselectable',
            ref: 'down',
            onMouseDown: preventDefault,
            onClick: downDisabledClass ? noop : this.down,
            className: prefixCls + '-handler ' + prefixCls + '-handler-down ' + downDisabledClass },
          _react2['default'].createElement('span', { unselectable: 'unselectable', className: prefixCls + '-handler-down-inner',
            onClick: preventDefault })
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: prefixCls + '-input-wrap' },
        _react2['default'].createElement('input', { className: prefixCls + '-input',
          autoComplete: 'off',
          onFocus: this.onFocus,
          onBlur: this.onBlur,
          onKeyDown: this.onKeyDown,
          autoFocus: props.autoFocus,
          readOnly: props.readOnly,
          disabled: props.disabled,
          max: props.max,
          min: props.min,
          name: props.name,
          onChange: this.onChange,
          ref: 'input',
          value: this.state.value })
      )
    );
  }
});

module.exports = InputNumber;