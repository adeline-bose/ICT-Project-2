<?php
include("session.php");
include("db.php");

if ($_SESSION['role'] !== 'admin') {
    header("Location: /login.html");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['id'])) {
    $id = $_POST['id'];
    $sql = "DELETE FROM scrap_requests WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
}

header("Location: dashboard-admin.php");
exit();
?>
