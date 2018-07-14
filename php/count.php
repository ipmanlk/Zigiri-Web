<?php
$wordCount = 0;
require_once './config.php';

$sql = "SELECT word FROM en2sn";
if ($result = mysqli_query($link, $sql)) {
    // Return the number of rows in result set
    $wordCount += mysqli_num_rows($result);
    // Free result set
    mysqli_free_result($result);
}

$sql = "SELECT word FROM sn2en";
if ($result = mysqli_query($link, $sql)) {
    $wordCount += mysqli_num_rows($result);
    mysqli_free_result($result);
}

mysqli_close($link);

echo ($wordCount);
?>
