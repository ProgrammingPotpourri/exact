const {
  Exact,
  min,
  max,
  isNil,
  isDigit,
  floor,
  findNextDigit
} = require("./exact.js");
const {
  runUnitTests,
  expect
} = require("./unit-tester.js");

const unitTests = [
  {
    name: "min",
    test: () => {
        var x = min(10, 5);
        expect(x, 5);
        x = min(-10, -5);
        expect(x, -10);
        x = min(-1000, 100);
        expect(x, -1000);
        x = min(2, 0);
        expect(x, 0);
    }
  },
  {
    name: "max",
    test: () => {
      var x = max(10, 5);
      expect(x, 10);
      x = max(-10, -5);
      expect(x, -5);
      x = max(-1000, 100);
      expect(x, 100);
      x = max(-1000, 0);
      expect(x, 0);
    }
  },
  {
    name: "isNil",
    test: () => {
      expect(isNil(undefined), true);
      expect(isNil(null), true);
      expect(isNil(0), false);
      expect(isNil(""), false);
      expect(isNil(new Exact()), false);
    }
  },
  {
    name: "isDigit",
    test: () => {
      var x = isDigit("0");
      expect(x, true);
      x = isDigit("9");
      expect(x, true);
      x = isDigit("a");
      expect(x, false);
      x = isDigit(" ");
      expect(x, false);
    }
  },
  {
    name: "floor",
    test: () => {
      var x = floor(5.1);
      expect(x, 5);
      x = floor(4);
      expect(x, 4);
      x = floor(0);
      expect(x, 0);
      x = floor(-1);
      expect(x, -1);
      x = floor(-1.1);
      expect(x, -1);
    }
  },
  {
    name: "findNextDigit",
    test: () => {
      var x = findNextDigit((d) => false);
      expect(x, 0);
      x = findNextDigit((d) => d <= 1);
      expect(x, 1);
      x = findNextDigit((d) => d <= 2);
      expect(x, 2);
      x = findNextDigit((d) => d <= 3);
      expect(x, 3);
      x = findNextDigit((d) => d <= 4);
      expect(x, 4);
      x = findNextDigit((d) => d <= 5);
      expect(x, 5);
      x = findNextDigit((d) => d <= 6);
      expect(x, 6);
      x = findNextDigit((d) => d <= 7);
      expect(x, 7);
      x = findNextDigit((d) => d <= 8);
      expect(x, 8);
      x = findNextDigit((d) => true);
      expect(x, 9);
    }
  },
  {
    name: "Exact constructor",
    test: () => {
      var x = new Exact();
      expect(x.toString(), "0");
      expect(x.precision, 10);
      x = new Exact(1);
      expect(x.toString(), "1");
      x = new Exact(1.1);
      expect(x.toString(), "1.1");
      x = new Exact(10);
      expect(x.toString(), "10");
      x = new Exact(-20);
      expect(x.toString(), "-20");
      x = new Exact(1000000.111);
      expect(x.toString(), "1,000,000.111");
      x = new Exact(2, 1);
      expect(x.toString(), "20");
      x = new Exact(-2, -1);
      expect(x.toString(), "-0.2");
      x = new Exact(25, -2);
      expect(x.toString(), "0.25");
      x = new Exact(1, 2, 100);
      expect(x.toString(), "100");
      expect(x.precision, 100);
      x = new Exact("1.34e200", 0, 15);
      expect(x.toExponentialString(), "1.34 * 10^200");
      expect(x.precision, 15);
      x = new Exact(11234, 0, 3, true);
      expect(x.toString(), "11,200");
      x = new Exact(1.1234, 0, undefined, false, 2, true);
      expect(x.toString(), "1.12");
      x = new Exact(1.1284, 0, undefined, false, 2, true);
      expect(x.toString(), "1.13");
      x = new Exact(7.283601309201629e+306);
      expect(x.toExponentialString(15), "7.283601309201629 * 10^306");
    }
  },
  {
    name: "Exact.plus",
    test: () => {
      var x = new Exact(1);
      var y = new Exact(2);
      var res = x.plus(y);
      expect(res.toString(), "3");
      x = new Exact(1);
      res = x.plus(3);
      expect(res.toString(), "4");
      x = new Exact(1);
      res = x.plus(-3);
      expect(res.toString(), "-2");
      x = new Exact(-1);
      res = x.plus(3);
      expect(res.toString(), "2");
      x = new Exact(1.1);
      y = new Exact(3.24);
      res = x.plus(y);
      expect(res.toString(), "4.34");
      x = new Exact(1.11, 1, 5);
      y = new Exact(3, 0, 8);
      res = x.plus(y);
      expect(res.toString(), "14.1");
      expect(res.precision, 5);
      x = new Exact(1.11441, 0, 3);
      y = new Exact(3.55555, 0, 4);
      res = x.plus(y);
      expect(res.toString(), "4.66996");
      expect(res.precision, 3);
      x = new Exact(1.11441, 0, 3, true);
      y = new Exact(3.55555, 0, 4, true);
      res = x.plus(y);
      expect(res.toString(), "4.67");
      expect(res.precision, 3);
      x = new Exact(1.11441, 0, 3, true);
      y = new Exact(3.55455, 0, 3, true);
      res = x.plus(y);
      expect(res.toString(), "4.66");
      expect(res.precision, 3);
    }
  },
  {
    name: "Exact.minus",
    test: () => {
      var x = new Exact(1.11);
      var y = new Exact(3);
      var res = x.minus(y);
      expect(res.toString(), "-1.89");
      x = new Exact(1.11);
      res = x.minus(1);
      expect(res.toString(), "0.11");
    }
  },
  {
    name: "Exact.times",
    test: () => {
      var x = new Exact(1.11);
      var y = new Exact(3);
      var res = x.times(y);
      expect(res.toString(), "3.33");
      x = new Exact(1.11);
      res = x.times(-2);
      expect(res.toString(), "-2.22");
      x = new Exact(1.11, 0, 2, true);
      y = new Exact(1.11);
      var res = x.times(y);
      expect(res.toString(), "1.2");
      x = new Exact(1.11);
      y = new Exact(1.11, 0, 3, true);
      var res = x.times(y);
      expect(res.toString(), "1.23");
      x = new Exact(1.11);
      y = new Exact(1.11, 0, undefined, false, 1, true);
      var res = x.times(y);
      expect(res.toString(), "1.2");
      x = new Exact(1.11);
      y = new Exact(1.11, 0, undefined, false, 2, true);
      var res = x.times(y);
      expect(res.toString(), "1.23");
    }
  },
  {
    name: "Exact.times10",
    test: () => {
      var x = new Exact(1.11);
      var res = x.times10();
      expect(res.toString(), "11.1");
    }
  },
  {
    name: "Exact.div",
    test: () => {
      var x = new Exact(1);
      var y = new Exact(3);
      var res = x.div(y);
      expect(res.toString(), "0.3333333333");
      x = new Exact(1.11);
      res = x.div(-2);
      expect(res.toString(), "-0.555");
    }
  },
  {
    name: "Exact.div10",
    test: () => {
      var x = new Exact(1.11);
      var res = x.div10();
      expect(res.toString(), "0.111");
    }
  },
  {
    name: "Exact.reciprocal",
    test: () => {
      var x = new Exact(4);
      var res = x.reciprocal();
      expect(res.toString(), "0.25");
      var x = new Exact(-7);
      var res = x.reciprocal();
      expect(res.toString(), "-0.1428571429");
    }
  },
  {
    name: "Exact.exp",
    test: () => {
      var x = new Exact(0);
      var res = x.exp();
      expect(res.toString(), "1");
      x = new Exact(1);
      res = x.exp();
      expect(res.toString(), "2.718281828453");
      x = new Exact(2);
      res = x.exp();
      expect(res.toString(), "7.389056098248");
      x = new Exact(0.5);
      res = x.exp();
      expect(res.toString(), "1.648721270659");
      x = new Exact(-1);
      res = x.exp();
      expect(res.toString(), "0.3678794412");
      x = new Exact(100);
      res = x.exp();
      expect(res.toExponentialString(), "2.69 * 10^43");
      x = new Exact(200);
      res = x.exp();
      expect(res.toExponentialString(), "7.23 * 10^86");
      x = new Exact(1, 0, 6, true);
      res = x.exp().powInt(200);
      expect(res.toExponentialString(), "7.23 * 10^86");
      x = new Exact(1, 0, 6, true);
      res = x.exp().powInt(1000);
      expect(res.toExponentialString(), "1.97 * 10^434");
      x = new Exact(1, 0, 6, true);
      res = x.exp().powInt(1000000);
      expect(res.toExponentialString(), "2.24 * 10^434294");
    }
  },
  {
    name: "Exact.powInt",
    test: () => {
      var x = new Exact(4);
      var res = x.powInt(2);
      expect(res.toString(), "16");
      x = new Exact(4);
      res = x.powInt(3);
      expect(res.toString(), "64");
      x = new Exact(2.2);
      res = x.powInt(2);
      expect(res.toString(), "4.84");
      x = new Exact(2.2);
      res = x.powInt(3);
      expect(res.toString(), "10.648");
      x = new Exact(2.2);
      res = x.powInt(20);
      expect(res.toString(), "7,054,294.98686404044207947776");
      x = new Exact(2);
      res = x.powInt(20);
      expect(res.toString(), "1,048,576");
      x = new Exact(0.5);
      res = x.powInt(10);
      expect(res.toString(), "0.0009765625");
      x = new Exact(-0.5);
      res = x.powInt(3);
      expect(res.toString(), "-0.125");
    }
  },
  {
    name: "Exact.negate",
    test: () => {
      var x = new Exact(1);
      var res = x.negate();
      expect(res.toString(), "-1");
      x = new Exact(-1.1);
      res = x.negate();
      expect(res.toString(), "1.1");
    }
  },
  {
    name: "Exact.abs",
    test: () => {
      var x = new Exact(1);
      var res = x.abs();
      expect(res.toString(), "1");
      x = new Exact(-1.1);
      res = x.abs();
      expect(res.toString(), "1.1");
    }
  },
  {
    name: "Exact.round",
    test: () => {
      var x = new Exact(1.5123);
      var res = x.round();
      expect(res.toString(), "2");
      x = new Exact(1.4);
      res = x.round();
      expect(res.toString(), "1");
      x = new Exact(-1.5);
      res = x.round();
      expect(res.toString(), "-2");
      x = new Exact(1.456);
      res = x.round(1);
      expect(res.toString(), "1.5");
      x = new Exact(1.445);
      res = x.round(1);
      expect(res.toString(), "1.4");
      x = new Exact(1450);
      res = x.round(-2);
      expect(res.toString(), "1,500");
    }
  },
  {
    name: "Exact.roundExponentialPlaces",
    test: () => {
      var x = new Exact(1.5123, 10);
      var res = x.roundExponentialPlaces();
      expect(res.toString(), "15,100,000,000");
      x = new Exact(1.5183, -10);
      res = x.roundExponentialPlaces(2);
      expect(res.toString(), "0.000000000152");
      x = new Exact(1.5183, -10);
      res = x.roundExponentialPlaces(3);
      expect(res.toString(), "0.0000000001518");
      x = new Exact(1.93);
      res = x.roundExponentialPlaces(1);
      expect(res.toString(), "1.9");
    }
  },
  {
    name: "Exact.sqrt",
    test: () => {
      var x = new Exact(1);
      var res = x.sqrt();
      expect(res.toString(), "1");
      x = new Exact(2);
      res = x.sqrt();
      expect(res.toString(), "1.414213562");
      x = new Exact(5);
      res = x.sqrt();
      expect(res.toString(), "2.236067977");
      x = new Exact(4.84);
      res = x.sqrt();
      expect(res.toString(), "2.2");
      x = new Exact(0.0001);
      res = x.sqrt();
      expect(res.toString(), "0.01");
      x = new Exact(0);
      res = x.sqrt();
      expect(res.toString(), "0");
      x = new Exact(-1);
      var thrown = false;
      try {
        x.sqrt();
      } catch (e) {
        thrown = true;
      }
      expect(thrown, true);
    }
  },
  {
    name: "Exact.eq",
    test: () => {
      var x = new Exact(1);
      var y = new Exact(2);
      var res = x.eq(y);
      expect(res, false);
      x = new Exact(1);
      y = new Exact(1);
      res = x.eq(y);
      expect(res, true);
      x = new Exact(1);
      y = new Exact(1, 1);
      res = x.eq(y);
      expect(res, false);
      x = new Exact(10);
      y = new Exact(1, 1);
      res = x.eq(y);
      expect(res, true);
      x = new Exact(-1);
      y = new Exact(1);
      res = x.eq(y);
      expect(res, false);
    }
  },
  {
    name: "Exact.lt",
    test: () => {
      var x = new Exact(1);
      var y = new Exact(2);
      var res = x.lt(y);
      expect(res, true);
      x = new Exact(1);
      y = new Exact(1);
      res = x.lt(y);
      expect(res, false);
      x = new Exact(1);
      y = new Exact(1, 1);
      res = x.lt(y);
      expect(res, true);
      x = new Exact(10);
      y = new Exact(1, 1);
      res = x.lt(y);
      expect(res, false);
      x = new Exact(-1);
      y = new Exact(1);
      res = x.lt(y);
      expect(res, true);
    }
  },
  {
    name: "Exact.ne",
    test: () => {
      var x = new Exact(1);
      var y = new Exact(2);
      var res = x.ne(y);
      expect(res, true);
      x = new Exact(1);
      y = new Exact(1);
      res = x.ne(y);
      expect(res, false);
      x = new Exact(1);
      y = new Exact(1, 1);
      res = x.ne(y);
      expect(res, true);
      x = new Exact(10);
      y = new Exact(1, 1);
      res = x.ne(y);
      expect(res, false);
      x = new Exact(-1);
      y = new Exact(1);
      res = x.ne(y);
      expect(res, true);
    }
  },
  {
    name: "Exact.lte",
    test: () => {
      var x = new Exact(1);
      var y = new Exact(2);
      var res = x.lte(y);
      expect(res, true);
      x = new Exact(1);
      y = new Exact(1);
      res = x.lte(y);
      expect(res, true);
      x = new Exact(1);
      y = new Exact(1, 1);
      res = x.lte(y);
      expect(res, true);
      x = new Exact(10);
      y = new Exact(1, 1);
      res = x.lte(y);
      expect(res, true);
      x = new Exact(1);
      y = new Exact(-1);
      res = x.lte(y);
      expect(res, false);
    }
  },
  {
    name: "Exact.gt",
    test: () => {
      var x = new Exact(1);
      var y = new Exact(2);
      var res = x.gt(y);
      expect(res, false);
      x = new Exact(1);
      y = new Exact(1);
      res = x.gt(y);
      expect(res, false);
      x = new Exact(1);
      y = new Exact(1, 1);
      res = x.gt(y);
      expect(res, false);
      x = new Exact(10);
      y = new Exact(1, 1);
      res = x.gt(y);
      expect(res, false);
      x = new Exact(-1);
      y = new Exact(1);
      res = x.gt(y);
      expect(res, false);
    }
  },
  {
    name: "Exact.gte",
    test: () => {
      var x = new Exact(1);
      var y = new Exact(2);
      var res = x.gte(y);
      expect(res, false);
      x = new Exact(1);
      y = new Exact(1);
      res = x.gte(y);
      expect(res, true);
      x = new Exact(1);
      y = new Exact(1, 1);
      res = x.gte(y);
      expect(res, false);
      x = new Exact(10);
      y = new Exact(1, 1);
      res = x.gte(y);
      expect(res, true);
      x = new Exact(1);
      y = new Exact(-1);
      res = x.gte(y);
      expect(res, true);
    }
  },
  {
    name: "Exact.isNegative",
    test: () => {
      var x = new Exact(1);
      var res = x.isNegative();
      expect(res, false);
      x = new Exact(-1);
      res = x.isNegative();
      expect(res, true);
      x = new Exact(1, 1);
      res = x.isNegative();
      expect(res, false);
      x = new Exact(0);
      res = x.isNegative();
      expect(res, false);
    }
  },
  {
    name: "Exact.isZero",
    test: () => {
      var x = new Exact(1);
      var res = x.isZero();
      expect(res, false);
      x = new Exact(0);
      res = x.isZero();
      expect(res, true);
    }
  },
  {
    name: "Exact.is1",
    test: () => {
      var x = new Exact(1);
      var res = x.is1();
      expect(res, true);
      x = new Exact(-1);
      res = x.is1();
      expect(res, false);
      x = new Exact(1, 1);
      res = x.is1();
      expect(res, false);
      x = new Exact(0);
      res = x.is1();
      expect(res, false);
    }
  },
  {
    name: "Exact.is10",
    test: () => {
      var x = new Exact(10);
      var res = x.is10();
      expect(res, true);
      x = new Exact(-10);
      res = x.is10();
      expect(res, false);
      x = new Exact(0);
      res = x.is10();
      expect(res, false);
      x = new Exact(1);
      res = x.is10();
      expect(res, false);
    }
  },
  {
    name: "Exact.toString",
    test: () => {
      var x = new Exact(-1.1, 3);
      expect(x.toString(), "-1,100");
    }
  },
  {
    name: "Exact.toExponentialString",
    test: () => {
      var x = new Exact(-1.1, 3);
      expect(x.toExponentialString(), "-1,100");
      x = new Exact(-1.1, 12);
      expect(x.toExponentialString(), "-1.10 * 10^12");
      x = new Exact(0.000000000025);
      expect(x.toExponentialString(), "2.50 * 10^-11");
      x = new Exact(0.000000000025445);
      expect(x.toExponentialString(3), "2.545 * 10^-11");
      x = new Exact(0);
      expect(x.toExponentialString(3), "0");
    }
  },
  {
    name: "Exact.clone",
    test: () => {
      var x = new Exact(-1.1, 3);
      var res = x.clone();
      expect(res.toString(), "-1,100");
      expect(res.precision, 10);
      x = new Exact(-1.1, 3, 5);
      res = x.clone();
      expect(res.toString(), "-1,100");
      expect(res.precision, 5);
    }
  },
  {
    name: "Exact.fromNumber",
    test: () => {
      var x = new Exact(1);
      var res = x.fromNumber(3);
      expect(res.toString(), "3");
      expect(res.precision, 10);
      x = new Exact(5, -1, 3);
      res = x.fromNumber(4.44444);
      expect(res.toString(), "4.44444");
      expect(res.precision, 3);
    }
  },
  {
    name: "Exact.zero",
    test: () => {
      var x = new Exact(2);
      var res = x.zero();
      expect(res.toString(), "0");
      expect(res.precision, 10);
      x = new Exact(5, -1, 3);
      res = x.zero();
      expect(res.toString(), "0");
      expect(res.precision, 3);
    }
  },
  {
    name: "Exact.one",
    test: () => {
      var x = new Exact(2);
      var res = x.one();
      expect(res.toString(), "1");
      expect(res.precision, 10);
      x = new Exact(5, -1, 3);
      res = x.one();
      expect(res.toString(), "1");
      expect(res.precision, 3);
    }
  },
  {
    name: "Exact.getExpPos",
    test: () => {
      var x = new Exact(12.34);
      var res = x.getExpPos(0);
      expect(res, 2);
      res = x.getExpPos(1);
      expect(res, 3);
      res = x.getExpPos(2);
      expect(res, 4);
      res = x.getExpPos(-1);
      expect(res, 1);
      res = x.getExpPos(-2);
      expect(res, 0);
      res = x.getExpPos(-3);
      expect(res, -1);
    }
  },
  {
    name: "Exact.getExpVal",
    test: () => {
      var x = new Exact(12.34);
      var res = x.getExpVal(0);
      expect(res, 2);
      res = x.getExpVal(1);
      expect(res, 1);
      res = x.getExpVal(2);
      expect(res, 0);
      res = x.getExpVal(-1);
      expect(res, 3);
      res = x.getExpVal(-2);
      expect(res, 4);
      res = x.getExpVal(-3);
      expect(res, 0);
    }
  },
  {
    name: "Exact.setExpVal",
    test: () => {
      var x = new Exact(12.34);
      x.setExpVal(1, 5);
      expect(x.toString(), "52.34");
      x = new Exact(12.34);
      x.setExpVal(0, 5);
      expect(x.toString(), "15.34");
      x = new Exact(-12.34);
      x.setExpVal(-2, 8);
      expect(x.toString(), "-12.38");
      x = new Exact(-12.34);
      x.setExpVal(-5, 8);
      expect(x.toString(), "-12.34008");
    }
  },
  {
    name: "Exact.addExpVal",
    test: () => {
      var x = new Exact(12.34);
      x.addExpVal(1, 5);
      expect(x.toString(), "62.34");
      x = new Exact(12.34);
      x.addExpVal(0, 5);
      expect(x.toString(), "17.34");
      x = new Exact(-12.34);
      x.addExpVal(-2, 8);
      expect(x.toString(), "-12.42");
      x = new Exact(-12.34);
      x.addExpVal(-5, 8);
      expect(x.toString(), "-12.34008");
    }
  },
  {
    name: "Exact.getMaxExpPos",
    test: () => {
      var x = new Exact(234.34);
      var res = x.getMaxExpPos();
      expect(res, 2);
      x = new Exact(0.34);
      res = x.getMaxExpPos();
      expect(res, -1);
    }
  },
  {
    name: "Exact.getMinExpPos",
    test: () => {
      var x = new Exact(234.34);
      var res = x.getMinExpPos();
      expect(res, -2);
      x = new Exact(234.3456);
      res = x.getMinExpPos();
      expect(res, -4);
    }
  },
  {
    name: "Exact.getPosition",
    test: () => {
      var x = new Exact(234.34);
      var res = x.getPosition(0);
      expect(res, 4);
      res = x.getPosition(1);
      expect(res, 3);
      res = x.getPosition(2);
      expect(res, 4);
      res = x.getPosition(3);
      expect(res, 3);
      res = x.getPosition(4);
      expect(res, 2);
      res = x.getPosition(5);
      expect(res, 0);
      res = x.getPosition(-1);
      expect(res, 0);
    }
  },
  {
    name: "Exact.setPosition",
    test: () => {
      var x = new Exact(234.34);
      x.setPosition(0, 8);
      expect(x.toString(), "234.38");
      x = new Exact(234.34);
      x.setPosition(4, 8);
      expect(x.toString(), "834.34");
      x = new Exact(-234.34);
      x.setPosition(6, 8);
      expect(x.toString(), "-80,234.34");
      x = new Exact(-234.34);
      x.setPosition(-2, 8);
      expect(x.toString(), "-234.3408");
    }
  },
  {
    name: "Exact.roundToDecimalPlaces",
    test: () => {
      var x = new Exact(234.3345);
      x.roundToDecimalPlaces(2);
      expect(x.toString(), "234.33");
      x = new Exact(234.3345);
      x.roundToDecimalPlaces();
      expect(x.toString(), "234.33");
      x = new Exact(234.3355);
      x.roundToDecimalPlaces(3);
      expect(x.toString(), "234.336");
      x = new Exact(234.3855);
      x.roundToDecimalPlaces(1);
      expect(x.toString(), "234.4");
      x = new Exact(2.5855);
      x.roundToDecimalPlaces(0);
      expect(x.toString(), "3");
      x = new Exact(2.4855);
      x.roundToDecimalPlaces(0);
      expect(x.toString(), "2");
    }
  },
  {
    name: "Exact.roundToPrecision",
    test: () => {
      var x = new Exact(234.3345);
      x.roundToPrecision(4);
      expect(x.toString(), "234.3");
      x = new Exact(234.3345);
      x.roundToPrecision(6);
      expect(x.toString(), "234.335");
      x = new Exact(234.3345);
      x.roundToPrecision(10);
      expect(x.toString(), "234.3345");
      x = new Exact(234.123456789);
      x.roundToPrecision();
      expect(x.toString(), "234.1234568");
    }
  },
  {
    name: "Exact.normalize",
    test: () => {
      var x = new Exact();
      x.value = [ 0, 0, 4, 5, 6 ];
      x.exponent = -1;
      x.normalize();
      expect(x.toString(), "6,540");
      expect(x.value.length, 3);
      expect(x.exponent, 1);
      x = new Exact(658);
      x.enforcePrecision = true;
      x.precision = 2;
      x.normalize();
      expect(x.toString(), "660");
      x = new Exact(6.54);
      x.enforceDecimalPlaces = true;
      x.decimalPlaces = 1;
      x.normalize();
      expect(x.toString(), "6.5");
    }
  }
];

runUnitTests(unitTests);
