'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function noop() {}

function preventDefault(e) {
  e.preventDefault();
}

var InputNumber = _react2['default'].createClass({
  displayName: 'InputNumber',

  propTypes: {
    onChange: _react2['default'].PropTypes.func,
    onKeyDown: _react2['default'].PropTypes.func,
    onFocus: _react2['default'].PropTypes.func,
    onBlur: _react2['default'].PropTypes.func,
    step: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.string])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      prefixCls: 'rc-input-number',
      max: Infinity,
      min: -Infinity,
      step: 1,
      style: {},
      defaultValue: '',
      onChange: noop,
      onKeyDown: noop,
      onFocus: noop,
      onBlur: noop
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
    value = this.toPrecisionAsStep(value);
    return {
      inputValue: value,
      value: value,
      focused: props.autoFocus
    };
  },

  componentDidMount: function componentDidMount() {
    this.componentDidUpdate();
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      var value = this.toPrecisionAsStep(nextProps.value);
      this.setState({
        inputValue: value,
        value: value
      });
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    if (this.state.focused && document.activeElement !== this.refs.input) {
      this.refs.input.focus();
    }
  },

  onChange: function onChange(event) {
    this.setInputValue(event.target.value.trim());
  },

  onKeyDown: function onKeyDown(e) {
    var _props;

    if (e.keyCode === 38) {
      this.up(e);
    } else if (e.keyCode === 40) {
      this.down(e);
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_props = this.props).onKeyDown.apply(_props, [e].concat(args));
  },

  onFocus: function onFocus() {
    var _props2;

    this.setState({
      focused: true
    });
    (_props2 = this.props).onFocus.apply(_props2, arguments);
  },

  onBlur: function onBlur(e) {
    var _props3;

    this.setState({
      focused: false
    });
    var value = this.getCurrentValidValue(e.target.value.trim());
    this.setValue(value);

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    (_props3 = this.props).onBlur.apply(_props3, [e].concat(args));
  },

  onStepMouseDown: function onStepMouseDown(e) {
    e.preventDefault();
    var value = this.getCurrentValidValue(this.state.inputValue);
    this.setState({ value: value });
  },

  getCurrentValidValue: function getCurrentValidValue(value) {
    var val = value;
    var props = this.props;
    if (val === '') {
      val = '';
    } else if (!isNaN(val)) {
      val = Number(val);
      if (val < props.min) {
        val = props.min;
      }
      if (val > props.max) {
        val = props.max;
      }
    } else {
      val = this.state.value;
    }
    return val;
  },

  setValue: function setValue(v) {
    if (!('value' in this.props)) {
      this.setState({
        value: v,
        inputValue: v
      });
    }
    this.props.onChange(isNaN(v) || v === '' ? undefined : v);
  },

  setInputValue: function setInputValue(v) {
    this.setState({
      inputValue: v
    });
  },

  getPrecision: function getPrecision() {
    var props = this.props;
    var stepString = props.step.toString();
    if (stepString.indexOf('e-') >= 0) {
      return parseInt(stepString.slice(stepString.indexOf('-e')), 10);
    }
    var precision = 0;
    if (stepString.indexOf('.') >= 0) {
      precision = stepString.length - stepString.indexOf('.') - 1;
    }
    return precision;
  },

  getPrecisionFactor: function getPrecisionFactor() {
    var precision = this.getPrecision();
    return Math.pow(10, precision);
  },

  toPrecisionAsStep: function toPrecisionAsStep(num) {
    if (isNaN(num) || num === '') {
      return num;
    }
    var precision = this.getPrecision();
    return Number(Number(num).toFixed(precision));
  },

  upStep: function upStep(val) {
    var stepNum = this.props.step;
    var precisionFactor = this.getPrecisionFactor();
    var result = (precisionFactor * val + precisionFactor * stepNum) / precisionFactor;
    return this.toPrecisionAsStep(result);
  },

  downStep: function downStep(val) {
    var stepNum = this.props.step;
    var precisionFactor = this.getPrecisionFactor();
    var result = (precisionFactor * val - precisionFactor * stepNum) / precisionFactor;
    return this.toPrecisionAsStep(result);
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
    var val = this[type + 'Step'](value);
    if (val > props.max || val < props.min) {
      return;
    }
    this.setValue(val);
    this.setState({
      focused: true
    });
  },

  down: function down(e) {
    this.step('down', e);
  },

  up: function up(e) {
    this.step('up', e);
  },

  focus: function focus() {
    this.refs.input.focus();
  },

  render: function render() {
    var _classNames;

    var props = this.props;
    var prefixCls = props.prefixCls;
    var classes = (0, _classnames2['default'])((_classNames = {}, _defineProperty(_classNames, prefixCls, true), _defineProperty(_classNames, props.className, !!props.className), _defineProperty(_classNames, prefixCls + '-disabled', props.disabled), _defineProperty(_classNames, prefixCls + '-focused', this.state.focused), _classNames));
    var upDisabledClass = '';
    var downDisabledClass = '';
    var value = this.state.value;
    if (!isNaN(value)) {
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

    // focus state, show input value
    // unfocus state, show valid value
    var inputDisplayValue = undefined;
    if (this.state.focused) {
      inputDisplayValue = this.state.inputValue;
    } else {
      inputDisplayValue = this.state.value;
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
            onMouseDown: this.onStepMouseDown,
            className: prefixCls + '-handler ' + prefixCls + '-handler-up ' + upDisabledClass },
          _react2['default'].createElement('span', { unselectable: 'unselectable', className: prefixCls + '-handler-up-inner',
            onClick: preventDefault })
        ),
        _react2['default'].createElement(
          'a',
          { unselectable: 'unselectable',
            ref: 'down',
            onMouseDown: this.onStepMouseDown,
            onClick: downDisabledClass ? noop : this.down,
            className: prefixCls + '-handler ' + prefixCls + '-handler-down ' + downDisabledClass },
          _react2['default'].createElement('span', { unselectable: 'unselectable', className: prefixCls + '-handler-down-inner',
            onClick: preventDefault })
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: prefixCls + '-input-wrap' },
        _react2['default'].createElement('input', _extends({}, props, {
          style: null,
          className: prefixCls + '-input',
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
          value: inputDisplayValue }))
      )
    );
  }
});

module.exports = InputNumber;