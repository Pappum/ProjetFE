<?php

	try {

	    $bdd = new PDO('mysql:host=localhost;dbname=memory', 'root', 'root');

	    $result = $bdd->query('SELECT DISTINCT score FROM score ORDER BY score DESC LIMIT 10');

	    $score = array();

	    while($data = $result->fetch(PDO::FETCH_OBJ)){
	    	array_push($score, $data->score);
	    }

	    echo json_encode($score);
    
	}
	catch (PDOException $e) {
	    print "Erreur !: " . $e->getMessage() . "<br/>";
	    die();
	}



?>