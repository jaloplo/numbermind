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
            firstGame: true,
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
                    var firstGame = this.model.get('firstGame');

                    if(firstGame) {
                        var styles = this.view.get()[0].className;
                        if(styles.indexOf('show-all') !== -1) {
                            this.view.get()[0].className = styles.replace('show-all', 'hide-all');
                        } else if(styles.indexOf('hide-all') === -1){
                            this.view.get()[0].className = styles + ' hide-all';
                        }
                    } else {
                        this.view.get()[0].className = this.view.get()[0].className.replace('hide-all', 'show-all');
                    }
                    

                    switch(status) {
                        case GAME_STATUS.CREATING:
                            game = new Game();
                            this.model.set('status', GAME_STATUS.PLAYING);
                            break;

                        case GAME_STATUS.PLAYING:
                            var attempts = this.model.get('attempts');
                            var hits = this.model.get('hits');

                            if(hits === 4) {
                                this.model.set('status', GAME_STATUS.WIN);
                                this.model.set('firstGame', false);
                                break;
                            }

                            if(attempts === 9) {
                                this.model.set('status', GAME_STATUS.LOSE);
                                this.model.set('firstGame', false);
                                break;
                            }

                            break;

                        case GAME_STATUS.LOSE:
                            break;

                        case GAME_STATUS.WIN:
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

        

        var messageView = new Mivu.Mvc.View({
            elem: document.getElementsByClassName('message-group')[0],
            model: gameModel,
            actions: {
                onRender: function() {
                    var status = this.model.get('status');
                    if(status === GAME_STATUS.WIN) {
                        this.view.get('message-text')[0].innerHTML = '¡¡¡Has ganado el juego!!!';
                    } else if(status === GAME_STATUS.LOSE) {
                        this.view.get('message-text')[0].innerHTML = 'Has perdido. Inténtalo otra vez.';
                    } else {
                        this.view.get('message-text')[0].innerHTML = '';
                    }
                },
            },
        });

        messageView.render();
        

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
                    button.className = button.className.replace('red', 'blue');

                    if(undefined !== error && null != error && '' !== error) {
                        control.className += ' error';
                        button.className = button.className.replace('blue', 'red'); 
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
                tag: 'tr',
                template: '\
                    <td class="all-20 resultstable-attemp"></td> \
                    <td class="all-20 resultstable-number"></td> \
                    <td class="all-60 resultstable-result"></td>',
                actions: {
                    onRender: function() {
                        var attempt = this.model.get('attempt') + 1;
                        var number = this.model.get('value');
                        var result = this.model.get('result') || 'There is no result yet';
                        
                        this.view.get('resultstable-attemp')[0].innerHTML = attempt;
                        this.view.get('resultstable-number')[0].innerHTML = number;
                        this.view.get('resultstable-result')[0].innerHTML = 'acertados: ' + result.hits + ' - en otra posición: ' + result.almost_hits;

                        if(result.hits === 4) {
                            this.view.get()[0].className += 'orange';
                        }
                    },
                },
            },
        });

        resultsTableView.render();

/*
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
        */
    }
});