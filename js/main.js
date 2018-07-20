//_elem objects for each element
var apiPanel = new _elem('apiPanel');
var welcomePanel = new _elem('welcomePanel');
var list = new _elem('list');
var listItems = new _elem('listItems');
var listTitle = new _elem('listTitle');
var inputWord = new _elem('inputWord');
var wordCount = new _elem('wordCount');
var apiBtn = new _elem('apiBtn');

window.addEventListener("load", function () {
	getWordCount();
	document.getElementById('inputWord').focus();

	//call suggest words on keyup
	inputWord.getElem().addEventListener('keyup', function () {
		apiPanel.hide();
		suggestWords();
	});
});

//suggest words
function suggestWords() {

	let input = inputWord.getInputText().trim();

	if (!isEmpty(input)) {

		listTitle.setText("Suggestions");

		//send get request & get words (0 response = null)
		fetch('./suggest.php?s=' + input)
			.then(function (response) {
				return response.text();
			})

			.then(function (data) {
				if (data !== '0') {
					addToList(data, 'suggest');
					welcomePanel.hide();
					list.fadeIn();
				} else {
					listItems.empty();
					listItems.append('<a href="#" class="list-group-item sinhala">' + "Sorry!. '" + input + "' is not included in our database at the moment." + '</a>', 'beforeend')
				}
			});

	} else {
		list.hide();
		welcomePanel.fadeIn();
	}

}

//find meaning of a given word
function findMeaning(input) {
	listTitle.setText("Definitions");
	inputWord.setInputText(input);

	//send get request & get meanings
	fetch('./find.php?s=' + input)
		.then(function (response) {
			return response.text();
		})

		.then(function (data) {
			addToList(data, 'meaning');
		});


}

//add items to listItems div
function addToList(data, type) {
	listItems.empty();
	var jsonData = JSON.parse(data);

	for (item in jsonData) {
		if (type == 'suggest') {
			listItems.append('<a href="#" onclick="findMeaning(' + "'" + jsonData[item] + "'" + ')" class="list-group-item sinhala">' + jsonData[item] + '</a>', 'beforeend');
		} else {
			listItems.append('<a href="#" class="list-group-item sinhala">' + jsonData[item] + '</a>', 'beforeend');
		}
	}
}

//request word count
function getWordCount() {
	fetch('./count.php')
		.then(function (response) {
			return response.text();
		})

		.then(function (data) {
			wordCount.setText(data);
		});
}

//check null or empty
function isEmpty(val) {
	if (val !== null && val !== '') {
		return false;
	} else {
		return true;
	}
}

//api button (hyperlink) on click
apiBtn.getElem().addEventListener('click', function() {
	list.hide();
	welcomePanel.hide();
	apiPanel.fadeIn();
});


//_elem to use on elements (alter elements)
function _elem(id) {
	this.elem = document.getElementById(id);
	var el = this.elem;

	this.getElem = function() {
		return(el);
	}

	this.fadeIn = function () {

		el.style.opacity = 0;
		el.style.display = "block";

		(function fade() {
			var val = parseFloat(el.style.opacity);
			if (!((val += .1) > 1)) {
				el.style.opacity = val;
				setTimeout(fade, 40);
			}
		})();
	}

	this.fadeOut = function () {
		el.style.opacity = 1;
		(function fade() {
			if ((el.style.opacity -= .1) < 0) {
				el.style.display = "none";
			} else {
				setTimeout(fade, 40);
			}
		})();
	}

	this.hide = function () {
		el.style.display = "none";
	}

	this.empty = function () {
		el.innerHTML = " ";
	}

	this.append = function (val, pos) {
		el.insertAdjacentHTML(pos, val);
	}

	this.setText = function (val) {
		el.innerHTML = val;
	}

	this.getInputText = function () {
		return (el.value);
	}

	this.setInputText = function (val) {
		el.value = val;
	}
}
