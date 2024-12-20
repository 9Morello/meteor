// These are tests of Babel's generated output.  Write tests here when a runtime
// test won't do.  Some tests also serve to catch when Babel changes its output,
// such as when it changes its runtime helpers!

function transform(input) {
  return Babel.compile(input).code;
};

function contains(haystack, needle) {
  return haystack.indexOf(needle) >= 0;
};

Tinytest.add("ecmascript - transpilation - const", (test) => {
  const output = transform('const x = 5;');
  test.isTrue(contains(output, 'const'));
  test.isFalse(contains(output, 'var'));
});

Tinytest.add("ecmascript - transpilation - class methods", (test) => {
  const output = transform(
`class Foo {
  static staticMethod() {
    return 'classy';
  }

  prototypeMethod() {
    return 'prototypical';
  }

  [computedMethod]() {
    return 'computed';
  }
}`);

  // the compiled output should be very similar to the input with modern Babel.
  // We aren't forcing CJS output anymore. So ES classes and all that are fine in the output.
  test.isFalse(contains(output, 'Foo.staticMethod = function staticMethod('));
  test.isFalse(contains(output,
                       '.prototypeMethod = function prototypeMethod('));
  test.isFalse(contains(output, '[_computedMethod] = function ('));
  test.isFalse(contains(output, 'createClass'));
});

Tinytest.add("ecmascript - transpilation - helpers - classCallCheck", (test) => {
  const output = transform(`
class Foo {
  constructor(x) {
    this.x = x;
  }
}`);

  test.equal(output, [
    `"use strict";\n`,
    `class Foo {`,
    `  constructor(x) {`,
    `    this.x = x;`,
    `  }`,
    `}`,
  ].join("\n"));
});

Tinytest.add("ecmascript - transpilation - helpers - inherits", (test) => {
  const output = transform(`
class Foo {}
class Bar extends Foo {}
`);

  test.isFalse(/helpers\/(builtin\/)?inherits/.test(output));
});

Tinytest.add("ecmascript - transpilation - helpers - bind", (test) => {
  const output = transform(
    "var foo = new Foo(...oneTwo, 3);"
  );

  test.isFalse(output.match(/@babel\/runtime\/helpers\/construct\b/));
});

Tinytest.add("ecmascript - transpilation - helpers - extends", (test) => {
  const output = transform("class A extends getBaseClass() {}");
  test.isFalse(/helpers\/inheritsLoose/.test(output));
});

Tinytest.add("ecmascript - transpilation - helpers - objectSpread", (test) => {
  const output = transform("var full = {a:1, ...middle, d:4};");
  test.isFalse(/objectSpread/.test(output));
});

Tinytest.add("ecmascript - transpilation - helpers - objectWithoutProperties", (test) => {
  const output = transform(`
var {a, ...rest} = obj;
`);

  test.isFalse(/helpers\/(builtin\/)?objectWithoutProperties/.test(output));
});

Tinytest.add("ecmascript - transpilation - helpers - objectDestructuringEmpty", (test) => {
  const output = transform(`
var {} = null;
`);

  test.isFalse(/helpers\/(builtin\/)?objectDestructuringEmpty/.test(output));
});

Tinytest.add("ecmascript - transpilation - helpers - taggedTemplateLiteralLoose", (test) => {
  const output = transform(`
var x = asdf\`A\${foo}C\`
`);

  test.isFalse(/helpers\/(builtin\/)?taggedTemplateLiteralLoose/.test(output));
});

Tinytest.add("ecmascript - transpilation - helpers - createClass", (test) => {
  const output = transform(`
class Foo {
  get blah() { return 123; }
}
`);
  /* shouldn't use createClass when generating modern JS */
  test.isFalse(/helpers\/(builtin\/)?createClass/.test(output));
});
