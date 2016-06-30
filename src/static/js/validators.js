// # Validators namespace
// Validators is the namespace for all the classes that
// check and validate values.
var Validators = Validators || {};


// ## Validator class
// Validator is the class that defines the properties and
// methods for all the validators that are develop here.
Validators.Validator = function() {
    return {
        check: function(number) {
            return true;
        },
    };
}


// ## IsNullOrUndefined class
// IsNullOrUndefined is the class that checks
// if a value is null or undefined.
Validators.IsNullOrUndefined = function() {
    return {
        check: function(number) {
            return number === undefined || number === null;
        },
    };
}


// ## IsNumber class
// IsNumber is the class that checks if a value
// is a number.
Validators.IsNumber = function() {
    return {
        check: function(number) {
            var nullUndefinedValidator = new Validators.IsNullOrUndefined();
            return !nullUndefinedValidator.check(number) && !isNaN(number);
        },
    };
}


// ## BeginsWithZero class
// BeginsWithZero is the class that checks if 
// a value begins with zero.
Validators.BeginsWithZero = function() {
    return {
        check: function(number) {
            var numberValidator = new Validators.IsNumber();
            return numberValidator.check(number) && number.toString()[0] === '0';
        },
    };
}


// ## HasFourCyphers class
// HasFourCyphers is the class that checks if the length
// of the number is 4 cyphers.
Validators.HasFourCyphers = function() {
    return {
        check: function(number) {
            var numberValidator = new Validators.IsNumber();
            return numberValidator.check(number) && number.toString().length === 4;
        },
    };
}


// ## HasRepeatedCyphers class
// HasRepeatedCyphers is the class that checks if the number 
// has cyphers that are repeated.
Validators.HasRepeatedCyphers = function() {
    return {
        check: function(number) {

            // TODO: throw an error telling that is not a number
            
            var cyphers = {};
            var numberAsString = number.toString();
            for(var index = 0; index < numberAsString.length; index++) {
                var character = numberAsString[index];
                if(cyphers[character] === undefined) {
                    cyphers[character] = true;
                } else {
                    return true;
                }
            }

            return false;
        },
    };
}

try {
    module.exports.Validators = Validators;
} catch(err) {
}