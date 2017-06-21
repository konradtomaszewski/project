<?php
require 'connect.php';

$connect = connect();

// Add the new data to the database.
$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata))
{
    $request  = json_decode($postdata);
    
    $newName  = preg_replace('/[^a-zA-Z ]/','',$request->newName);
    $newPhone = preg_replace('/[^0-9 ]/','',$request->newPhone);
    
    if($newName  == '' || $newPhone == '') return;
    
    $newName  = mysqli_real_escape_string($connect,$newName);
    $newPhone = mysqli_real_escape_string($connect,$newPhone);

    $sql = "INSERT INTO `people`(`name`, `phone`) VALUES ('$newName','$newPhone')";

    mysqli_query($connect,$sql);
    
    
    // select
    $sql = "SELECT COUNT(id) AS c FROM people";

    if($result = mysqli_query($connect,$sql))
    {
       
       $row = mysqli_fetch_assoc($result);
       $count = $row['c'];
       
       if($count > 10)
       {
           $sql = "SELECT id FROM people ORDER BY id ASC LIMIT 1";
           $result = mysqli_query($connect,$sql);
           $row = mysqli_fetch_assoc($result);
           $id  = $row['id'];
           
           $sql = "DELETE FROM people WHERE id = $id LIMIT 1";
           $result = mysqli_query($connect,$sql);
       }
    }
}
exit;