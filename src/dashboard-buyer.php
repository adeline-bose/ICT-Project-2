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
            <div>
                    <h4 class="font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2 text-slate-400">
                        <li><a href="index.html" class="hover:text-white transition-colors">Home</a></li>
                        <li><a href="src/dashboard-buyer.php" class="hover:text-white transition-colors">Buy Scrap</a></li>
                        <li><a href="src/dashboard-seller.php" class="hover:text-white transition-colors">Sell Scrap</a></li>
                        <li><a href="src/logout.php" class="hover:text-red-300 transition-colors">Logout</a></li>
                    </ul>
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