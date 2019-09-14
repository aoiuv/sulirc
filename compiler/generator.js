/**
 * ============================================================================
 *                               ヾ（〃＾∇＾）ﾉ♪
 *                            THE CODE GENERATOR!!!!
 * ============================================================================
 */

/**
 * Now let's move onto our last phase: The Code Generator.
 *
 * Our code generator is going to recursively call itself to print each node in
 * the tree into one giant string.
 */

function generator(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(generator).join("\n");

    case "ExpressionStatement":
      return generator(node.expression) + ";";

    case "CallExpression":
      return generator(node.callee) + "(" + node.arguments.map(generator).join(", ") + ")";

    case "Identifier":
      return node.name;

    case "NumberLiteral":
      return node.value;

    case "StringLiteral":
      return '"' + node.value + '"';

    default:
      throw new TypeError(node.type);
  }
}

module.exports = generator;
