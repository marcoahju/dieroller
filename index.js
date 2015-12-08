

var builder = require("./dietree.js");
var visitors = require("./visitors.js");

console.log(builder);

var expression = "d6+d8+2";

// Build AST
var root = builder.build(expression);

console.log("CST ---------");
//console.log(ast);
console.log("AST ---------");
console.log(root);
console.log("Print -------");
console.log("| " + root.accept(new visitors.PrintVisitor()));
console.log("Roll---------");
var rolled = root.accept(new visitors.RollVisitor());
console.log("|");
console.log("Print--------");
console.log("| " + rolled.accept(new visitors.PrintVisitor()));
console.log("Calculate----");
console.log("| " + rolled.accept(new visitors.CalculateVisitor()));
console.log("Roll---------");
var rolled = root.accept(new visitors.RollVisitor());
console.log("|");
console.log("Print--------");
console.log("| " + rolled.accept(new visitors.PrintVisitor()));
console.log("Calculate----");
console.log("| " + rolled.accept(new visitors.CalculateVisitor()));
