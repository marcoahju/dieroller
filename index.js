
require('pegjs-require');


// Define node types
function Binop(op, left, right){
  this.type = "binop";
	this.op = op;
  this.left = left;
  this.right = right;

  this.accept = function(visitor) {
      return visitor.visit(this);
  };

}

function Roll(amount, sides){
	this.type = "roll";
  this.amount = amount;
  this.sides = sides;

  this.accept = function(visitor) {
      return visitor.visit(this);
  };

}

function Constant(value){
  this.type = "constant";
  this.value = value;

  this.accept = function(visitor) {
      return visitor.visit(this);
  };
}

function PrintVisitor(){
  this.visit = function(n){
    if(n.type === "binop"){
      return n.left.accept(this) + " " + n.op + " " + n.right.accept(this);
    }
    else if(n.type === "roll"){
      return n.amount.accept(this) + "d" + n.sides.accept(this);
    }
    else if(n.type === "constant"){
      return n.value;
    } else {
      console.log("Unkown node type!");
    }
  };
}

function CalculateVisitor(){
  this.visit = function(n){
    if(n.type === "binop"){
      var left = n.left.accept(this);
      var right = n.right.accept(this);
      switch(n.op){
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return left / right;
      }
    }
    else if(n.type === "roll"){
      var amount = n.amount.accept(this);
      var sides = n.sides.accept(this);

      var sum = 0;
      for(var i = 0; i < amount; i++){
        sum += Math.ceil(Math.random() * sides);
      }
      return sum;
    }
    else if(n.type === "constant"){
      return n.value;
    } else {
      console.log("Unkown node type!");
    }
  };
}


// Build AST-tree
var build = function(n){
    if(n.type === "binop"){
      return new Binop(n.op, build(n.left), build(n.right));
    }
    else if(n.type === "roll"){
      return new Roll(build(n.amount), build(n.sides));
    }
    else if(n.type === "constant"){
      return new Constant(n.value);
    } else {
      console.log("Unkown node type!");
    }
};


// Load grammar
var parser = require('./dieroller.pegjs');

// Parse simple expression
var ast = parser.parse("d6 + d8 + 2");

// Build AST
var root = build(ast.expression);


console.log(ast);

console.log(root);

console.log("Print: "  + root.accept(new PrintVisitor()));
console.log("Calculate: "  + root.accept(new CalculateVisitor()));
