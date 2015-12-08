var probs = [];

function Distribution(probs){

  this.range = Object.keys(probs);

  this.min = range[0];
  this.max = Object.keys(probs)[probs.length-1];
  console.log("min: " + this.min + " max: " + this.max);
  this.probs = probs;
  this.probmap = {};
  for(var i = 0; i < this.probs.length; i++){
    if(probs[i])
      this.probmap[i] = this.probs[i];
  }

  this.withPercent = function(){
    var sum = 0;
    var probPerc = [];
    for(var i = 0; i< this.probs.length; i++){
      if(this.probs[i])
        sum += this.probs[i];
    }
    console.log(sum);
    var probsum = 0;
    for(var j = 0; j< this.probs.length; j++){
      probPerc[j] = sum*this.probs[j] ? this.probs[j]/sum : 0;

      if(this.probs[j])
        probsum += this.probs[j]/sum;
    }

    console.log(probsum);
    return probPerc;
  };

}

var genRolls = function(sum, sides)
{
    if (sides.length === 0)
    {
        if(probs[sum])
          probs[sum]++;
        else {
          probs[sum]=1;
        }
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
    return probs[target]/possibilities;
};

console.log("d6 + d8: P(7) = " + diceprob(7, [6, 6, 6, 8, 8]));

probmap = {};
for(var i = 0; i < probs.length; i++){
  if(probs[i])
    probmap[i] = probs[i];
  else
    probmap[i] = 0;
}

console.log("Probability distribution:");
console.log(probmap);

var d = new Distribution(probs);
console.log(d.withPercent());
