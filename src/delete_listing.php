<?php
include('session.php'); 
include('db.php');    

header('Content-Type: application/json'); 

$response = [
    'status' => 'error',
    'message' => 'An unknown error occurred.'
];

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'seller') {
    $response['message'] = 'Unauthorized';
    echo json_encode($response);
    exit();
}

if (isset($_POST['id'])) {
    $listing_id = (int)$_POST['id'];
    $seller_id = (int)$_SESSION['user_id'];


    $sql_get_path = "SELECT photo_url FROM scrap_requests WHERE id = ? AND user_id = ?";
    $stmt_get = $conn->prepare($sql_get_path);
    $stmt_get->bind_param("ii", $listing_id, $seller_id);
    $stmt_get->execute();
    $result = $stmt_get->get_result();
    
    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        $photo_path = $row['photo_url']; 

        $sql_delete = "DELETE FROM scrap_requests WHERE id = ? AND user_id = ?";
        $stmt_delete = $conn->prepare($sql_delete);
        $stmt_delete->bind_param("ii", $listing_id, $seller_id);

        if ($stmt_delete->execute()) {
            if ($stmt_delete->affected_rows > 0) {
                $response['status'] = 'success';
                $response['message'] = 'Listing deleted.';

                if (!empty($photo_path)) {
                    $file_to_delete = '../' . $photo_path;
                    if (file_exists($file_to_delete)) {
                        unlink($file_to_delete);
                    }
                }
            } else {
                $response['message'] = 'Listing not found or you do not own it.';
            }
        } else {
            $response['message'] = 'Database delete failed: ' . $conn->error;
        }
        $stmt_delete->close();
    } else {
        $response['message'] = 'Listing not found or you do not own it.';
    }
    $stmt_get->close();
} else {
    $response['message'] = 'No listing ID provided.';
}

$conn->close();
echo json_encode($response);
exit();
?>