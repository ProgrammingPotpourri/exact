function min(x, y) {
  return (x > y) ? y : x;
}

function max(x, y) {
  return (x > y) ? x : y;
}

function isNil(x) {
  return x === undefined || x === null;
}

function isDigit(s) {
  return "0123456789".indexOf(s) >= 0;
}

function floor(x) {
  if (x >= 0) {
    return ~~x;
  } else {
    return -(~~(-x));
  }
}

function findNextDigit(fn) {
  if (fn(5)) {
    if (fn(8)) {
      if (fn(9)) {
        return 9;
      } else {
        return 8;
      }
    } else if (fn(7)) {
      return 7;
    } else if (fn(6)) {
      return 6;
    } else {
      return 5;
    }
  } else if (fn(3)) {
    if (fn(4)) {
      return 4;
    } else {
      return 3;
    }
  } else if (fn(1)) {
    if (fn(2)) {
      return 2;
    } else {
      return 1;
    }
  } else {
    return 0;
  }
}

function add(x, y) {
  const result = x.zero();
  result.sign = x.sign;
  result.precision = min(x.precision, y.precision);
  result.decimalPlaces = min(x.decimalPlaces, y.decimalPlaces);
  result.enforcePrecision = x.enforcePrecision || y.enforcePrecision;
  result.enforceDecimalPlaces = x.enforceDecimalPlaces || y.enforceDecimalPlaces;
  var carry = 0;
  const minExpPos = min(x.getMinExpPos(), y.getMinExpPos());
  const maxExpPos = max(x.getMaxExpPos(), y.getMaxExpPos());
  for (var i = minExpPos; i <= maxExpPos + 1; i++) {
    var digit = x.getExpVal(i) + y.getExpVal(i) + carry;
    if (digit >= 10) {
      digit -= 10;
      carry = 1;
    } else {
      carry = 0;
    }
    result.setExpVal(i, digit);
  }
  result.normalize();
  return result;
}

