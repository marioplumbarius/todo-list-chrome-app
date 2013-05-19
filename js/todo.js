document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        initTodo();
    }
}

function initTodo(){
	function removeParent(obj){
		/*
		** 	Remove do DOM e do storage o pai do elemento passado como parametro
		** 	@param {Object}
		*/

		for ( var i in storageObj ) {
			// se o id do <li> no storage for igual ao do <li> que esta no HTML
			if ( parseInt(i) ===  parseInt(obj.parentNode.id) ) {
				// remove o <li> do HTML
				delete storageObj[i];
				obj.parentNode.parentNode.removeChild(obj.parentNode);
			}
		}
		// atualiza o storage do browser
		saveChanges(storageObj);
	} // removeParent()

	function createHTMLItem(id, value){
		/*
		**	Cria um elemento <li> para ser adicionado a <ul>
		**	@param {Integer} 		-> a primary_key do objeto
		**	@param {String}  		-> o conteudo do <li>
		** 	@return {HTMLElement}	-> elemento <li> pronto para ser adicionado a <ul>
		*/

		// cria o elemento <li>
		var li 				= doc.createElement('li');
			li.className 	= 'item';
			li.id 			= id;
			// li.innerText 	= value;

		// cria o elemento de checkbox / tarefa concluida
		var checkbox 		= doc.createElement('input');
			checkbox.type 	= 'checkbox';
			checkbox.onclick = function() {
				var content = checkbox.parentNode.getElementsByClassName('content')[0];
				if ( checkbox.checked ) {
					content.classList.add('done');
				} else {
					content.classList.remove('done');
				}
			};


		// cria o elemento que armazenara o conteudo
		var content 			= doc.createElement('span');
			content.className 	= 'content';
			content.innerText 	= value;
			content.addEventListener('click', function(){
				content.setAttribute('contenteditable', 'true');
			}, false);
		
		// cria o elemento que servira para remover o <li> da lista
		var button 				= doc.createElement('button');
			// button.type 		= 'button';
			button.className 	= 'remove-button';
			button.innerText	= 'x';
			button.onclick 		= function(){
				removeParent(this);
			};
		// joga os elementos dentro do <li>
		li.appendChild(checkbox);
		li.appendChild(content);
		li.appendChild(button);
		return li;
	} // createHTMLItem()

	function createStorageItem(id, value){
		/*
		**	Cria um objeto para armazenar os dados do <li>
		**	@param {Integer} -> a primary_key do objeto
		**	@param {String}  -> o conteudo do objeto
		** 	@return {Object} -> objeto pronto para ser adicionado ao storageObj
		*/

		var	item = {
			'id' 	: id,
			'value'	: value
		};

		return item;
	} // createStorageItem()

	function saveChanges(obj){
		/*
		**	Limpa o chache do storage e adiciona o objeto passado como parametro
		** 	@param {Object} e.g.: Object{0: Object, 1: Object, 2: Object}
		*/
		chrome.storage.sync.clear();
		chrome.storage.sync.set(obj);
	} // saveChanges()
	
	function loadData(){
		/* 
		** Extrai objetos do chrome.storage.sync, cria elementos <li> e inclui no <ul>
		*/
		chrome.storage.sync.get(
			function(items){
				// cria um array para armazenar o objeto vindo do storage
				var obj = [];
				obj.push(items);

				// se o array for maior que 0, existem dados para serem carregados
				if ( obj.length > 0 ) {
					// extrai o obj do array
					obj = obj[0];

					// armazena a quantidade de objetos baseado na quantidade de keys
					var lastIndex  	= (Object.keys(obj).length) - 1,
		  				i 			= 0;

		  			// encontra o valor do ultimo id e atualiza a variavel do js
					for(var key in obj){
						if (i === lastIndex) {
							id = parseInt(key);
							id++;
						}
						i++;
					}
					// armazena o objeto na variavel do js
					storageObj = obj;
				// caso nao existem dados para serem carregados,
				// reseta as variaveis do js e para a execucao
				} else {
					id = 0;
					storageObj = {};
					return;
				}

				// cria elementos <li> e faz o append na <ul> #todo-list
				for(var i in storageObj){
					var item 	= storageObj[i],
						li 		= createHTMLItem(item.id, item.value);
					todoList.appendChild(li);
				} // for
			} // callback()
		); // chrome.storage.sync.get()
	} // loadData()

	function addItem(){
		/*
		**	Cria e insere objetos no HTML (<li>) e no storage (items)
		*/

		// evita que dados em branco sejam adicionados no storage
		if ( userInput.value === '' ) {
			return false;
		// reseta o id caso o usuario delete todos os <li>
		} else if ( Object.keys(storageObj).length < 1 ) {
			id = 0;
		}

		// cria um <li> e insere no HTML
		var li = createHTMLItem(id, userInput.value);
		todoList.appendChild(li);

		// cria um item e insere no storage
		var item = createStorageItem(id, userInput.value);
		storageObj[id] = item;

		// incrementa o id
		id++;

		// salva os dados no storage
		saveChanges(storageObj);

		// reseta o valor do input
		userInput.value = '';
	} // addItem()

	// Inicio
	// armazena no js os elementos do HTML que serao processados
	var doc 			= document,
		addButton		= doc.getElementById('add-button'),
		userInput 		= doc.getElementById('user-input'),
		removeButton	= doc.getElementsByClassName('remove-button'),
		todoList 		= doc.getElementById('todo-list'),
		storageObj 	 	= {},
		id 				= 0;

	addButton.onclick = function(){
		addItem();
	};

	userInput.onkeypress = function(e){
		// tecla enter do teclado
		if ( e.keyCode === 13 ) {
			addItem();
		}
	};

	// carrega dados do storage OU reseta as variaveis do js
	loadData();

	// $('#todo-list').sortable();
} // initTodo()