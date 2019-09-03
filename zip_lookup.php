<?php

//create Ziplookup object then call the lookup function
//require/ filter/ sanitize/ create object, then echo json_encode
//interact with class

require_once 'zip_lookup.class.php';

//filter and sanitize the zip code from the query string
if(filter_has_var(INPUT_GET, 'zip')) {
    $zip = filter_input(INPUT_GET, 'zip');
}

//create new ZipLookup object
$lookup = new ZipLookup();

//lookup the zipcode using the Ziplookup object and then encode it into json and return it to main.js
echo json_encode($lookup->lookup($zip));