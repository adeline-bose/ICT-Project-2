<?php
include('session.php');
include('db.php');

if ($_SESSION['role'] !== 'admin') {
    header("Location: auth.html");
    exit();
}

$sql = "SELECT r.*, u.fname FROM scrap_requests r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="/ICT-Project-2/">
    <title>Login/Signup - ScrapSmart</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/components.css">
    <style>
        /* Hide all auth views by default */
        .auth-view {
            display: none;
        }
        
        /* Only show the active view */
        .auth-view.active-view {
            display: block;
        }
        
        /* Smooth transitions */
        .auth-view {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="min-h-screen gradient-bg">
    <!-- Navigation Header -->
    <header class="header">
        <div class="max-w-7xl mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-recycle text-emerald-400 text-xl"></i>
                    <a href="index.html" class="text-xl font-bold">ScrapSmart</a>
                </div>
                <nav class="hidden md:flex space-x-6">
                    <a href="index.html" class="nav-link">Home</a>
                    <a href="listings.html" class="nav-link">Buy Scrap</a>
                    <a href="seller.html" class="nav-link">Sell Scrap</a>
                    <a href="auth.html" class="nav-link active">Login/Signup</a>
                </nav>
                <button class="md:hidden text-slate-300" id="mobileMenuBtn">
                    <i class="fas fa-bars text-xl"></i>
                </button>
            </div>
            <!-- Mobile Menu -->
            <div id="mobileMenu" class="md:hidden mt-4 hidden">
                <div class="flex flex-col space-y-2">
                    <a href="index.html" class="nav-link mobile-nav">Home</a>
                    <a href="listings.html" class="nav-link mobile-nav">Buy Scrap</a>
                    <a href="seller.html" class="nav-link mobile-nav">Sell Scrap</a>
                    <a href="auth.html" class="nav-link mobile-nav active">Login/Signup</a>
                </div>
            </div>
        </div>
    </header>

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
          <td><?= htmlspecialchars($row['fname']) ?></td>
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

      <footer class="bg-slate-900/80 border-t border-slate-700/50 mt-16">
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center space-x-2 mb-4">
                        <i class="fas fa-recycle text-emerald-400 text-xl"></i>
                        <h3 class="text-xl font-bold">ScrapSmart</h3>
                    </div>
                    <p class="text-slate-400">
                        Connecting scrap sellers with buyers in a seamless, transparent marketplace.
                    </p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-slate-400">
                        <li><a href="index.html" class="hover:text-white transition-colors">Home</a></li>
                        <li><a href="listings.html" class="hover:text-white transition-colors">Buy Scrap</a></li>
                        <li><a href="seller.html" class="hover:text-white transition-colors">Sell Scrap</a></li>
                        <li><a href="auth.html" class="hover:text-white transition-colors">Login/Signup</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Categories</h4>
                    <ul class="space-y-2 text-slate-400">
                        <li><a href="listings.html?category=metal" class="hover:text-white transition-colors">Metals</a></li>
                        <li><a href="listings.html?category=electronics" class="hover:text-white transition-colors">Electronics</a></li>
                        <li><a href="listings.html?category=batteries" class="hover:text-white transition-colors">Batteries</a></li>
                        <li><a href="listings.html?category=automotive" class="hover:text-white transition-colors">Automotive</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Contact Us</h4>
                    <ul class="space-y-2 text-slate-400">
                        <li class="flex items-center">
                            <i class="fas fa-envelope mr-2"></i>
                            info@scrapsmart.com
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-phone mr-2"></i>
                            +1 (555) 123-4567
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-map-marker-alt mr-2"></i>
                            Mumbai, India
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-slate-700/50 mt-8 pt-6 text-center text-slate-400">
                <p>&copy; 2024 ScrapSmart. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
