<?php
include('session.php');
include('db.php');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: /ICT-Project-2/auth.html?view=login&error=unauthorized");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['id'])) {
    $listing_id = (int)$_POST['id'];

    // Get the image path BEFORE deleting
    $sql_get_path = "SELECT photo_url FROM scrap_requests WHERE id = ?";
    $stmt_get = $conn->prepare($sql_get_path);
    $stmt_get->bind_param("i", $listing_id);
    $stmt_get->execute();
    $result = $stmt_get->get_result();
    
    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        $photo_path = $row['photo_url']; // e.g., 'uploads/img_123.jpg'

        //Delete the listing from the database
        $sql_delete = "DELETE FROM scrap_requests WHERE id = ?";
        $stmt_delete = $conn->prepare($sql_delete);
        $stmt_delete->bind_param("i", $listing_id);

        if ($stmt_delete->execute()) {
            // 4. Delete the actual file from the 'uploads' folder
            if (!empty($photo_path)) {
                // This script is in /src/, so we go '../' to get to the root
                $file_to_delete = '../' . $photo_path; 
                if (file_exists($file_to_delete)) {
                    unlink($file_to_delete);
                }
            }
            header("Location: /ICT-Project-2/src/dashboard-admin.php?status=deleted");
            exit();
        } else {
            header("Location: /ICT-Project-2/src/dashboard-admin.php?error=db_error");
            exit();
        }
    } else {
        header("Location: /ICT-Project-2/src/dashboard-admin.php?error=not_found");
        exit();
    }
}

// Redirect if accessed directly
header("Location: /ICT-Project-2/src/dashboard-admin.php");
exit();
?>