function subtract(x, y) {
  const result = x.zero();
  result.sign = x.sign;
  var borrow = 0;
  const minExpPos = min(x.getMinExpPos(), y.getMinExpPos());
  const maxExpPos = max(x.getMaxExpPos(), y.getMaxExpPos());    
  for (var i = minExpPos; i <= maxExpPos; i++) {
    var digit = x.getExpVal(i) - y.getExpVal(i) - borrow;
    if (digit < 0) {
      digit += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    result.setExpVal(i, digit);
  }
  result.normalize();
  return result;
}

class Exact {
  constructor(value, exponent = 0, precision = 10, enforcePrecision = false,
              decimalPlaces = 2, enforceDecimalPlaces = false) {
    this.exponent = exponent;
    this.sign = 1;
    this.precision = precision;
    this.enforcePrecision = enforcePrecision;
    this.decimalPlaces = decimalPlaces;
    this.enforceDecimalPlaces = enforceDecimalPlaces;
    if (typeof value === "number") {
      value = value.toString();
    }
    if (typeof value === "string") {
      const expPos = value.indexOf("e");
      if (expPos >= 0) {
        const expVal = +(value.substring(expPos + 1));
        this.exponent += expVal;
        value = value.substring(0, expPos);
      }
    }
    const valueArray = [];
    if (value && value.length > 0) {
      var pos = 0;
      if (value[0] === "-") {
        this.sign = -1;
        pos = 1;
      }
      var decimalPointEncountered = false;
      var accumulated = [];
      for (var i = pos; i < value.length; i++) {
        if (value[i] === ".") {
          decimalPointEncountered = true;
        } else if (value[i] !== ",") {
          if (!isDigit(value[i])) {
            throw new Error("Invalid number");
          }
          if (!decimalPointEncountered) {
            if (value[i] !== "0" || valueArray.length > 0) {
              valueArray.push(+value[i]);
            }
          } else {
            if (value[i] !== "0") {
              valueArray.push(...accumulated);
              valueArray.push(+value[i]);
              this.exponent -= accumulated.length;
              this.exponent--;
              accumulated = [];
            } else {
              accumulated.push(+value[i]);
            }
          }
        }
      }
    }
    this.value = valueArray.reverse();
    this.normalize();
  }

  plus(y) {
    if (typeof y === "number" || typeof y === "string") {
      y = this.fromNumber(y);
    }
    if (this.sign !== y.sign) {
      var pos;
      var neg;
      if (this.isNegative()) {
        pos = y;
        neg = this.negate();
      } else {
        pos = this;
        neg = y.negate();
      }
      if (neg.eq(pos)) {
        return this.zero();
      } else if (neg.lt(pos)) {
        return subtract(pos, neg);
      } else {
        return subtract(neg, pos).negate();
      }
    }
    return add(this, y);
  }

  minus(y) {
    if (typeof y === "number" || typeof y === "string") {
      y = this.fromNumber(y);
    }
    if (this.eq(y)) {
      return this.zero();
    }    
    return this.plus(y.negate());
  }

  times(y) {
    if (typeof y === "number" || typeof y === "string") {
      y = this.fromNumber(y);
    }
    if (y.is10()) {
      return this.times10();
    }
    var result = this.zero();
    result.precision = min(this.precision, y.precision);
    result.decimalPlaces = min(this.decimalPlaces, y.decimalPlaces);
    result.enforcePrecision = this.enforcePrecision || y.enforcePrecision;
    result.enforceDecimalPlaces = this.enforceDecimalPlaces || y.enforceDecimalPlaces;
      result.sign = this.sign * y.sign;
    for (var xi = this.getMinExpPos(); xi <= this.getMaxExpPos(); xi++) {
      for (var yi = y.getMinExpPos(); yi <= y.getMaxExpPos(); yi++) {
        result.addExpVal(xi + yi, this.getExpVal(xi) * y.getExpVal(yi));
      }
    }
    result.normalize();
    return result;
  }

  times10() {
    var result = this.clone();
    result.exponent++;
    return result;
  }

  div(y) {
    if (typeof y === "number" || typeof y === "string") {
      y = this.fromNumber(y);
    }
    if (y.isZero()) {
      throw new Error("Division by zero");
    }
    if (y.is1()) {
      return this;
    }
    if (y.is10()) {
      return this.div10();
    }
    var result = this.zero();
    const ax = this.abs();
    const ay = y.abs();
    var remainder = ax.clone();
    let maxExpPos = ax.getMaxExpPos() - ay.getMaxExpPos();
    const minExpPos = -ax.precision - 1;
    for (var i = maxExpPos; i >= minExpPos; i--) {
      if (remainder.isZero()) {
        break;
      }
      const digit = findNextDigit((d) => {
        return ay.times(ax.fromNumber(d, i)).lte(remainder);
      });
      result.setExpVal(i, digit);
      remainder = remainder.minus(ay.times(ax.fromNumber(digit, i)));
    }
    result.sign = this.sign * y.sign;
    result.roundToPrecision();
    return result;
  }

  div10() {
    var result = this.clone();
    result.exponent--;
    return result;
  }

  reciprocal() {
    return this.one().div(this);
  }

  exp(repeatCountPrecision) {
    if (this.isNegative()) {
      return this.abs().exp(repeatCountPrecision).reciprocal();
    }
    var result = this.zero();
    var lastResult = this.zero();
    var term = this.one();
    var repeatCount = 0;
    for (var n = 1; repeatCountPrecision ? repeatCount < repeatCountPrecision : !term.isZero(); n++) {
      result = result.plus(term);
      if (result.toExponentialString() === lastResult.toExponentialString()) {
        repeatCount++;
      } else {
        repeatCount = 0;
      }
      lastResult = result;
      term = term.times(this).div(n);
    }
    return result;
  }

  powInt(num) {
    if (num === 0) {
      return this.one();
    }        
    var result;
    if (num & 1) {
      result = this.clone();
    } else {
      result = this.one();
    }
    num = num >> 1;
    var powerValue = this.clone();
    while (num > 0) {
      powerValue = powerValue.times(powerValue);
      if (num & 1) {
        result = result.times(powerValue);
      }
      num = num >> 1;
    }
    return result;
  }

  negate() {
    var result = this.clone();
    result.sign = -result.sign;
    return result;
  }

  abs() {
    var result = this.clone();
    result.sign = 1;
    return result;
  }

  round(toDecimalPlaces = 0) {
    var result = this.clone();
    result.roundToDecimalPlaces(toDecimalPlaces);
    return result;
  }

  roundExponentialPlaces(places) {
    if (!places) {
      places = this.decimalPlaces;
    }
    var result = this.clone();
    result.roundToPrecision(places + 1);
    return result;
  }

  sqrt() {
    if (this.isNegative()) {
      throw new Error("Cannot take sqrt of negative number");
    }
    var result = this.zero();
    var multiplier = this.zero();
    var remainder = this.zero();
    const maxExpPos = floor(this.getMaxExpPos() / 2) * 2;
    const minExpPos = min(floor(this.getMinExpPos() / 2) * 2, -this.precision * 2 - 2);
    for (var i = maxExpPos; i >= minExpPos; i -= 2) {
      if (remainder.isZero() && i + 1 < this.getMinExpPos()) {
        break;
      }
      remainder = remainder.times10().times10().plus(this.fromNumber(this.getExpVal(i + 1) * 10 + this.getExpVal(i)));
      const digit = findNextDigit((d) => {
        const bd = this.fromNumber(d);
        return multiplier.times10().plus(bd).times(bd).lte(remainder);
      });
      result.setExpVal(i / 2, digit);
      const exactDigit = this.fromNumber(digit);
      remainder = remainder.minus(multiplier.times10().plus(exactDigit).times(exactDigit));
      multiplier = multiplier.times10().plus(exactDigit).plus(exactDigit);
    }
    result.roundToPrecision();
    return result;
  }

  eq(y) {
    if (this.exponent !== y.exponent || this.sign !== y.sign || this.value.length !== y.value.length) {
      return false;
    }
    for (var i = 0; i <= this.value.length; i++) {
      if (this.value[i] !== y.value[i]) {
        return false;
      }
    }
    return true;
  }

  lt(y) {
    if (this.sign > 0 && y.sign < 0) {
      return false;
    }
    if (this.sign < 0 && y.sign > 0) {
      return true;
    }
    if (this.sign < 0 && y.sign < 0) {
      return this.negate().gt(y.negate());
    }
    var maxEp = max(this.getMaxExpPos(), y.getMaxExpPos());
    var minEp = min(this.getMinExpPos(), y.getMinExpPos());
    for (var i = maxEp; i >= minEp; i--) {
      const val = this.getExpVal(i);
      const yVal = y.getExpVal(i);
      if (val > yVal) {
        return false;
      }
      if (val < yVal) {
        return true;
      }
    }
    return false;
  }

  ne(y) {
    return !this.eq(y);
  }

  lte(y) {
    return this.eq(y) || this.lt(y);
  }

  gt(y) {
    return !this.lte(y);
  }

  gte(y) {
    return this.eq(y) || this.gt(y);
  }

  isNegative() {
    return this.sign < 0;
  }

  isZero() {
    return this.value.length === 0;
  }

  is1() {
    return this.sign === 1 && this.exponent === 0 && this.value.length === 1 && this.value[0] === 1;
  }

  is10() {
    return this.sign === 1 && this.exponent === 1 && this.value.length === 1 && this.value[0] === 1;
  }

  toString() {
    var result = "";
    if (this.isNegative()) {
      result += "-";
    }
    for (var i = this.value.length - 1; i >= -this.exponent; i--) {
      const digit = this.getPosition(i);
      if (result.length > 0 || digit > 0) {
        result += digit.toString();
        if ((i + this.exponent) % 3 === 0 && i > -this.exponent) {
          result += ",";
        }
      }
    }
    if (result.length === 0 || result === "-") {
      result += "0";
    }
    if (this.exponent < 0) {
      var accumulatedValue = ".";
      for (var i = -this.exponent - 1; i >= 0; i--) {
        const digit = this.getPosition(i);
        accumulatedValue += digit.toString();
        if (digit > 0) {
          result += accumulatedValue;
          accumulatedValue = "";
        }
      }
    }
    return result;
  }

  toExponentialString(places) {
    if (isNil(places)) {
      places = this.decimalPlaces;
    }
    const absVal = this.abs();
    if (absVal.isZero() || (absVal.lt(new Exact(1, 6)) && new Exact(1, -6).lt(absVal))) {
      return this.toString();
    }
    const res = this.roundExponentialPlaces(places);
    var exponent = res.getMaxExpPos();
    var result = res.getExpVal(exponent);
    if (places > 0) {
      result += ".";
      for (var i = 1; i <= places; i++) {
        result += res.getExpVal(exponent - i);
      }
    }
    if (res.isNegative()) {
      result = "-" + result;
    }
    return result + " * 10^" + exponent;
  }

  clone() {
    var clonedExact = new Exact();
    clonedExact.value = [...this.value];
    clonedExact.exponent = this.exponent;
    clonedExact.sign = this.sign;
    clonedExact.precision = this.precision;
    clonedExact.enforcePrecision  = this.enforcePrecision;
    clonedExact.decimalPlaces = this.decimalPlaces;
    clonedExact.enforceDecimalPlaces = this.enforceDecimalPlaces;
    return clonedExact;
  }

  fromNumber(num, exponent = 0) {
    return new Exact(num, exponent, this.precision, this.enforcePrecision,
      this.decimalPlaces, this.enforceDecimalPlaces);
  }

  zero() {
    return this.fromNumber(0);
  }

  one() {
    return this.fromNumber(1);
  }

  getExpPos(i) {
    return i - this.exponent;
  }

  getExpVal(i) {
    return this.getPosition(this.getExpPos(i));
  }

  setExpVal(i, val) {
    this.setPosition(this.getExpPos(i), val);
  }

  addExpVal(i, val, normalizeAfter = true) {
    var digit = this.getExpVal(i) + val;
    var carry = 0;
    if (digit >= 10) {
      carry = floor(digit / 10);
      digit = digit - carry * 10;        
    }
    this.setPosition(this.getExpPos(i), digit, normalizeAfter);
    if (carry) {
      this.addExpVal(i + 1, carry);
    }
  }

  getMaxExpPos() {
    return this.exponent + this.value.length - 1;
  }

  getMinExpPos() {
    return this.exponent;
  }

  getPosition(i) {
    if (i >= 0 && this.value.length > i) {
      return this.value[i];
    }
    return 0;
  }

  setPosition(i, val, normalizeAfter = true) {
    if (val === this.getPosition(i)) {
      return;
    }
    if (i < 0) {
      const extra = [ val ];
      for (var i0 = 1; i0 < -i; i0++) {
        extra.push(0);
      }
      this.value = [ ...extra, ...this.value ];
      this.exponent += i;
    } else if (i >= 0 && this.value.length > i) {
      this.value[i] = val;
    } else {
      for (var i0 = this.value.length; i0 < i; i0++) {
        this.value.push(0);
      }
      this.value.push(val);
    }
    if (normalizeAfter) {
      this.normalize();
    }
  }

  roundToDecimalPlaces(places, normalizeAfter = true) {
    if (isNil(places)) {
      places = this.decimalPlaces;
    }
    this.roundToPrecision(this.getMaxExpPos() + places + 1, normalizeAfter);
  }

  roundToPrecision(precision, normalizeAfter = true) {
    if (isNil(precision)) {
      precision = this.precision;
    }
    if (this.value.length > precision) {
      const firstInsignificantExpPos = this.getMaxExpPos() - precision;
      if (this.getExpVal(firstInsignificantExpPos) >= 5) {
        this.addExpVal(firstInsignificantExpPos + 1, 1, false);
      }
      this.exponent += (this.value.length - precision);
      this.value = this.value.slice(this.value.length - precision);
      if (normalizeAfter) {
        this.normalize();
      }
    }
  }

  normalize() {
    if (this.enforcePrecision && (this.precision < this.value.length)) {
      this.roundToPrecision(this.precision, false);
    } else if (this.enforceDecimalPlaces && (-this.exponent > this.decimalPlaces)) {
      this.roundToDecimalPlaces();
    } else {
      var i = this.value.length - 1;
      while (this.value[i] === 0 && i > 0) {
        i--;
      }
      this.value = this.value.slice(0, i + 1);
      i = 0;
      while (this.value[i] === 0 && i < this.value.length) {
        i++;
      }
      if (i === this.value.length) {
        this.sign = 1;
        this.value = [];
        this.exponent = 0;
      } else if (i > 0) {
        this.exponent += i;
        this.value = this.value.slice(i);
      }
    }
  }
}

module.exports = {
  Exact,
  min,
  max,
  isNil,
  isDigit,
  floor,
  findNextDigit
};
