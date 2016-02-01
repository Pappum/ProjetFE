<?php

	try {

		$score = $_GET['score'];

	    $bdd = new PDO('mysql:host=localhost;dbname=memory', 'root', 'root');

	    $req = $bdd->prepare('INSERT INTO score(score) VALUES(:score)');
		
		$req->execute(array(
			'score' => $score
		));


	}
	catch (PDOException $e) {
	    print "Erreur !: " . $e->getMessage() . "<br/>";
	    die();
	}



?>