var Engine = require('./engine.js');
var Validators = require('../../src/static/js/validators.js').Validators;


new Engine.Test('Validators namespace exists', function() {
    Engine.IsNotNull(Validators);
    Engine.IsNotUndefined(Validators);
});


new Engine.Test('Validator class exists', function() {
    Engine.IsNotNull(Validators.Validator);
    Engine.IsNotUndefined(Validators.Validator);
});

new Engine.Test('Validator class defines a check method', function() {
    var v = new Validators.Validator();
    Engine.IsNotNull(v.check);
    Engine.IsNotUndefined(v.check);
    Engine.IsFunction(v.check);
});


new Engine.Test('IsNullOrUndefined class exists', function() {
    Engine.IsNotNull(Validators.IsNullOrUndefined);
    Engine.IsNotUndefined(Validators.IsNullOrUndefined);
});

new Engine.Test('IsNullOrUndefined class defines a check method', function() {
    var v = new Validators.IsNullOrUndefined();
    Engine.IsNotNull(v.check);
    Engine.IsNotUndefined(v.check);
    Engine.IsFunction(v.check);
});

new Engine.Test('IsNullOrUndefined when is null returns true', function() {
    var v = new Validators.IsNullOrUndefined();
    var source = null;

    Engine.AreEqual(true, v.check(source));
});

new Engine.Test('IsNullOrUndefined when is undefined returns true', function() {
    var v = new Validators.IsNullOrUndefined();
    var source = undefined;

    Engine.AreEqual(true, v.check(source));
});

new Engine.Test('IsNullOrUndefined when is not null neither undefined returns false', function() {
    var v = new Validators.IsNullOrUndefined();
    var source = 1;

    Engine.AreEqual(false, v.check(source));
});


new Engine.Test('IsNumber class exists', function() {
    Engine.IsNotNull(Validators.IsNumber);
    Engine.IsNotUndefined(Validators.IsNumber);
});

new Engine.Test('IsNumber class defines a check method', function() {
    var v = new Validators.IsNumber();
    Engine.IsNotNull(v.check);
    Engine.IsNotUndefined(v.check);
    Engine.IsFunction(v.check);
});

new Engine.Test('IsNumber when is a number returns true', function() {
    var v = new Validators.IsNumber();
    var source = 123;

    Engine.AreEqual(true, v.check(source));
});

new Engine.Test('IsNumber when is a text as a number returns true', function() {
    var v = new Validators.IsNumber();
    var source = '123';

    Engine.AreEqual(true, v.check(source));
});

new Engine.Test('IsNumber when is not a number returns false', function() {
    var v = new Validators.IsNumber();
    var source = 'aasd';

    Engine.AreEqual(false, v.check(source));
});





new Engine.Test('BeginsWithZero class exists', function() {
    Engine.IsNotNull(Validators.BeginsWithZero);
    Engine.IsNotUndefined(Validators.BeginsWithZero);
});

new Engine.Test('BeginsWithZero class defines a check method', function() {
    var v = new Validators.BeginsWithZero();
    Engine.IsNotNull(v.check);
    Engine.IsNotUndefined(v.check);
    Engine.IsFunction(v.check);
});

new Engine.Test('BeginsWithZero when starts with zero returns true', function() {
    var v = new Validators.BeginsWithZero();
    var source = '0123';

    Engine.AreEqual(true, v.check(source));
});

new Engine.Test('BeginsWithZero when starts without zero returns false', function() {
    var v = new Validators.BeginsWithZero();
    var source = '123';

    Engine.AreEqual(false, v.check(source));
});

new Engine.Test('BeginsWithZero when is not a number returns false', function() {
    var v = new Validators.BeginsWithZero();
    var source = 'aasd';

    Engine.AreEqual(false, v.check(source));
});





new Engine.Test('HasFourCyphers class exists', function() {
    Engine.IsNotNull(Validators.HasFourCyphers);
    Engine.IsNotUndefined(Validators.HasFourCyphers);
});

new Engine.Test('HasFourCyphers class defines a check method', function() {
    var v = new Validators.HasFourCyphers();
    Engine.IsNotNull(v.check);
    Engine.IsNotUndefined(v.check);
    Engine.IsFunction(v.check);
});

new Engine.Test('HasFourCyphers when has 4 cypher returns true', function() {
    var v = new Validators.HasFourCyphers();
    var source = '0123';

    Engine.AreEqual(true, v.check(source));
});

new Engine.Test('BeginsWithZero when has 5 cyphers returns false', function() {
    var v = new Validators.HasFourCyphers();
    var source = '12345';

    Engine.AreEqual(false, v.check(source));
});

new Engine.Test('HasFourCyphers when has 3 cyphers returns false', function() {
    var v = new Validators.HasFourCyphers();
    var source = '123';

    Engine.AreEqual(false, v.check(source));
});

new Engine.Test('HasFourCyphers when is not a number returns false', function() {
    var v = new Validators.HasFourCyphers();
    var source = 'asdf';

    Engine.AreEqual(false, v.check(source));
});





new Engine.Test('HasRepeatedCyphers class exists', function() {
    Engine.IsNotNull(Validators.HasRepeatedCyphers);
    Engine.IsNotUndefined(Validators.HasRepeatedCyphers);
});

new Engine.Test('HasRepeatedCyphers class defines a check method', function() {
    var v = new Validators.HasRepeatedCyphers();
    Engine.IsNotNull(v.check);
    Engine.IsNotUndefined(v.check);
    Engine.IsFunction(v.check);
});

new Engine.Test('HasRepeatedCyphers when has 4 different cyphers returns false', function() {
    var v = new Validators.HasRepeatedCyphers();
    var source = '0123';

    Engine.AreEqual(false, v.check(source));
});

new Engine.Test('HasRepeatedCyphers when has 2 repeated cyphers returns true', function() {
    var v = new Validators.HasRepeatedCyphers();
    var source = '12341';

    Engine.AreEqual(true, v.check(source));
});

new Engine.Test('HasRepeatedCyphers when has all cyphers repeated returns true', function() {
    var v = new Validators.HasRepeatedCyphers();
    var source = '111111111';

    Engine.AreEqual(true, v.check(source));
});

new Engine.Test('HasRepeatedCyphers when is not a number throws an error', function() {
    var v = new Validators.HasRepeatedCyphers();
    var source = 'asdf';

    Engine.ThrowsException(v.check(source));
});



console.log('Number of tests passed: ' + Engine.Reports.number_of_tests_passed);
console.log('Number of tests failed: ' + Engine.Reports.number_of_tests_failed);