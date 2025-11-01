<?php
session_start();
include("db.php");

// Set the content type to JSON
header('Content-Type: application/json');

// Create an array to hold our response
$response = [
    'status' => 'error',
    'message' => 'An unknown error occurred.'
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows === 1) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            // --- SUCCESS ---
            $_SESSION["user_id"] = $row["id"];
            $_SESSION["name"] = $row["name"];
            $_SESSION["role"] = $row["role"];

            $response['status'] = 'success';
            $response['role'] = $row['role'];
            unset($response['message']); // No error message needed

        } else {
            // --- FAILED: Incorrect Password ---
            $response['message'] = 'Incorrect email or password.';
        }
    } else {
        // --- FAILED: User Not Found ---
        // Note: For security, we give the same message as a wrong password.
        // This prevents "user enumeration" attacks.
        $response['message'] = 'Incorrect email or password.';
    }
} else {
    $response['message'] = 'Invalid request method.';
}

// --- Finally, echo the JSON response ---
echo json_encode($response);
exit();
?>