// # Mivu Library
// --------------
// **Mivu** is a library which aims to learn best practices on javascript code.
// The code is based on Douglas Crockford learnings and his book [JavaScript:
// The Good Parts](http://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742).
// The current *features* of **Mivu** are:
//  + Simple object *cloning* to make copies easier.
//  + Simple object *inheriting* to create objects hierarchies.
//  + *Mvc pattern* for making javascript client applications.

// *JSHint flags*
/* jshint bitwise: true */ /* prohibition of bitwise operators */
/* jshint curly: true */ /* curly braces have to be put always on loops and conditionals */
/* jshint eqeqeq: true */ /* prohibition of == != */
/* jshint es3: true */ /* ECMAScript 3 specification */
/* jshint freeze: true */ /* prohibition of overwritting prototypes of native objects */
/* jshint newcap: true */ /* capitalization of constructor functions */
/* jshint strict: true */ /* ECMAScript 5 strict mode */
/* jshint undef: true */ /* prohibition of undeclared variables */
/* jshint unused: true */ /* warning about unused variables */

/* global Event:false */


// ## Mivu Class
// Mivu class is the main class of the library. It has defined all the common
// methods that are used in all the library and outside the library too. In addition,
// it is the main namespace so you can access to other namespaces like Mvc using
// `Mivu.Mvc`.

var Mivu = Mivu || (function() {
	'use strict';
	
	// ** clone **: 
	// This method allows to `clone` objects in a simple way. It creates a new different
	// object from the current but with the same properties and values.
	function _clone(elem) {
		var cloned = {};
		for(var property in elem) {
			if(elem.hasOwnProperty(property)) {
				cloned[property] = elem[property];
			}
		}		
		return cloned;
	}
	
	// ** inherit **: 
	// This method allows to `inherit` in a simple way. The child object is passed
	// on target param and the parent is passed on object param.
	function _inherit(target, object) {
		object.__proto__ = target.__proto__;
		target.__proto__ = object;
		
		return target;
	}
	
	// The closure object returned by the function.
	var that = {
		clone: _clone,
		inherit: _inherit
	};
	
	return that;
})();

// * * *

// ## Events Class
// This class is an event dispatcher for custom objects or DOM elements. It's syntax
// is very simple, it only have three main methods to listen and unlisten to events
// and one for triggering events.

Mivu.Events = (function() {
	'use strict';
	
	// ** fire **: 
	// This method allows to `fire` or trigger events. The elem param is the source object,
	// type param is a string for setting which type of event we want to trigger, and
	// params is an optional parameter to add information to callbacks methods.
	function _fire(elem, type, params) {
		var ev = document.createEvent('CustomEvent');
		ev.initCustomEvent(type, true, true, params);
		
		ev = undefined !== params && null !== params ? Mivu.inherit(params, ev) : ev;
		
		if(elem instanceof Node) {
			elem.dispatchEvent(ev);
		}
		else {
			if(!elem.handlers || !elem.handlers[type]) {
				return;
			}
			
			for(var i = 0; i < elem.handlers[type].length; i++) {
				elem.handlers[type][i](ev);
			}
		}
	}
	
	// ** off **: 
	// This method allows to remove methods associated to object events. The 
	// elem param is the source object, type param is a string for setting which 
	// type of event we want to get off, method is the function that is executed 
	// and the context is relative to the execution of the method parameter.
	function _off(elem, type, method, context) {
		if(!elem.handlers || !elem.handlers[type]) {
			return;
		}
		
		var m = context ? function() { method.apply(context, arguments); } : method;

		for(var i = 0; i < elem.handlers[type].length; i++) {
			if(elem.handlers[type][i].toString() === m.toString()) {
				elem.handlers[type].splice(i, 1);
				break;
			}
		}
	}
	
	// ** on **: 
	// This method allows to add methods associated to object events. The 
	// elem param is the source object, type param is a string for setting which 
	// type of event we want to get on, method is the function that is executed 
	// and the context is relative to the execution of the method parameter.
	function _on(elem, type, method, context) {
		var m = context ? function() { method.apply(context, arguments); } : method;

		if(elem instanceof Node) {
			if(elem.addEventListener) {
				elem.addEventListener(type, m);
			}
			else {
				elem.attachEvent(type, m);
			}
		}
		else {
			elem.handlers = elem.handlers || {};
			elem.handlers[type] = elem.handlers[type] || [];
			elem.handlers[type].push(m);
		}
	}
	
	// ** remove **: 
	// This method allows to remove all methods associated to object events. The 
	// elem param is the source object and type param is a string that set the type
	// of event.
	function _remove(elem, type) {
		if(!elem.handlers || !elem.handlers[type]) {
			return;
		}
		
		elem.handlers[type] = [];
	}
	
	// The closure object returned by the function.
	var that = {
		fire: _fire,
		off: _off,
		on: _on,
		remove: _remove
	};
	
	return that;
})();

