window.onload = function(){
	// FUNCTUS
	function loadData(){
		/* 
		** Extrai objetos do chrome.storage , cria elementos <li> e inclui no #document
		*/
		chrome.storage.sync.get(
			function(item){
				var objArray = [],
					obj;
				
				objArray.push(item);
				id = objArray.length; // sincroniza o id global com o do storage
				obj = objArray[0]; // extrai o objeto do array

				// caso não existam objetos no array, pula o load e reseta o valor do id
				if ( objArray.length < 1 ) {
					id = 0;
					return 'não existem elementos no objArray, resetando o id';
				}

				// armazena os dados do storage.local
				storageObj = obj;

				// cria elementos <li> e faz o append na <ul> #todo-list
				for(var i in obj){
					var item 	= obj[i],
						li 		= doc.createElement('li'),
						span 	= doc.createElement('span');

					li.className = 'item';
					li.id 		 = i;
					li.innerText = item.value;
					span.className = 'remove-button';
					span.innerText = 'x';						
					li.appendChild(span);
					todoList.appendChild(li);
				}
				// vasculha todos os <li> e adiciona a functus de remover item
				setRemovers();
			} // storage callback()
		);
	} // loadData()

	function addItem(){
		/*
		**	Cria e insere na <ul> todo-list um elemento <li>
		*/

		if ( userInput.value === '' ) {
			return false;
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
				// extrai o id do <li>, que eh o mesmo contido no storage
				var objId 	= this.parentNode.id;
					objId 	= parseInt(objId);

				// cruza o id do <li> com o dos objetos armazenados na variavel global
				for ( var j in storageObj ) {
					if ( storageObj[j].id === objId ) {
						// remove o <li> da lista
						delete storageObj[j];
						// dah um hide no <li>
						this.parentNode.style.display = 'none';
					}
				}

				// limpa o storage
				chrome.storage.sync.clear();

				// envia a nova lista de objetos para o storage
				chrome.storage.sync.set(storageObj);
			};
		
		// insere o span dentro do <li>
		li.appendChild(span);

		// adiciona o elemento <li> a lista
		todoList.appendChild(li);

		// cria um objeto e armazena os dados
		var	item = {
			id 		: id,
			value	: userInput.value
		};

		storageObj[id] = item;

		// armazena os dados no storage
		chrome.storage.sync.set(storageObj);
		// incrementa o id
		id++;

		// reseta o valor do input
		userInput.value = '';
		
		// vasculha todos os <li> e adiciona o efeito de remover item
		setRemovers();
	} // addItem()

	// function setRemovers(){
	// 	/*
	// 	**	Adiciona uma functus de remover para cada <li>
	// 	*/

	// 	var length = removeButton.length;

	// 	for( var i = 0; i < length; i++ ){
	// 		removeButton[i].onclick = function(){
	// 			// extrai o id do <li>, que eh o mesmo contido no storage
	// 			var objId 	= this.parentNode.id;
	// 				objId 	= parseInt(objId);

	// 			// cruza o id do <li> com o dos objetos armazenados na variavel global
	// 			for ( var j in storageObj ) {
	// 				if ( storageObj[j].id === objId ) {
	// 					// remove o <li> da lista
	// 					delete storageObj[j];
	// 					// dah um hide no <li>
	// 					this.parentNode.style.display = 'none';
	// 				}
	// 			}

	// 			// limpa o storage
	// 			chrome.storage.sync.clear();

	// 			// envia a nova lista de objetos para o storage
	// 			chrome.storage.sync.set(storageObj);
	// 		};
	// 	}
	// } // setRemovers()

	// INICIO
	var doc 			= document,
		addButton		= doc.getElementById('add-button'),
		userInput 		= doc.getElementById('user-input'),
		removeButton	= doc.getElementsByClassName('remove-button'),
		todoList 		= doc.getElementById('todo-list'),
		storageObj 	 	= {},
		storageBytes 	= 0,
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

	// se jah existirem dados no storage, faz um load
	loadData();
} // window.onload()