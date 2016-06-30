var GAME_STATUS = {
    NONE: 0,
    PLAYING: 1,
    WIN: 2,
    LOSE: 4,
    CREATING: 8,
};

Mivu.Events.on(document, 'readystatechange', function() {

    if(document.readyState === 'complete') {

        var game = null;

        var gameModel = new Mivu.Mvc.Model({
            status: GAME_STATUS.CREATING,
            attempts: 0,
            number: null,
            hits: 0,
        });

        var newGameView = new Mivu.Mvc.View({
            elem: document.getElementsByClassName('newgame-group')[0],
            model: gameModel,
            actions: {
                onRender: function() {
                    var status = this.model.get('status');

                    switch(status) {
                        case GAME_STATUS.CREATING:
                            console.log('>>> CREATING');
                            game = new Game();
                            this.model.set('status', GAME_STATUS.PLAYING);
                            break;

                        case GAME_STATUS.PLAYING:
                            console.log('>>> PLAYING');
                            var attempts = this.model.get('attempts');
                            var hits = this.model.get('hits');

                            if(hits === 4) {
                                this.model.set('status', GAME_STATUS.WIN);
                                break;
                            }

                            if(attempts === 10) {
                                this.model.set('status', GAME_STATUS.LOSE);
                                break;
                            }

                            break;

                        case GAME_STATUS.LOSE:
                            console.log('>>> LOSE');
                            break;

                        case GAME_STATUS.WIN:
                            console.log('>>> WIN');
                            break;
                    }
                },
                '.newgame-button click': function() {
                    while(resultsTableModel.count() !== 0) {
                        resultsTableModel.each(function(model) {
                            resultsTableModel.destroy(model);
                        });
                    }
                    this.model.set('hits', 0);
                    this.model.set('attempts', 0);
                    this.model.set('status', GAME_STATUS.CREATING);
                },
            },
        });

        newGameView.render();
        

        var resultsTableModel = new Mivu.Mvc.ModelSet();

        var guessNumberBoxView = new Mivu.Mvc.View({
            elem: document.getElementsByClassName('guessnumber-control')[0],
            model: gameModel,
            actions: {
                onRender: function() {
                    var status = this.model.get('status');
                    var value = this.model.get('number') || null;
                    var error = this.model.get('error') || '';
                    var control = this.view.get()[0];
                    var button = this.view.get('guessnumber-send')[0];
                    var input = this.view.get('guessnumber-input')[0];
                    var tip = this.view.get('guessnumber-message')[0];

                    button.disabled = status === GAME_STATUS.PLAYING && value !== null ? '' : 'true';
                    input.disabled = status === GAME_STATUS.PLAYING ? '' : 'true';

                    tip.innerHTML = error;                    
                    control.className = control.className.replace('error', '');                    
                    if(undefined !== error && null != error && '' !== error) {
                        control.className += ' error'; 
                    }
                },

                '.guessnumber-send click': function() {
                    var attempt = resultsTableModel.count();
                    var input = this.view.get('guessnumber-input')[0];
                    var value = input.value;

                    var result = game.play(value);
                    this.model.set('hits', result.hits);
                    this.model.set('attempts', attempt);

                    resultsTableModel.add({
                        attempt: attempt,
                        value: value,
                        result: result,
                    });

                    input.value = '';
                    this.model.set('number', null);
                },

                '.guessnumber-input keyup': function() {
                    var input = this.view.get('guessnumber-input')[0];
                    var value = input.value;

                    this.model.set('number', null);

                    var isNumber = new Validators.IsNumber();
                    if(!isNumber.check(value)) {
                        this.model.set('error', 'You didn\'t type a number');
                        return;
                    }

                    var beginWithZero = new Validators.BeginsWithZero();
                    if(beginWithZero.check(value)) {
                        this.model.set('error', 'You\'re number can\'t start with zero');
                        return;
                    }

                    var hasRepeatedCyphers = new Validators.HasRepeatedCyphers();
                    if(hasRepeatedCyphers.check(value)) {
                        this.model.set('error', 'You\'re number can\'t have repeated cyphers');
                        return;
                    }

                    var hasFourCyphers = new Validators.HasFourCyphers();
                    if(hasFourCyphers.check(value)) {
                        this.model.set('number', value);
                    }

                    this.model.set('error', '');
                }
            },
        });

        // Initialize actions for the view.
        guessNumberBoxView.render();
        

        var resultsTableView = new Mivu.Mvc.ViewSet({
            root: document.getElementsByClassName('resultstable-group')[0],
            elem: document.getElementsByClassName('resultstable-list')[0],
            model: resultsTableModel,
            view: {
                tag: 'li',
                template: '\
                    <div class="all-20 resultstable-attemp"></div> \
                    <div class="all-40 resultstable-number"></div> \
                    <div class="all-40 resultstable-result"></div>',
                actions: {
                    onRender: function() {
                        var attemp = this.model.get('attempt') + 1;
                        var number = this.model.get('value');
                        var result = this.model.get('result') || 'There is no result yet';
                        
                        this.view.get('resultstable-attemp')[0].innerHTML = attemp;
                        this.view.get('resultstable-number')[0].innerHTML = number;
                        this.view.get('resultstable-result')[0].innerHTML = 'Hits: ' + result.hits + ' Almost hits: ' + result.almost_hits;
                    },
                },
            },
        });

        resultsTableView.render();


        var loggerView = new Mivu.Mvc.ViewSet({
            root: document.getElementsByClassName('logger-group')[0],
            elem: document.getElementsByClassName('logger-list')[0],
            model: resultsTableModel,
            view: {
                tag: 'li',
                template: '<span class="logger-message"></span>',
                actions: {
                    onRender: function() {
                        var attemp = this.model.get('attempt') + 1;
                        var number = this.model.get('value');
                        var result = this.model.get('result') || 'There is no result yet';
                        
                        this.view.get('logger-message')[0].innerHTML = 'You typed the number ' + number;
                    },
                },
            },
        });

        loggerView.render();
    }
});