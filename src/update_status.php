<?php
include 'session.php';
include 'db.php';

// Security check
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: /ICT-Project-2/auth.html?view=login&error=unauthorized");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /ICT-Project-2/src/dashboard-admin.php");
    exit;
}

$id     = isset($_POST['id']) ? (int)$_POST['id'] : 0;
$status = isset($_POST['status']) ? trim($_POST['status']) : '';

if ($id <= 0) {
    header("Location: /ICT-Project-2/src/dashboard-admin.php?error=invalid_id");
    exit;
}

// Validate the status
$allowed = ['pending','accepted','picked_up','completed', 'cancelled'];
if (!in_array($status, $allowed, true)) {
    header("Location: /ICT-Project-2/src/dashboard-admin.php?error=bad_status");
    exit;
}

// Update status
$sql  = "UPDATE scrap_requests SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    header("Location: /ICT-Project-2/src/dashboard-admin.php?error=prep_failed");
    exit;
}
$stmt->bind_param("si", $status, $id);
$ok = $stmt->execute();

// Redirect back to the admin dashboard with a result message
header("Location: /ICT-Project-2/src/dashboard-admin.php?" . ($ok ? "status=updated" : "error=update_fail"));
exit;
?>