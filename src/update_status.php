<?php
include 'session.php';
include 'db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.html");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: dashboard-admin.php");
    exit;
}

$id     = isset($_POST['id']) ? (int)$_POST['id'] : 0;
$status = isset($_POST['status']) ? trim($_POST['status']) : '';

if ($id <= 0) {
    header("Location: dashboard-admin.php?err=invalid_id");
    exit;
}

if ($status === 'delete') {
    // Delete the request
    $sql  = "DELETE FROM scrap_requests WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        header("Location: dashboard-admin.php?err=prep");
        exit;
    }
    $stmt->bind_param("i", $id);
    $ok = $stmt->execute();
    header("Location: dashboard-admin.php?" . ($ok ? "ok=deleted" : "err=delete_fail"));
    exit;
}

// Must match ENUM exactly (lowercase)
$allowed = ['pending','accepted','picked_up','completed'];
if (!in_array($status, $allowed, true)) {
    header("Location: dashboard-admin.php?err=bad_status");
    exit;
}

// Update status
$sql  = "UPDATE scrap_requests SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    header("Location: dashboard-admin.php?err=prep");
    exit;
}
$stmt->bind_param("si", $status, $id);
$ok = $stmt->execute();

header("Location: dashboard-admin.php?" . ($ok ? "ok=updated" : "err=update_fail"));
exit;
