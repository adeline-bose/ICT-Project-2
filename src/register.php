<?php
// Include the database connection file
include 'db.php';

// Retrieve POST data from the form submission
$fname = $_POST['fname'];  // First name
$lname = $_POST['lname'];  // Last name
$email = $_POST['email'];  // Email address
$phone = $_POST['phone'];  // Phone number
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);  // Hash the password using bcrypt
$bname = $_POST['bname'];  // Business name (if applicable)
$role = $_POST['role'];  // Role ('buyer' or 'seller')

// Validate the role: If it's not 'buyer' or 'seller', default to 'buyer'
if ($role !== 'buyer' && $role !== 'seller') {
    $role = 'buyer';  // Default to 'buyer' if an invalid role is passed
}

// Prepare the SQL query to insert a new user into the database
$sql = "INSERT INTO users (fname, lname, email, phone, password, bname, role) VALUES (?, ?, ?, ?, ?, ?, ?)";

// Prepare the statement to avoid SQL injection
$stmt = $conn->prepare($sql);

// Bind the parameters to the SQL query
// "sssssss" means seven string parameters (for fname, lname, email, phone, password, bname, and role)
$stmt->bind_param("sssssss", $fname, $lname, $email, $phone, $password, $bname, $role);

// Execute the query and check if it was successful
if ($stmt->execute()) {
    // SUCCESS: Redirect the user back to the login page with a success parameter
    header('Location: ../auth.html?view=login&status=success');
    exit();  // Exit the script to prevent further code execution after the redirect
} else {
    // FAILED: If the query failed, handle the error
    // Optionally, you could redirect the user with an error message (e.g., registration failed)
    // header('Location: auth.html?error=registration_failed');
    echo "Error: " . $stmt->error;  // Output the error message if query fails
}
?>
