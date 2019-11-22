<?php
    $extra = $_POST["pass"];
	$contacts = $_POST["contacts"];
    $myfile = fopen("contacts.json", "wr") or die("Unable to open file to write!");
    $myfile = file_put_contents("contacts.json", $extra, FILE_APPEND);
    fclose($myfile);
    echo "Contact Created";
?>