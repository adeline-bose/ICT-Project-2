<?php
// 1. --- FILE PATH FIX ---
// Since all files are in the same folder, we don't need '..'
include('session.php'); 
include('db.php');     

header('Content-Type: application/json'); 

$response = [
    'status' => 'error',
    'message' => 'An unknown error occurred.'
];

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'seller') {
    $response['message'] = 'Unauthorized. You must be logged in as a seller.';
    echo json_encode($response);
    exit();
}

if (isset($_POST['title'], $_POST['type'], $_POST['weight'], $_POST['price'], $_POST['location'])) {
    
    $user_id = $_SESSION['user_id'];
    $scrap_name = $_POST['title'];       
    $scrap_type = $_POST['type'];       
    $weight_kg = (float)$_POST['weight']; 
    $unit_price = (float)$_POST['price'];  
    $address = $_POST['location'];     
    $descr = $_POST['description'] ?? ''; 
    $total_price = $weight_kg * $unit_price; 
    
    $photo_path = null; 

    // 2. --- UPLOAD PATH FIX ---
    // The 'uploads' folder is also in the main directory
    $upload_dir = 'uploads/'; 
    
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true); 
        }

        $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        // The path we save to the DB is just 'uploads/filename.ext'
        $photo_path = $upload_dir . uniqid('img_', true) . '.' . $file_extension;
        
        // $photo_path is the same as $target_path in this flat structure
        if (!move_uploaded_file($_FILES['image']['tmp_name'], $photo_path)) {
            $response['message'] = 'Failed to move uploaded file.';
            echo json_encode($response);
            exit();
        }
    }

    try {
        $sql = "INSERT INTO scrap_requests 
                    (user_id, scrap_name, scrap_type, weight_kg, photo_url, descr, unit_price, address, total_price, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
        
        $stmt = $conn->prepare($sql);
        
        // Data types: issdsdsdd
        $stmt->bind_param("issdsdsdd", 
            $user_id, $scrap_name, $scrap_type, $weight_kg, 
            $photo_path, $descr, $unit_price, $address, $total_price
        );

        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Listing posted successfully!';
        } else {
            $response['message'] = 'Database insert failed: ' . $stmt->error;
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