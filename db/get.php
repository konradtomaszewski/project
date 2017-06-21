<?php
require 'connect.php';

$connect = connect();

// Get the data
$people = array();
$sql = "SELECT id, name, phone FROM people";

if($result = mysqli_query($connect,$sql))
{
  $count = mysqli_num_rows($result);

  while($row = mysqli_fetch_assoc($result))
  {
      $people[$row['name']]['id']    = $row['id'];
      $people[$row['name']]['name']  = $row['name'];
      $people[$row['name']]['phone'] = $row['phone'];
  }
}

$json = json_encode($people);
echo $json;
exit;