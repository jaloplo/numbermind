var Game = function() {

    var engine = new Engine();    

    return {
        play: function(number) {
            return {
                hits: engine.getHits(number),
                almost_hits: engine.getAlmostHits(number),
            };
        },
    };
};

var Engine = function() {

    var hasRepeatedCyphers = new Validators.HasRepeatedCyphers().check;
    var numbersList = [];
    for(var n = 1023; n < 9876; n++) {
        if(!hasRepeatedCyphers(n)) {
            numbersList.push(n);
        }
    }

    var number = numbersList[Math.floor(Math.random() * numbersList.length)];

    console.log(number);

    function existsInNumber(cypher) {
        var text = number.toString();
        return -1 !== text.indexOf(cypher.toString());
    }

    function existsInNumberAndPosition(cypher, position) {
        var text = number.toString();
        return text[position] === cypher.toString();
    }

    return {
        getAlmostHits: function(number) {
            var result = 0;
            
            var text = number.toString();
            for(var index = 0; index < text.length; index++) {
                var cypher = text[index];
                if(existsInNumber(cypher) && !existsInNumberAndPosition(cypher, index)) {
                    result++;
                }
            }

            return result;
        },
        getHits: function(number) {
            var result = 0;
            
            var text = number.toString();
            for(var index = 0; index < text.length; index++) {
                var cypher = text[index];
                if(existsInNumberAndPosition(cypher, index)) {
                    result++;
                }
            }

            return result;
        },
    };
};