<?php
include('session.php'); 
include('db.php');     

header('Content-Type: application/json'); 

$response = [
    'status' => 'error',
    'message' => 'An unknown error occurred.'
];

// Security check
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'seller') {
    $response['message'] = 'Unauthorized. You must be logged in as a seller.';
    echo json_encode($response);
    exit();
}

// Check for the required fields
if (isset($_POST['title'], $_POST['type'], $_POST['weight'], $_POST['price'], $_POST['location'])) {
    
    $user_id = $_SESSION['user_id'];
    $scrap_name = $_POST['title'];       
    $scrap_type = $_POST['type'];       
    $weight_kg = (float)$_POST['weight']; 
    $unit_price = (float)$_POST['price'];  
    $address = $_POST['location'];     
    $descr = $_POST['description'] ?? ''; 
    $total_price = $weight_kg * $unit_price; 
    
    $photo_path_for_db = null;
    $upload_dir = '../uploads/'; 
    
    $is_update = isset($_POST['id']) && !empty($_POST['id']);
    
    // 1. HANDLE FILE UPLOAD (Only if a new file is sent)
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true); 
        }
        $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $file_name = uniqid('img_', true) . '.' . $file_extension;
        $photo_path_for_db = 'uploads/' . $file_name;
        $target_path = $upload_dir . $file_name; 

        if (!move_uploaded_file($_FILES['image']['tmp_name'], $target_path)) {
            $response['message'] = 'Failed to move uploaded file.';
            echo json_encode($response);
            exit();
        }
    }

    try {
        if ($is_update) {
            $listing_id = (int)$_POST['id'];
            
            // Build query based on whether a new photo was uploaded
            if ($photo_path_for_db) {
                $sql = "UPDATE scrap_requests SET 
                            scrap_name = ?, scrap_type = ?, weight_kg = ?, photo_url = ?, 
                            descr = ?, unit_price = ?, address = ?, total_price = ?
                        WHERE id = ? AND user_id = ?"; // Security check
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssdsdsddii", 
                    $scrap_name, $scrap_type, $weight_kg, $photo_path_for_db, 
                    $descr, $unit_price, $address, $total_price, 
                    $listing_id, $user_id
                );
            } else {
                $sql = "UPDATE scrap_requests SET 
                            scrap_name = ?, scrap_type = ?, weight_kg = ?, 
                            descr = ?, unit_price = ?, address = ?, total_price = ?
                        WHERE id = ? AND user_id = ?"; // Security check
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssdsdsdii", 
                    $scrap_name, $scrap_type, $weight_kg, 
                    $descr, $unit_price, $address, $total_price, 
                    $listing_id, $user_id
                );
            }
            $success_message = 'Listing updated successfully!';

        } else {
            $sql = "INSERT INTO scrap_requests 
                        (user_id, scrap_name, scrap_type, weight_kg, photo_url, descr, unit_price, address, total_price, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("issdsdsdd", 
                $user_id, $scrap_name, $scrap_type, $weight_kg, 
                $photo_path_for_db, $descr, $unit_price, $address, $total_price
            );
            $success_message = 'Listing posted successfully!';
        }

        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = $success_message;
        } else {
            $response['message'] = 'Database operation failed: ' . $stmt->error;
        }
        $stmt->close();
        
    } catch (Exception $e) {
        $response['message'] = 'An exception occurred: ' . $e->getMessage();
    }

} else {
    $response['message'] = 'Missing required fields.';
}

$conn->close();
echo json_encode($response); 
exit();
?>