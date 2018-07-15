<?php
header('Access-Control-Allow-Origin: *');

function findMeanings($inputWord)
//find meanings from input word
{

    if ($inputWord == null || $inputWord == '') {
        return (0);
    }

    require_once './setup/config.php';
    $table = getTable($inputWord);

    if ($table == 'en2sn') {
        $stmt = mysqli_prepare($link, "SELECT meanings FROM en2sn WHERE word=?");
    } else {
        $stmt = mysqli_prepare($link, "SELECT meanings FROM sn2en WHERE word=?");
    }
    
    mysqli_stmt_bind_param($stmt, "s", $inputWord);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $result);
    mysqli_stmt_fetch($stmt);

    if ($result !== null) {
        $meanings = explode('|', $result);
        return (json_encode($meanings));
    } else {
        return (0);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($link);
}

function getTable($inputWord)
// select db table using input word's language
{
    if (!preg_match('/[^A-Za-z0-9-.]/', $inputWord)) {
        //if input is english
        return ("en2sn");
    } else {
        return ("sn2en");
    }
}

//get query
if (isset($_GET['s'])) {
    $inputWord = $_GET['s'];

    if (getTable($inputWord) == "en2sn") {
        $inputWord = strtolower($inputWord);
    } 
    
    echo (findMeanings($inputWord));
}
