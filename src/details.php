<?php
include('session.php');
include('db.php');

if (!isset($_SESSION['user_id'])) { 
    header("Location: /ICT-Project-2/auth.html?view=login&error=login_required");
    exit();
}

//Get the Listing ID from the URL
if (!isset($_GET['id']) || empty($_GET['id'])) {
    die("Error: No listing ID provided.");
}
$listing_id = (int)$_GET['id'];

// Fetch the listing AND the seller's info
// We only show items that are 'pending' (for sale)
$sql = "SELECT r.scrap_name, r.scrap_type, r.weight_kg, r.unit_price, r.address, r.descr, r.photo_url, r.created_at,
               u.bname, u.phone, u.email 
        FROM scrap_requests r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.id = ? AND r.status = 'pending'";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $listing_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Error: Listing not found or is no longer available.");
}

$listing = $result->fetch_assoc();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="/ICT-Project-2/">
    <title><?php echo htmlspecialchars($listing['scrap_name']); ?> - ScrapSmart</title>
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

            <a href="src/dashboard-buyer.php" class="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-6">
                <i class="fas fa-arrow-left mr-2"></i>
                Back to all listings
            </a>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                
                <div class="md:col-span-1">
                    <div class="card p-0 overflow-hidden">
                        <div class="h-80 w-full bg-slate-700 flex items-center justify-center">
                            <?php if (!empty($listing['photo_url'])): ?>
                                <img src="<?php echo htmlspecialchars($listing['photo_url']); ?>" alt="<?php echo htmlspecialchars($listing['scrap_name']); ?>" class="w-full h-full object-cover">
                            <?php else: ?>
                                <img src="uploads/logo.png" class="w-full h-full object-cover">
                            <?php endif; ?>
                        </div>
                    </div>
                </div>

                <div class="md:col-span-2 space-y-6">
                    
                    <div class="card p-6">
                        <h1 class="text-3xl font-bold mb-2"><?php echo htmlspecialchars($listing['scrap_name']); ?></h1>
                        <p class="text-slate-400 text-lg mb-4">
                            Sold by <strong class="text-slate-300"><?php echo htmlspecialchars($listing['bname']); ?></strong>
                        </p>
                        <p class="text-4xl font-bold text-emerald-400">
                            $<?php echo htmlspecialchars($listing['unit_price']); ?>
                            <span class="text-2xl font-normal text-slate-400">/kg</span>
                        </p>
                    </div>

                    <div class="card p-6">
                        <h2 class="text-xl font-semibold mb-4">Item Details</h2>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-slate-400">Type:</span>
                                <span class__("font-medium capitalize"><?php echo htmlspecialchars($listing['scrap_type']); ?></span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-400">Available Weight:</span>
                                <span class="font-medium"><?php echo htmlspecialchars($listing['weight_kg']); ?> kg</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-400">Location:</span>
                                <span class="font-medium"><?php echo htmlspecialchars($listing['address']); ?></span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-400">Posted:</span>
                                <span class="font-medium"><?php echo date('d M Y', strtotime($listing['created_at'])); ?></span>
                            </div>
                            <?php if (!empty($listing['descr'])): ?>
                                <div>
                                    <span class="text-slate-400">Description:</span>
                                    <p class="text-slate-300 mt-1"><?php echo htmlspecialchars($listing['descr']); ?></p>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="card p-6 bg-emerald-900/30 border border-emerald-700/50">
                        <h2 class="text-xl font-semibold mb-4">Contact Seller</h2>
                        <div class="space-y-3 mb-4">
                            <div class="flex items-center">
                                <i class="fas fa-phone w-5 mr-3 text-emerald-400"></i>
                                <span class="text-slate-300"><?php echo htmlspecialchars($listing['phone']); ?></span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-envelope w-5 mr-3 text-emerald-400"></i>
                                <span class="text-slate-300"><?php echo htmlspecialchars($listing['email']); ?></span>
                            </div>
                        </div>
                        <a href="mailto:<?php echo htmlspecialchars($listing['email']); ?>?subject=Inquiry about <?php echo htmlspecialchars($listing['scrap_name']); ?> (ID: <?php echo $listing_id; ?>)" 
                           class="btn-primary w-full text-center">
                            <i class="fas fa-paper-plane mr-2"></i>Email Seller
                        </a>
                    </div>

                </div>
            </div>
        </div>
    </main>

    <footer class="bg-slate-900/80 border-t border-slate-700/50 mt-16">
        <div class="max-w-7xl mx-auto px-4 py-8">
            </div>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>