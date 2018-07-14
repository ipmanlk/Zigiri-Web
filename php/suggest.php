<?php
header("Content-Type: text/html;charset=UTF-8");

function suggestWords($inputWord)
//guess input word
{
    require_once 'config.php';
    $table = getTable($inputWord);
    $sql = "SELECT word FROM $table WHERE word LIKE '$inputWord%' ORDER BY word LIMIT 10";
    $query = mysqli_query($link, $sql);

    if (mysqli_num_rows($query) > 0) {
        $meanings = [];
        while ($row = mysqli_fetch_array($query)) {
            $meanings[] = $row['word'];
        }
        mysqli_close($link);
        return (json_encode($meanings));
    } else {
        mysqli_close($link);
        return (0);
    }
}

function getTable($inputWord)
// select db table using input word's language
{
    if (!preg_match('/[^A-Za-z0-9\w]/', $inputWord)) {
        //if input is english
        return ("en2sn");
    } else {
        return ("sn2en");
    }
}

//get query
if (isset($_GET['s'])) {
    $inputWord = strtolower($_GET['s']);
    echo (suggestWords($inputWord));
}
