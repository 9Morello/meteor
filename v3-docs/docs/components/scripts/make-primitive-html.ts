const primitiveDefault = {
  function: () =>
    `<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {}`,
  string: (name) =>
    `<span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  "${name}"`,
  number: () =>
    '<span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  42',
  boolean: () =>
    '<span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  false',
  object: (name) =>
    `<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  ${name}`,
  array: () => '<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  []',
  "array.<string>": () =>
    '<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">"string"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]',
  "array.<object>": () =>
    '<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  [</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}]',
  "array.<ejsonable>": () =>
    `<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ${primitiveDefault.ejsonable(
      "[",
      "]"
    )}`,
  // someProp: 'string', num: 42, bool: false, arr: [], obj: {}
  ejsonable(pre, post) {
    if (pre.length > 1) pre = "";
    // if (post.length > 1) post = "";
    return `<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ${pre}{ num:${primitiveDefault.number()}</span> , someProp:${primitiveDefault.string(
      "foo"
    )} </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}${
      post ?? ``
    }`;
  },
  promise: () =>
    '<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  Promise {</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}',
  any: () => '<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  any',
  error: (name) =>
    `<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  Error(${name})`,
};

const comma = `<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span>`;
const br = `<br/>`;
const comment = `<span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // this param is optional </span>`;

const line = ({ html, pre, post } = { pre: "", post: "", html: "" }) =>
  `${pre}<span class="line">${html}</span>${post}`;

const makePrimitiveHTML = ({ primitive, arr, index, isOptional, name }) => {
  let n: string = primitive[0],
    primitiveName = n.toLowerCase(),
    value;

  try {
    value = primitiveDefault[primitiveName](name);
  } catch (e) {
    console.error("primitive that we got:", primitive);
    throw new Error(
      `primitive ${primitiveName} is not registred in the map, here is the error: ${e}`
    );
  }

  if (arr.length > 1)
    return line({
      html: value + `${comma}</span>`,
      pre: index === 0 ? "" : br,
      post: isOptional ? comment : "",
    });
  return value + `</span>`;
};


export {
  makePrimitiveHTML
}