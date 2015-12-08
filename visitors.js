
module.exports = {
  RollVisitor : function(){
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
        console.log("RollVisitor: Unkown node type!");
      }
    };
  },

  PrintVisitor: function (){
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
        console.log("PrintVisitor: Unkown node type!");
      }
    };
  },

  CalculateVisitor: function(){
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
        console.log("CalculateVisitor: Unkown node type!");
      }
    };
  }
};
