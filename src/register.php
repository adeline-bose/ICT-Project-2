<?php
include 'db.php';

$fname = $_POST['fname'];
$lname = $_POST['lname'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users (fname, lname, email, phone, password) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $fname, $lname, $email, $phone, $password);

if ($stmt->execute()) {
    // SUCCESS: Redirect back to auth.html with a parameter
    header('Location: ../auth.html?view=login&status=success');
    exit(); // Always call exit() after a header redirect
} else {
    // FAILED: Handle the error
    // You could also redirect with an error message
    // header('Location: auth.html?error=registration_failed');
    echo "Error: " . $stmt->error;
}
?>