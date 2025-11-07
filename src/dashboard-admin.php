<?php
include('session.php');
include('db.php');


if (!isset($_SESSION['user_id'])) { 
    // Not logged in.
    header("Location: /ICT-Project-2/auth.html?view=login&error=login_required");
    exit();
}
if ($_SESSION['role'] !== 'admin') {
    // Logged in, but wrong role.
    header("Location: /ICT-Project-2/auth.html?view=login&error=unauthorized");
    exit();
}


$sql = "SELECT r.*, u.bname FROM scrap_requests r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC";
$result = $conn->query($sql);

// Helper array for status badges (Tailwind classes)
$status_colors = [
    'pending' => 'bg-amber-500/20 text-amber-300',
    'accepted' => 'bg-blue-500/20 text-blue-300',
    'picked_up' => 'bg-purple-500/20 text-purple-300',
    'completed' => 'bg-emerald-500/20 text-emerald-300',
    'cancelled' => 'bg-red-500/20 text-red-300' // Added a new one just in case
];

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="/ICT-Project-2/">
    <title>Admin Dashboard - ScrapSmart</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/components.css">
    </head>
<body class="min-h-screen gradient-bg">
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
                    <a href="src/logout.php" class="nav-link text-red-400 hover:text-red-300">
                        <i class="fas fa-sign-out-alt mr-1"></i>Logout
                    </a>
                </nav>
                <button class="md:hidden text-slate-300" id="mobileMenuBtn">
                    <i class="fas fa-bars text-xl"></i>
                </button>
            </div>
            <div id="mobileMenu" class="md:hidden mt-4 hidden">
                <div class="flex flex-col space-y-2">
                    <a href="index.html" class="nav-link mobile-nav">Home</a>
                    <a href="listings.html" class="nav-link mobile-nav">Buy Scrap</a>
                    <a href="seller.html" class="nav-link mobile-nav">Sell Scrap</a>
                    <a href="src/logout.php" class="nav-link mobile-nav text-red-400">
                        <i class="fas fa-sign-out-alt mr-1"></i>Logout
                    </a>
                </div>
            </div>
        </div>
    </header>

    <main>
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold">Admin Dashboard</h1>
                <span class="text-slate-400">Manage all user requests</span>
            </div>

            <h2 class="text-2xl font-bold mb-6">All Scrap Requests</h2>

            <div class="card p-0 md:p-0">
                <div class="space-y-4 md:space-y-0">
                    <?php if ($result->num_rows > 0): ?>
                        <?php while ($row = $result->fetch_assoc()): ?>
                            <div class="p-4 md:p-6 flex flex-col md:flex-row items-start border-b border-slate-700/50 last:border-b-0">
                                
                                    <div class="flex-1">
                                        <div class="flex items-start justify-between mb-2">
    
                                            <div class="flex items-baseline"> 
                                                <h3 class="text-lg font-semibold text-emerald-400">
                                                    <?php echo htmlspecialchars($row['scrap_name']); ?>
                                                </h3>
                                                <span class="text-xs text-slate-500 ml-2">(ID: <?php echo $row['id']; ?>)</span>
                                            </div>

                                            <?php
                                                $status = htmlspecialchars($row['status']);
                                                $color_class = $status_colors[$status] ?? 'bg-slate-700 text-slate-300';
                                            ?>
                                            <span class="px-2 py-1 text-xs font-medium rounded-full <?php echo $color_class; ?> flex-shrink-0">
                                                <?php echo ucwords(str_replace('_', ' ', $status)); ?>
                                            </span>
                                        </div>

                                        <p class="text-sm text-slate-400 mb-4">
                                            <?php echo htmlspecialchars(ucfirst($row['scrap_type'])); ?> • <?php echo htmlspecialchars($row['weight_kg']); ?>kg
                                        </p>

                                    <div class="text-sm text-slate-400 mb-4">
                                        <i class="fas fa-user mr-2 w-4 text-center"></i>
                                        Requested by <strong><?php echo htmlspecialchars($row['bname']); ?></strong>
                                    </div>
                                    
                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                                        <div>
                                            <span class="text-slate-500">Price:</span>
                                            <strong class="text-slate-200">$<?php echo htmlspecialchars($row['unit_price']); ?> /kg</strong>
                                        </div>
                                        <div class="col-span-2">
                                            <span class="text-slate-500">Date Created:</span>
                                            <strong class="text-slate-200"><?php echo htmlspecialchars($row['created_at']); ?></strong>
                                        </div>
                                        <div class="col-span-2 md:col-span-4">
                                            <span class="text-slate-500">Address:</span>
                                            <strong class="text-slate-200"><?php echo htmlspecialchars($row['address']); ?></strong>
                                        </div>
                                    </div>
                                </div>

                                <div class="w-full md:w-64 md:ml-6 mt-6 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-700/50 md:pl-6">
                                    <form method="POST" action="src/update_status.php" class="flex flex-col space-y-3">
                                        <input type="hidden" name="id" value="<?php echo (int)$row['id']; ?>">
                                        <select name="status" class="form-input" required>
                                            <option value="pending"   <?php echo $row['status']==='pending'   ? 'selected' : ''; ?>>Pending</option>
                                            <option value="accepted"  <?php echo $row['status']==='accepted'  ? 'selected' : ''; ?>>Accepted</option>
                                            <option value="picked_up" <?php echo $row['status']==='picked_up' ? 'selected' : ''; ?>>Picked Up</option>
                                            <option value="completed" <?php echo $row['status']==='completed' ? 'selected' : ''; ?>>Completed</option>
                                        </select>
                                        <button type="submit" class="btn-primary w-full">Update Status</button>
                                    </form>
                                    
                                    <form method="POST" action="src/delete_request.php" class="mt-3">
                                        <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                                        <button type="submit" class="w-full btn-secondary text-red-400 hover:bg-red-500/10 hover:text-red-300" onclick="return confirm('Are you sure you want to delete this request?')">
                                            <i class="fas fa-trash-alt mr-2"></i>Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <?php endwhile; ?>
                    <?php else: ?>
                        <div class="p-6 text-center text-slate-400">
                            <i class="fas fa-box-open text-4xl mb-4"></i>
                            <p>No scrap requests found.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </main>

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
                        <li><a href="src/dashboard-buyer.php" class="hover:text-white transition-colors">Buy Scrap</a></li>
                        <li><a href="src/dashboard-seller.php" class="hover:text-white transition-colors">Sell Scrap</a></li>
                        <li><a href="src/logout.php" class="hover:text-red-300 transition-colors">Logout</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Categories</h4>
                    <ul class="space-y-2 text-slate-400">
                        <li><a href="src/dashboard-buyer.php?category=metal" class="hover:text-white transition-colors">Metals</a></li>
                        <li><a href="src/dashboard-buyer.php?category=electronics" class="hover:text-white transition-colors">Electronics</a></li>
                        <li><a href="src/dashboard-buyer.php?category=batteries" class="hover:text-white transition-colors">Batteries</a></li>
                        <li><a href="src/dashboard-buyer.php?category=automotive" class="hover:text-white transition-colors">Automotive</a></li>
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
                            +975 17518738
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-map-marker-alt mr-2"></i>
                            Thimphu, Bhutan
                        </li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-slate-700/50 mt-8 pt-6 text-center text-slate-400">
                <p>&copy; 2024 ScrapSmart. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>