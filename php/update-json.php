<?php

$str_json = file_get_contents('php://input');
print_r($str_json);

file_put_contents('../json/data.json', $str_json);