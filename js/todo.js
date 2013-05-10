window.onload = function(){
	
	function removeParent(obj){
		for ( var i in storageObj ) {
			if ( parseInt(i) ===  parseInt(obj.parentNode.id) ) {
				delete storageObj[i];
				obj.parentNode.parentNode.removeChild(obj.parentNode);
			}
		}
		saveChanges(storageObj);
	} // removeParent()

	function saveChanges(obj){
		chrome.storage.sync.clear();
		chrome.storage.sync.set(obj);
	} // saveChanges()
	
	function loadData(){
		/* 
		** Extrai objetos do chrome.storage , cria elementos <li> e inclui no #document
		*/
		chrome.storage.sync.get(
			function(items){
				// cria um array para armazenar o objeto vindo do storage
				var obj = [];
				obj.push(items);

				// se o array for maior que 0, existem dados para serem carregados
				if ( obj.length === 1 ) {
					obj = obj[0]; // extrai o obj do array

					// armazena o length do objeto baseado na quantidade de keys
					var lastIndex  = (Object.keys(obj).length) - 1,
		  				i		= 0;

		  			// esse loop serve para encontrar o valor do ultimo id
					for(var key in obj){
						if (i === lastIndex) {
							id = parseInt(key);
							id++;
							console.log('o proximo id disponivel e = ' + id);
						}
						i++;
					}
					storageObj = obj;
				} else {
					id = 0;
					storageObj = {};
					return 'nao existem elementos no storage, o id foi resetado';
				}

				// cria elementos <li> e faz o append na <ul> #todo-list
				for(var i in storageObj){
					var item 	= storageObj[i],
						li 		= doc.createElement('li'),
						span 	= doc.createElement('span');

					li.className = 'item';
					li.id 		 = item.id;
					li.innerText = item.value;
					span.className = 'remove-button';
					span.innerText = 'x';
					span.onclick = function(){
						removeParent(this);
					};
					li.appendChild(span);
					todoList.appendChild(li);
				}
			} // storage callback()
		);
	} // loadData()

	function addItem(){
		/*
		**	Cria e insere na <ul> todo-list um elemento <li>
		*/

		if ( userInput.value === '' ) {
			return false;
		} else if ( Object.keys(storageObj).length < 1 ) {
			// reseta o id caso tudo seja excluido
			id = 0;
		}

		// cria o elemento <li>
		var li 				= doc.createElement('li');
			li.className	= 'item';
			li.id 			= id;
			li.innerText 	= userInput.value;
		
		// cria o elemento que servira para remover o <li> da lista
		var span 			= doc.createElement('span');
			span.className 	= 'remove-button';
			span.innerText 	= 'x';
			span.onclick 	= function(){
				removeParent(this);
			};
		
		li.appendChild(span);
		todoList.appendChild(li);

		// cria um objeto e armazena os dados do <li>
		var	item = {
			id 		: id,
			value	: userInput.value
		};

		// armazena o objeto na lista de <li> do storage do js
		storageObj[id] = item;
		
		// incrementa o id
		id++;

		// reseta o valor do input
		userInput.value = '';

		// salva os dados no storage
		saveChanges(storageObj);
	} // addItem()

	// INICIO
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

	// se ja existirem dados no storage, faz um load
	loadData();
} // window.onload()