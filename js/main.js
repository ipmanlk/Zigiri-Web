$(window).on("load", function () {
    getWordCount();
    $('#inputWord').focus();
    $('#inputWord').keyup(function () {
        $('#apiPanel').hide();
        suggestWords();
    });
});

function suggestWords() {
    //suggest words on key up

    var inputWord = $('#inputWord').val().trim();
    if (!isEmpty(inputWord)) {
        $('#listTitle').text("Suggestions");

        //send get request & get words (0 response = null)
        $.get('./suggest.php?s=' + inputWord, function (data) {
            if (data !== '0') {
                addToList(inputWord, data, 'suggest');
                $('#welcomePanel').hide();
                $('#list').fadeIn();

            } else {
                $("#listItems").empty();
                $("#listItems").append('<a href="#" class="list-group-item sinhala">' + "Sorry!. '" + inputWord + "' is not included in our database at the moment." + '</a>');
            }
        });
    } else {
        $('#list').hide();
        $('#welcomePanel').fadeIn();
    }

}

function findMeaning(inputWord) {
    $('#listTitle').text("Definitions");
    $('#inputWord').val(inputWord);
    //send get request & get meanings
    $.get('./find.php?s=' + inputWord, function (data) {
        addToList(inputWord, data, 'meaning');
    });
}

function addToList(inputWord, data, type) {
    //add meanings to div
    $("#listItems").empty();
    var jsonData = JSON.parse(data);
    for (item in jsonData) {
        if (type == 'suggest') {
            $("#listItems").append('<a href="#" onclick="findMeaning(' + "'" + jsonData[item] + "'" + ')" class="list-group-item sinhala">' + jsonData[item] + '</a>');
        } else {
            $("#listItems").append('<a href="#" class="list-group-item sinhala">' + jsonData[item] + '</a>');
        }
    }
}

function getWordCount() {
    $.get('./count.php', function (data) {
        $('#wordCount').text(data);
    });
}

function isEmpty(val) {
    //check if input null or empty
    if (val !== null && val !== '') {
        return false;
    } else {
        return true;
    }
}

$('#apiBtn').click(function() {
    $('#list').hide();
    $('#welcomePanel').hide();
    $('#apiPanel').fadeIn();
}); 