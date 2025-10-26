<?php
include 'session.php';
include 'db.php';

$user_id = $_SESSION['user_id'];
$scrap_name = $_POST['scrap_name'];
$scrap_type = $_POST['scrap_type'];
$weight_kg = $_POST['weight_kg'];
$descr = $_POST['descr'];
$unit_price = $_POST['unit_price'];
$address = $_POST['address'];
$total_price = ($unit_price*$weight_kg);

$photo_path = '';
if (isset($_FILES['photo'])) {
    $target_dir = "uploads/";
    $photo_path = $target_dir . basename($_FILES["photo"]["name"]);
    move_uploaded_file($_FILES["photo"]["tmp_name"], $photo_path);
}

$sql = "INSERT INTO scrap_requests (user_id, scrap_name, scrap_type, weight_kg, photo_url, descr, unit_price, address, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("issssssss", $user_id, $scrap_name, $scrap_type, $weight_kg, $photo_path, $desc, $unit_price, $address, $total_price);

if ($stmt->execute()) {
    // Redirect to user dashboard after successful submission
    header("Location: dashboard-seller.php");
    exit();
} else {
    echo "Error: " . $conn->error;
}
?>