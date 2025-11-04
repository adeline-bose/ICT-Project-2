<?php
include('session.php');
include('db.php');

if (!isset($_SESSION['user_id'])) { 
    header("Location: /ICT-Project-2/auth.html?view=login&error=login_required");
    exit();
}
if ($_SESSION['role'] !== 'buyer') {
    header("Location: /ICT-Project-2/auth.html?view=login&error=unauthorized");
    exit();
}

$listings = [];
$sql = "SELECT r.*, u.bname 
        FROM scrap_requests r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.status = 'pending' 
        ORDER BY r.created_at DESC";

$result = $conn->query($sql);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $listings[] = $row; // Add each item to the $listings array
    }
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="/ICT-Project-2/">
    <title>Buy Scrap - ScrapSmart</title>
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
                    <a href="src/dashboard-buyer.php" class="nav-link active">Buy Scrap</a>
                    <a href="src/dashboard-seller.php" class="nav-link">Sell Scrap</a>
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
                  <a href="src/dashboard-buyer.php" class="nav-link mobile-nav active">Buy Scrap</a>
                  <a href="src/dashboard-seller.php" class="nav-link mobile-nav">Sell Scrap</a>
                  <a href="src/logout.php" class="nav-link mobile-nav text-red-400">
                    <i class="fas fa-sign-out-alt mr-1"></i>Logout
                  </a>
                </div>
            </div>
        </div>
    </header>

    <main>
        <div class="max-w-7xl mx-auto px-4 py-8">
            <div class="text-center mb-12">
                <h1 class="text-4xl lg:text-5xl font-bold mb-4">
                    Premium <span class="text-gradient">Scrap Listings</span>
                </h1>
                <p class="text-xl text-slate-300 max-w-3xl mx-auto">
                    Browse verified scrap materials from trusted sellers
                </p>
            </div>

            <div class="mb-12">
                <div class="flex flex-col md:flex-row gap-4 mb-6">
                    <div class="relative flex-1">
                        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                        <input
                            type="text"
                            id="searchInput"
                            placeholder="Search by title or seller..."
                            class="form-input pl-10"
                        />
                    </div>
                    <button class="btn-primary md:w-auto" id="searchBtn">
                        <i class="fas fa-search mr-2"></i>
                        Search
                    </button>
                </div>

                <div class="flex overflow-x-auto pb-2 -mx-2 scrollbar-hide">
                    <button data-filter="all" class="filter-btn active-filter">
                        <i class="fas fa-filter mr-2"></i>
                        All Types
                    </button>
                    <button data-filter="metal" class="filter-btn">
                        <i class="fas fa-hammer mr-2"></i>
                        Metal
                    </button>
                    <button data-filter="electronics" class="filter-btn">
                        <i class="fas fa-microchip mr-2"></i>
                        Electronics
                    </button>
                    <button data-filter="batteries" class="filter-btn">
                        <i class="fas fa-battery-full mr-2"></i>
                        Batteries
                    </button>
                    <button data-filter="wires" class="filter-btn">
                        <i class="fas fa-bolt mr-2"></i>
                        Wires
                    </button>
                    <button data-filter="automotive" class="filter-btn">
                        <i class="fas fa-car mr-2"></i>
                        Automotive
                    </button>
                    <button data-filter="other" class="filter-btn">
                        <i class="fas fa-box mr-2"></i>
                        Other
                    </button>
                </div>
            </div>

            <div id="listingsContainer" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                </div>

            <div class="mt-12 flex justify-center">
                <div id="pagination" class="inline-flex rounded-md shadow-sm">
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
    
    <script>
        window.PHP_LISTINGS = <?php echo json_encode($listings); ?>;
    </script>
    
    <script src="js/listings.js"></script>
</body>
</html>