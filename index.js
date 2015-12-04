
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
  this.rolls = undefined;

  this.accept = function(visitor) {
      return visitor.visit(this);
  };

}

function Prio(expression){
  this.type = "parens";
  this.child = expression;

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

function RollVisitor(){
  this.visit = function(n){
    if(n.type === "binop"){
      n.left = n.left.accept(this);
      n.right = n.right.accept(this);
      return n;
    }
    else if(n.type === "roll"){
      var amount = n.amount.accept(this).value;
      var sides = n.sides.accept(this).value;

      n.rolls = [];
      for(var i = 0; i < amount; i++){
        n.rolls.push(Math.ceil(Math.random() * sides));
      }

      return n;
    }
    else if(n.type == "parens"){
      n.child.accept(this);
      return n;
    }
    else if(n.type === "constant"){
      return n;
    } else {
      console.log("Unkown node type!");
    }
  };
}

function PrintVisitor(){
  this.visit = function(n){
    if(n.type === "binop"){
      return n.left.accept(this) + " " + n.op + " " + n.right.accept(this);
    }
    else if(n.type === "roll"){
      if(!n.rolls){
        return n.amount.accept(this) + "d" + n.sides.accept(this);
      }
      else{
        return "[" + n.rolls + "]";
      }

    }
    else if(n.type == "parens"){
      return "( " + n.child.accept(this) + " )";
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

      if(!n.rolls)
        throw("Roll the dice first, dude");

      var sum = 0;
      for(var i = 0; i < n.rolls.length; i++){
        sum += n.rolls[i];
      }
      return sum;
    }
    else if(n.type == "parens"){
      return n.child.accept(this);
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
    else if(n.type == "parens"){
      return new Prio(build(n.expression));
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
var ast = parser.parse("2*(d6+2d8)+2");

// Build AST
var root = build(ast.expression);

console.log("CST ---------");
console.log(ast);
console.log("AST ---------");
console.log(root);
console.log("Print -------");
console.log("| " + root.accept(new PrintVisitor()));
console.log("Roll---------");
var rolled = root.accept(new RollVisitor());
console.log("|");
console.log("Print--------");
console.log("| " + rolled.accept(new PrintVisitor()));
console.log("Calculate----");
console.log("| " + rolled.accept(new CalculateVisitor()));
