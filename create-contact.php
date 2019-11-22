<?php
    $extra = $_GET["FirstName"};
	$extra2 = $_GET["LastName"};
	$extra3 = $_GET["Preferred"};
	$extra4 = $_GET["Email"};
	$extra5 = $_GET["City"};
	$extra6 = $_GET["Zip"};
	$hold = "{firstName: " + $extra + ", lastName: " + $extra2 + ", preferredName: " + $extra3 + ", email: " + $extra4 + ", city: " + $extra5 + ", zip: " $extra6 + "}"; 
	echo $hold;
    $myfile = fopen("contacts.json", "wr") or die("Unable to open file to write!");
    $myfile = file_put_contents("contacts.json", $hold, FILE_APPEND);
    fclose($myfile);
?>