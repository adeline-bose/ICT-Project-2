<?php
include('session.php');
include('db.php');

$user_id = $_SESSION['user_id'];

$sql = "SELECT * FROM scrap_requests WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="/ICT-Project-2/">
    <title>Seller Dashboard - ScrapSmart</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/components.css">
</head>
<body class="min-h-screen gradient-bg">
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="mb-0">Seller Dashboard</h2>
    <div>
        <a href="sell.html" class="btn btn-success btn-sm me-2">Sell Scrap</a>
        <a href="logout.php" class="btn btn-danger btn-sm">Logout</a>
    </div>
</div>

  <div class="container mt-5">
    <h2 class="mb-4">My Scrap Requests</h2>
    <table class="table table-dark table-bordered">
      <thead>
        <tr>
          <th>Scrap Type</th>
          <th>Address</th>
          <th>Pickup Time</th>
          <th>Price</th>
          <th>Weight (kg)</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
          <td><?= htmlspecialchars($row['scrap_type']) ?></td>
          <td><?= htmlspecialchars($row['address']) ?></td>
          <td><?= htmlspecialchars($row['pickup_time']) ?></td>
          <td><?= htmlspecialchars($row['unit_price']) ?></td>
          <td><?= htmlspecialchars($row['weight_kg']) ?></td>
          <td><?= htmlspecialchars($row['status']) ?></td>
        </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  </div>
</body>
</html>
