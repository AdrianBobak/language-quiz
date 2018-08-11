(function(){
	let xhr = new XMLHttpRequest();
	xhr.open('GET', 'json/data.json');
	xhr.send();
	let base;

	xhr.addEventListener('readystatechange', function() {
		if(this.readyState === 4 && this.status === 200){
			base = JSON.parse(xhr.response);
			quiz();
		}
	});


	let question = document.querySelector('#question'),
		answerButtons = document.querySelectorAll('.answer'),
		next = document.querySelector('.next'),
		goodCount = document.querySelector('.good-count'),
		badCount = document.querySelector('.bad-count');

	let good = 0,
		bad = 0;

	function quiz(){
		next.style.display = 'none';
		for(let i = 0; i < answerButtons.length; i++){
			answerButtons[i].classList.remove('good');
			answerButtons[i].classList.remove('bad');
		}

		let baseKeys = Object.keys(base);
		let randomKey = baseKeys[Math.floor((Math.random() * baseKeys.length))];

		if(question.textContent !== randomKey){
		   question.textContent = randomKey;
		} else {
			quiz();
			return;
		}

		let answers = [base[randomKey]];
		while(answers.length < answerButtons.length){
			let wrongAnswer = baseKeys[Math.floor((Math.random() * baseKeys.length))];
			if(answers.indexOf(base[wrongAnswer]) === -1){
				answers.push(base[wrongAnswer]);
			}
		}

		for(let i = 0; i < answerButtons.length; i++){
			let random = Math.floor(Math.random() * answers.length);
			let answerToAdd = answers.splice(random,1);
			answerButtons[i].textContent = answerToAdd;
		}

		let firstCheckAnswer = true;
		function checkAnswer(e){
			if(e.target.childNodes[0].textContent === base[randomKey]){
				e.target.classList.add('good');
				next.style.display = 'block';
				for(let j = 0; j < answerButtons.length; j++){
					answerButtons[j].removeEventListener('click', checkAnswer);
				}
				next.addEventListener('click', quiz);
				if(firstCheckAnswer){
					goodCount.textContent = (++good);
					firstCheckAnswer = false;
				}
			} else {
				e.target.classList.add('bad');
				if(firstCheckAnswer){
					badCount.textContent = (++bad);
					firstCheckAnswer = false;
				}
			}
		}

		for(let j = 0; j < answerButtons.length; j++){
			answerButtons[j].addEventListener('click', checkAnswer);
		}
	}


	let addWord = document.querySelector('#new-word'),
		addWordEN = addWord.querySelector('.en'),
		addWordPL = addWord.querySelector('.pl'),
		addWordInput = addWord.querySelector('.send');

	addWordInput.addEventListener('click', addNewWord);

	function addNewWord(e){
		e.preventDefault();
		if(addWordEN.value && addWordPL.value){
			base[addWordEN.value] = addWordPL.value;
			let baseJSON = JSON.stringify(base);
			console.log(baseJSON);
			let xhr = new XMLHttpRequest();
			xhr.open('POST', 'php/update-json.php');
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(baseJSON);

			addWordEN.classList.remove('addword-error');
			addWordPL.classList.remove('addword-error');
			addWordEN.value = '';
			addWordPL.value = '';

		} else if(!(addWordEN.value)) {
			addWordEN.classList.add('addword-error');
		} else if(!(addWordPL.value)) {
			addWordPL.classList.add('addword-error');
		}
	}
})();