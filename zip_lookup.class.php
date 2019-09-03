<?php

/*
 * Author: Maria Leichty
 * Date: 1/29/2017
 * Name: zip_lookup.class.php
 * Description: this class defines parameters for connecting to the database.
 *    The only public interface is the method named lookup that filters the zipcode table with a zip code. 
 *    It returns an array containing geographical information if the zip code is valid; an empty array is
 *    returned if the zip code is invalid.
 */

class ZipLookup {

    //define the database connection object
    private $objDBConnection;

    //the constructor. It connects to the MySQL server and select the database for use.
    public function __construct() {
        $host = 'localhost';
        $login = 'phpuser';
        $password = "phpuser";
        $database = "zipcode_db";
        $port = 3306;
        //why is there an @ symbol? does that connect to database?
        $this->objDBConnection = @new mysqli($host, $login, $password, $database, $port);
        if ($this->objDBConnection->connect_error) {
            $errno = $this->objDBConnection->connect_errno;
            $errmsg = $this->objDBConnection->connect_error;
            die("Connecting database failed: ($errno) $errmsg <br/>\n");
        }
    }

    /* This method accepts a zip code as the parameter. It filters the zipcode table with the zip code. 
     *  It returns an array containing geographical information if the zip code is valid; an empty array 
     * is returned if the zip code is invalid.
     * 
     */

    public function lookup($zipcode) {
        $result_array = array();
        $sql = "SELECT * FROM zipcode WHERE zip='$zipcode'";

        //execute the query
        $result = $this->objDBConnection->query($sql);

        if ($result->num_rows) {
            $result_array = $result->fetch_assoc();
        } else {
            $result_array = ["error" => "Zipcode not found."];
        }
        return $result_array;
    }

}
