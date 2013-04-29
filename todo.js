window.onload = function(){

	var doc 			= document,
		addButton		= doc.getElementById('add-button'),
		removeButton	= doc.getElementsByClassName('remove-button'),
		todoList 		= doc.getElementById('todo-list'),
		userInput 		= doc.getElementById('user-input'),
		storageObj 	 	= {},
		storageBytes 	= 0,
		id 				= 0;

	function loadData(){
		/* 
		** Extrai objetos do chrome.storage.local, cria elementos <li> e inclui no #document
		*/

		chrome.storage.local.get(
			function(item){
				var objArray = [],
					obj;
				
				objArray.push(item);
				id = objArray.length;
				obj = objArray[0]; // extrai o objeto do array

				// caso não existam objetos no array, pula o load e reseta o valor do id
				if ( id < 1 ) {
					id = 0;
					return 'não existem elementos no objArray';
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
				} // laço for
				setRemovers();
			} // function
		); // local.get()
	} // loadData()

	function setItem(){
		/*
		**	Cria e insere no #document um elemento <li>
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

		// armazena os dados no chrome.storage.local
		chrome.storage.local.set(storageObj);
		id++;

		// reseta o valor do input
		userInput.value = '';
		setRemovers();
	} // setItem()

	function setRemovers(){
		/*
		**	Adiciona uma acao de remover para cada <li>
		*/

		for( var i = 0; i < removeButton.length; i++ ){
			removeButton[i].onclick = function(){
				var objId 	= this.parentNode.id;
					objId 	= parseInt(objId);
				for ( var j in storageObj ) {
					if ( storageObj[j].id === objId ) {
						delete storageObj[j];
						chrome.storage.local.clear();
						chrome.storage.local.set(storageObj);
					}
				}
				this.parentNode.style.display = 'none';
			};
		}
	} // setRemovers()

	addButton.onclick = function(){
		setItem();
	}; // onclick()

	userInput.onkeypress = function(e){
		if ( e.keyCode === 13 ) {
			setItem();
		}
	}; // onkeypress()

	//============================================

	// se o localStorage ja conter data
	chrome.storage.local.getBytesInUse(
		function(x){
			storageBytes = x;

			if ( storageBytes > 0 ) {
				loadData();
			}
		}
	);
} // window.onload()