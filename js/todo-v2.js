"use strict";

function List( container ){
	this.container 	= container || null;
	this.items 		= {
		ids : [],
		length : 0
	};

	this.get = function( attribute ){
		return this[attribute];
	};

	this.set = function( attribute, value ){
		this[attribute] = value;
	};
}

List.prototype.renderDOM = function( returnDOM ){
	var self 		= this;
	var returnDOM 	= returnDOM || null;
	
	self.DOM = $( '<ul>' + self.listName + '</ul>' );
	this.DOM = $( ul );

	if ( returnDOM ) {
		return this.DOM;
	}
};

List.prototype.addItem = function( itemDOM ) {
	/*
	** Adds an item to the list
	** @param {HTMLElement} : <li> HTML element
	*/

	var item 	= itemDOM;
	var itemID 	= itemDOM.attr('id');
		
	this.items.ids.push( itemID );
	this.container.append( item );

	this.items.length++;
};

List.prototype.removeItem = function( itemDOMID ) {
	/*
	** Removes an item from the list
	** @param {String} : <li> id attribute
	*/
	var itemID 		= itemDOMID;
	var foundIndex 	= this.items.ids.indexOf( itemID );

	if ( foundIndex > -1 ) {
		this.items.ids.splice( foundIndex, 1 );

		this.items.length--;
	}
};

function Item( element, id, data, status ){
	this.data 	= data || null;
	this.status = status || 'pending';
	this.id 	= id || null;
	this.DOM 	= element || null;

	this.get = function( attribute ){
		return this[attribute];
	};

	this.set = function( attribute, value ){
		this[attribute] = value;
	}
}

Item.prototype.renderDOM = function( returnDOM ){
	var returnDOM = returnDOM || null;
	var li = ''+
		'<li class="item" id="'+this.id+'" data-status="'+this.status+'">\
			<input type="checkbox" />\
			<span class="data" contenteditable="true">'+this.data+'</span>\
			<button class="remove-button">x</button>\
		</li>';

	this.DOM = $( li );

	if ( returnDOM ) {
		return this.DOM;
	}
};

window.TODOList 	= List;
window.TODOListItem = Item;