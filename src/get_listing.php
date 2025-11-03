<?php
include('session.php');
include('db.php');

header('Content-Type: application/json');

$response = ['status' => 'error', 'message' => 'Listing not found.'];

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'seller') {
    $response['message'] = 'Unauthorized';
    echo json_encode($response);
    exit();
}


if (isset($_GET['id'])) {
    $listing_id = (int)$_GET['id'];
    $seller_id = (int)$_SESSION['user_id'];

    // Select the listing, but ONLY if the logged-in seller owns it
    $sql = "SELECT * FROM scrap_requests WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $listing_id, $seller_id);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows === 1) {
            $listing = $result->fetch_assoc();
            // Send the listing data back as JSON
            echo json_encode(['status' => 'success', 'data' => $listing]);
            exit();
        } else {
            $response['message'] = 'Listing not found or you do not own it.';
        }
    } else {
        $response['message'] = 'Database query failed.';
    }
    $stmt->close();
} else {
    $response['message'] = 'No ID provided.';
}

$conn->close();
echo json_encode($response);
exit();
?>