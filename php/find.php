<?php
header("Content-Type: text/html;charset=UTF-8");

function findMeanings($inputWord)
//find meanings from input word
{
    require_once 'config.php';
    $table = getTable($inputWord);
    $sql = "SELECT meanings FROM $table WHERE word='$inputWord'";
    $query = mysqli_query($link, $sql);
    if (mysqli_num_rows($query) > 0) {
        $meanings = mysqli_fetch_array($query);
        mysqli_close($link);
        $meanings = explode('|', "$meanings[0]");
        return (json_encode($meanings));
    } else {
        mysqli_close($link);
        //return 0 if word not found
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
    echo (findMeanings($inputWord));
}