// * * *

// ## Mvc Namespace
// The Mvc namespace contains the classes that implements the mvc pattern.
Mivu.Mvc = (function(Mivu) {
	'use strict';
	
	// ## Model Class
	// This class represents the `m` in the mvc name. The main functionality is to
	// store properties and values and fire events when these are set.
	var model = function(properties) {
		
		properties = properties || {};
		
		// ** get **:
		// This method returns the value of a property. If this property
		// doesn't exist returns undefined.
		function _get(name) {
			return properties[name];
		}
		
		// ** keys **: 
		// This method returns an array with the name of all properties.
		function _keys() {
			return Object.keys(properties);
		}
		
		// ** set **:
		// This method set the value for a property. If the propety doesn't
		// exist it is created, in other case is overwrite. In both cases,
		// it is triggered the event `changing` before setting the value and
		// the event `changed` after setting the value.
		function _set(name, value) {
			Mivu.Events.fire(this, 'changing');
			properties[name] = value;
			Mivu.Events.fire(this, 'changed');
		}
		
		
		// The closure object returned by the function.
		var that = {
			get: _get,			
			keys: _keys,			
			set: _set
		};
		
		return that;
	};
	
	// * * *
	
	// ## ModelSet Class
	// This class represents a set of models. It is designed to work when
	// lists have to be handle.
	var modelSet = function() {
		
		var models = [];
	
		// ** add **:
		// This method adds new model to the set. The options parameter is
		// an object with properties. Before adding the model to the collection
		// it is triggered the event `adding` and the event `added` is triggered
		// after adding the model to the collection.
		function _add(options) {
			Mivu.Events.fire(this, 'adding');
			
			var m = new Mivu.Mvc.Model(options);				
			var context = this;
			
			/* the model class doesn't have a delete method. So, 
			it is added here to make easy to developers removing
			models. */
			m.destroy = function() { context.destroy(this); };			
			Mivu.Events.on(m, 'changed', function(){ Mivu.Events.fire(context, 'changed'); });
			models.push(m);
			
			Mivu.Events.fire(this, 'added', { model: m, index: models.length - 1 });
		}
	
		// ** _containsIndex **:
		// Private method.
		function _containsIndex(index) {
			return models.length > index && index > -1;
		}
		
		// ** count **: 
		// This method returns the number of elements in the 
		// model collection. If a method is passed as parameter
		// the return value is filtered using it.
		function _count(method) {
			if(undefined === method || null === method || method.constructor !== Function) {
				return models.length;
			}
			
			var counter = 0;
			for(var i = 0; i < models.length; i++) {
				counter += method(models[i]) ? 1 : 0;
			}
			
			return counter;
		}

		// ** destroy **: 
		// This method remove the current model from the collection.
		function _destroy(model) {
			var index = _indexOf(model);
			
			if(!_containsIndex(index)) {
				return;
			}
			
			Mivu.Events.fire(this, 'destroying');
			var m = models.splice(index, 1);
			Mivu.Events.fire(this, 'destroyed', { model: m, index: index });
		}
		
		// ** each **: 
		// This method executes the method passed as parameter for
		// each of the models of the collecion. The method is executed
		// with two parameters: the model, the index.
		function _each(method) {
			for(var i = 0; i < models.length; i++) {
				method(models[i], i);
			}
		}
		
		// ** _indexOf **:
		// Private method.
		function _indexOf(model) {
			var index = -1;
			for(var i = 0; i < models.length; i++) {
				if(models[i] === model) {
					index = i;
				}
			}
			
			return index;
		}
		
		// ** insert **:
		// This method insert a new model in the position passed.
		function _insert(options, index) {
			Mivu.Events.fire(this, 'adding');
			
			var m = new Mivu.Mvc.Model(options);
			models.splice(index, 0, m);
			
			Mivu.Events.fire(this, 'added', { model: m, index: index });
		}
	
	
		// The closure object returned by the function.
		var that = {
			add: _add,			
			count: _count,			
			destroy: _destroy,
			each: _each,
			insert: _insert
		};
		
		return that;
	};

	// * * *
	
	// ## View Class
	// This class represents the v in the mvc pattern. This is the
	// view that we want to handle and treat based on a model. A view
	// is related with a model.
	var view = function(options) {
	
		options = options || {};
		
		// ** actions property **:
		// This property contains all the method to execute related
		// to html controls of the view. Those methods are defined
		// this way: '.' + css class + ' ' + event. An example could be
		// this: '.coolButton click'.
		options.actions = options.actions || {};
		
		// ** onRender property **:
		// This property is a function that executes when the view is
		// rendering.
		options.actions.onRender = options.actions.onRender || function() {};
		
		// ** elem property **:
		// This property represents the DOM root element of the view. If it
		// is specified means that the view elements are rendered. In other
		// case, the view will render its template.
		options.elem = options.elem || null;
		
		// ** model property **:
		// This property is the model that the view is associated.
		options.model = options.model || null;
		
		// ** root property **:
		// This property is the DOM element where the view has to be rendered. If none
		// is specified, it assumes that the view will be rendered on the body.
		options.root = options.root || document.body;
		
		// ** tag property **:
		// This property represents the element that has to be rendered. For
		// example, if we want to render a paragraph this property has to be
		// assigned to `p`. By default is `div`.
		options.tag = options.tag || 'div';
		
		// ** template property **:
		// This property represents the html that has to be rendered.
		options.template = options.template || '';
		
		
		// ** _bindActions **:
		// Private method.
		function _bindActions() {
			var uiActions = Object.keys(options.actions);
			for(var i = 0; i < uiActions.length; i++) {
				if(uiActions[i] === 'onRender') {
					continue;
				}
				var control = uiActions[i].split(' ')[0].substr(1);
				var event = uiActions[i].split(' ')[1];
				var method = options.actions[uiActions[i]];
				
				var controls = this.get(control);
				for(var j = 0; j < controls.length; j++) {
					Mivu.Events.on(controls[j], event, method, {
						model: options.model,
						view: this
					});
				}
			}
		}
		
		// ** get **:
		// This method returns a collection with the nodes that have the
		// class css passed as name. If null or undefined or nothing is
		// passed as argument returns a collection with the root node.
		function _getByCssClass(name) {
			if(undefined === options.elem || null === options.elem) {
				return [];
			}
			
			return undefined === name || null === name || '' === name ? 
				[options.elem] : 
				options.elem.getElementsByClassName(name);
		}
			
		// ** render **:
		// This method renders the current view.
		function _render() {
			if(null === options.elem || null === options.elem.parentNode || !(options.elem instanceof HTMLElement)) {
				options.elem = document.createElement(options.tag);
				options.root.appendChild(options.elem);
				options.elem.innerHTML = options.template;
			}
			
			if(undefined === options.model || null === options.model) {
				options.elem.parentNode.removeChild(options.elem);
				return;
			}
			
			options.actions.onRender.apply({
				model: options.model,
				view: this
			});
		}

		// The closure object returned by the function.
		var that = {
			get: _getByCssClass,
			render: function() {
				_render.apply(this);
				_bindActions.apply(this);
			}
		};
		
		// The trigger function to be executed when the model fire
		// any event.
		function trigger() { 
			options.actions.onRender.apply({
				model: options.model,
				view: that
			}); 
		}
		
		// Listening to each model event.
		Mivu.Events.on(options.model, 'added', trigger, that);
		Mivu.Events.on(options.model, 'changed', trigger, that);
		Mivu.Events.on(options.model, 'destroyed', trigger, that);
		
		return that;
	};
	
	// * * *
	
	// ## ViewSet Class
	// This class represents a set of models. It is designed to work when
	// lists have to be handle.
	var viewSet = function(options) {

		options = options || {};
		
		// ** elem property **:
		// This property represents the DOM root element of the view. If it
		// is specified means that the view elements are rendered. In other
		// case, the view will render its template.
		options.elem = options.elem || null;
		
		// ** filter property **:
		// This property is a method for filtering the model items associated
		// to this view. By default, the method not filter anyone.
		options.filter = options.filter || function() { return true; };
		
		// ** model property **:
		// This property is the model that the view is associated.
		options.model = options.model || null;
		
		// ** root property **:
		// This property is the DOM element where the view has to be rendered. If none
		// is specified, it assumes that the view will be rendered on the body.
		options.root = options.root || document.body;
		
		// ** tag property **:
		// This property represents the element that has to be rendered. For
		// example, if we want to render a paragraph this property has to be
		// assigned to `p`. By default is `div`.
		options.tag = options.tag || 'ul';
		
		// ** view property **:
		// This property is the set of properties for one view, that means that
		// the object to assign is the same as the parameters of a Mivu.Mvc.View
		// instance.
		options.view = options.view || null;
	
		var views = [];
		
		// ** _add **:
		// Private method.
		function _add(model) {
			var optionsView = Mivu.clone(options.view);
			optionsView.root = options.elem;
			optionsView.model = model;
			
			var v = new Mivu.Mvc.View(optionsView);
			views.push(v);
		}
		
		// ** filter **:
		// This method assigns a new filter method.
		function _filter(method) {
			if(undefined === method || null === method || method.constructor !== Function) {
				method = function() { return true; };
			}
			
			Mivu.Events.fire(this, 'changing');
			options.filter = method;
			Mivu.Events.fire(this, 'changed');
		}

		// ** _initialize **:
		// Private method.
		function _initialize() {
			Mivu.Events.on(options.model, 'added', function(event) { _add(event.model); }, that);
			Mivu.Events.on(options.model, 'added', _renderAll, that);
			Mivu.Events.on(options.model, 'changed', function() { Mivu.Events.fire(this, 'changed'); }, that);
			Mivu.Events.on(options.model, 'destroyed', function(event) { views.splice(event.index, 1); }, that);
			Mivu.Events.on(options.model, 'destroyed', _renderAll, that);
			
			options.model.each(_add);
		}
		
		// ** render **:
		// This method renders the current view.
		function _renderAll() {
			if(null === options.elem || !(options.elem instanceof HTMLElement)) {		
				options.elem = document.createElement(options.tag);
				options.root.appendChild(options.elem);
			}
			
			while(options.elem.childNodes.length > 0) {
				options.elem.removeChild(options.elem.firstChild);
			}

			options.model.each(function(item, index) {
				if(options.filter(item)) {
					views[index].render();
				}
			});
		}
		
		// The closure object returned by the function.
		var that = {
			filter: _filter,
			render: _renderAll
		};
		
		// Initialization of the instance.
		_initialize();
		Mivu.Events.on(that, 'changed', _renderAll);
		
		return that;
	};
	
	
	// The closure object returned by the function.
	var that = {
		Model: model,
		ModelSet: modelSet,
		View: view,
		ViewSet: viewSet
	};
	
	return that;

})(Mivu);