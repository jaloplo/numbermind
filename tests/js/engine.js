var Reports = {
    number_of_tests_passed: 0,
    number_of_tests_failed: 0,
};

module.exports.Reports = Reports;

var Error = function(value, message) {
    return {
        value: value,
        message: message, 
    };
}

var TwoValuesError = function(value1, value2, message) {
    return {
        value1: value1,
        value2: value2,
        message: message,
    };
}


module.exports.Test = function(name, evaluator) {
    try {
        evaluator();
        console.log(name  + ' passed');
    } catch(err) {
        console.log(name + ' FAIL');
        console.log('>>> ' + err.message);
    }
}


module.exports.AreEqual = function(value1, value2) {
    if(value1 !== value2) {
        Reports.number_of_tests_failed++;
        throw new TwoValuesError(value1, value2, value1 + ' is different from ' + value2);
    }

    Reports.number_of_tests_passed++;
}


module.exports.IsFunction = function(value) {
    if(typeof(value) !== 'function') {
        Reports.number_of_tests_failed++;
        throw new Error(value, value + ' is not a function');
    }

    Reports.number_of_tests_passed++;
}


module.exports.IsNotNull = function(value) {
    if(value === null) {
        Reports.number_of_tests_failed++;
        throw new Error(value, value + ' is null');
    }

    Reports.number_of_tests_passed++;
}


module.exports.IsNotUndefined = function(value) {
    if(value === undefined) {
        Reports.number_of_tests_failed++;
        throw new Error(value, value + ' is undefined');
    }

    Reports.number_of_tests_passed++;
}


module.exports.ThrowsException = function(method, params) {
    try {
        method(params);
        Reports.number_of_tests_failed++;
        
        throw new Error(method, method + ' didn\' throw a exception');
    } catch(err) {
        Reports.number_of_tests_passed++;
    }
}