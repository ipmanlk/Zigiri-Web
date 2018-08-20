<?php
header('Access-Control-Allow-Origin: *');

function suggestWords($inputWord)
//guess input word
{
  if ($inputWord == null || $inputWord == '') {
    return (0);
  }

  require_once './setup/config.php';
  $table = getTable($inputWord);

  if ($table == 'en2sn') {
    $stmt = mysqli_prepare($link, "SELECT word FROM en2sn WHERE word LIKE ? ORDER BY word LIMIT 10");
  } else {
    $stmt = mysqli_prepare($link, "SELECT word FROM sn2en WHERE word LIKE ? ORDER BY word LIMIT 10");
  }

  $inputWord = $inputWord . '%';
  mysqli_stmt_bind_param($stmt, "s", $inputWord);
  mysqli_stmt_execute($stmt);

  $result = mysqli_stmt_get_result($stmt);

  if (mysqli_num_rows($result) > 0) {

    $words = [];

    while ($word = mysqli_fetch_array($result)) {
      $words[] = $word['word'];
    }

    return (json_encode($words));

  } else {
    return (0);
  }

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

  echo (suggestWords($inputWord));
}
