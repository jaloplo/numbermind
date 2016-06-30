function Engine() {

    var hasRepeatedCyphers = new Validators.HasRepeatedCyphers().check;

    var numberList = generateAllPossibleNumbers();
    var number = selectOneNumber(numberList);

    function generateAllPossibleNumbers() {
        var numberList = [];
        for(var i = 1023; i < 9876; i++) {
            if(!hasRepeatedCyphers(i)) {
                numberList.push(i);
            }
        }
        return numberList;
    }

    function selectOneNumber(numberList) {
        var totalNumbers = numberList.length;
        var index = Math.floor(Math.random() * totalNumbers);
        return numberList[index];
    }

    return {
        
    };
}