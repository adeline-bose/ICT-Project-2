<?php
include('session.php');
include('db.php');   

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    // Redirect to login if not admin
    header("Location: /ICT-Project-2/auth.html?view=login&error=unauthorized");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['id'], $_POST['status'])) {
    
    $listing_id = (int)$_POST['id'];
    $new_status = $_POST['status'];

    $allowed_statuses = ['pending', 'accepted', 'picked_up', 'completed', 'cancelled'];
    
    if (in_array($new_status, $allowed_statuses)) {
        
        // 4. Update the database
        $sql = "UPDATE scrap_requests SET status = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        // An admin can update any listing, so no user_id check is needed
        $stmt->bind_param("si", $new_status, $listing_id);
        
        if ($stmt->execute()) {
            // Success! Redirect back to the admin dashboard (full path)
            header("Location: /ICT-Project-2/src/dashboard-admin.php?status=updated");
            exit();
        } else {
            // Handle DB error
            header("Location: /ICT-Project-2/src/dashboard-admin.php?error=db_error");
            exit();
        }
    } else {
        // Handle invalid status error
        header("Location: /ICT-Project-2/src/dashboard-admin.php?error=invalid_status");
        exit();
    }
}

// Redirect if accessed directly or without correct POST data
header("Location: /ICT-Project-2/src/dashboard-admin.php");
exit();
?>