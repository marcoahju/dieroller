var probs = [];

var genRolls = function(sum, sides)
{
    console.log("sum :" + sum + " sides: " + sides);
    if (sides.length === 0)
    {
        if(probs[sum])
          probs[sum]++;
        else {
          probs[sum]=1;
        }
        console.log("set probs[sum] :" + probs[sum]);
        return;
    }
    var top = sides[0];
    for (var x = 1; x <= top; x++)
    {
      genRolls(sum+x, sides.slice(1));
    }
};

var diceprob = function(target, sides)
{
    var maxval = 0;
    var possibilities = 1;
    for (var i = 0; i < sides.length; i++)
    {
        maxval+= sides[i];
        possibilities *= sides[i];
    }
    probs = [];
    genRolls(0, sides);
    console.log("Probability is " + (probs[target]/possibilities));
};

diceprob(7, [6, 6]);
console.log(probs);
