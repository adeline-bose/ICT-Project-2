<?php
include('session.php');
include('db.php');

if ($_SESSION['role'] !== 'admin') {
    header("Location: login.html");
    exit();
}

$sql = "SELECT r.*, u.name FROM scrap_requests r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - ScrapSmart</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/components.css">
</head>
<body class="min-h-screen gradient-bg">
  <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Admin Dashboard</h2>
      <a href="logout.php" class="btn btn-danger btn-sm">Logout</a>
    </div>
  <div class="container mt-5">
    <h2 class="mb-4">All Scrap Requests</h2>
    <table class="table table-dark table-bordered">
      <thead>
        <tr>
          <th>User</th>
          <th>Scrap Type</th>
          <th>Address</th>
          <th>Pickup Time</th>
          <th>Price</th>
          <th>Weight (kg)</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
          <td><?= htmlspecialchars($row['name']) ?></td>
          <td><?= htmlspecialchars($row['scrap_type']) ?></td>
          <td><?= htmlspecialchars($row['address']) ?></td>
          <td><?= htmlspecialchars($row['pickup_time']) ?></td>
          <td><?= htmlspecialchars($row['unit_price']) ?></td>
          <td><?= htmlspecialchars($row['weight_kg']) ?></td>
          <td><?= htmlspecialchars($row['status']) ?></td>
          <td>
            <form method="POST" action="update_status.php" class="d-flex gap-2">
              <input type="hidden" name="id" value="<?= (int)$row['id'] ?>">
              <select name="status" class="form-select form-select-sm bg-dark text-white" required>
                <option value="pending"   <?= $row['status']==='pending'   ? 'selected' : '' ?>>Pending</option>
                <option value="accepted"  <?= $row['status']==='accepted'  ? 'selected' : '' ?>>Accepted</option>
                <option value="picked_up" <?= $row['status']==='picked_up' ? 'selected' : '' ?>>Picked Up</option>
                <option value="completed" <?= $row['status']==='completed' ? 'selected' : '' ?>>Completed</option>
              </select>
              <button class="btn btn-success btn-sm">Update</button>
            </form>       
            <form method="POST" action="delete_request.php" style="display:inline-block;">
              <input type="hidden" name="id" value="<?= $row['id'] ?>">
              <button class="btn btn-danger btn-sm mt-1" onclick="return confirm('Delete this request?')">Delete</button>
            </form>
          </td>
        </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  </div>
</body>
</html>
