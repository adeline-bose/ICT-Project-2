<?php
include('session.php'); 
include('db.php');   


if (!isset($_SESSION['user_id'])) { 
    header("Location: /ICT-Project-2/auth.html?view=login&error=login_required");
    exit();
}
if ($_SESSION['role'] !== 'seller') {
    header("Location: /ICT-Project-2/auth.html?view=login&error=unauthorized");
    exit();
}


$user_id = $_SESSION['user_id'];
$listings = [];
$active_count = 0;
$sold_count = 0; 


$sql = "SELECT * FROM scrap_requests WHERE user_id = ? ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $listings[] = $row;
    if ($row['status'] === 'completed') {
        $sold_count++;
    } else if ($row['status'] !== 'cancelled') { // e.g., pending, accepted, picked_up
        $active_count++;
    }
}
$stmt->close();
$conn->close(); 


$status_colors = [
    'pending'   => 'bg-amber-500/20 text-amber-300',
    'accepted'  => 'bg-blue-500/20 text-blue-300',
    'picked_up' => 'bg-purple-500/20 text-purple-300',
    'completed' => 'bg-emerald-500/20 text-emerald-300',
    'cancelled' => 'bg-red-500/20 text-red-300'
];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="/ICT-Project-2/">
    <title>Seller Dashboard - ScrapSmart</title>
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
                    <a href="seller.html" class="nav-link active">Sell Scrap</a>
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
                  <a href="seller.html" class="nav-link mobile-nav active">Sell Scrap</a>
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
                <h1 class="text-3xl font-bold">Seller Dashboard</h1>
                <div class="flex items-center space-x-4">
                    <div class="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-lg font-medium">
                        <span id="activeCount"><?php echo $active_count; ?></span> Active Listings
                    </div>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <div class="card p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-semibold">List New Scrap</h2>
                        <div class="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-300">
                            <i class="fas fa-plus"></i>
                        </div>
                    </div>
                    
                    <form id="listingForm" class="space-y-6" action="src/submit_post.php" method="POST" enctype="multipart/form-data">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Item Title</label>
                            <input type="text" id="itemTitle" name="title" class="form-input" placeholder="e.g. Copper Wiring, Aluminum Sheets" required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Scrap Type</label>
                            <select id="scrapType" name="type" class="form-input" required>
                                <option value="" class="text-slate-400">Select type</option>
                                <option value="metal" class="text-white">Metal</option>
                                <option value="electronics" class="text-white">Electronics</option>
                                <option value="batteries" class="text-white">Batteries</option>
                                <option value="wires" class="text-white">Wires</option>
                                <option value="automotive" class="text-white">Automotive</option>
                                <option value="other" class="text-white">Other</option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-1">Weight (kg)</label>
                                <input type="number" id="itemWeight" name="weight" class="form-input" placeholder="0.00" step="0.01" required />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-1">Upload Photo</label>
                                <label class="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/30 transition-colors">
                                    <i class="fas fa-upload mr-2 text-slate-400"></i>
                                    <span class="text-sm text-slate-400" id="fileLabel">Choose file</span>
                                    <input type="file" id="itemImage" name="image" class="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Description</label>
                            <textarea id="itemDescription" name="description" rows="3" class="form-input" placeholder="Provide details about condition, purity, etc."></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-1">Price (per kg)</label>
                                <input type="number" name="price" class="form-input" placeholder="0.00" step="0.01" required />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-1">Location (Address)</label>
                                <input type="text" name="location" class="form-input" placeholder="Your pickup address" required />
                            </div>
                        </div>
                        <button type="submit" class="w-full btn-primary">
                            List Item
                        </button>
                    </form>
                </div>

                <div>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-semibold">Your Listings</h2>
                        <div class="text-slate-400 text-sm">
                            <span id="activeCountDisplay"><?php echo $active_count; ?></span> Active • 
                            <span id="soldCount"><?php echo $sold_count; ?></span> Sold
                        </div>
                    </div>
                    
                    <div id="sellerListings" class="space-y-4">
                        
                        <?php if (empty($listings)): ?>
                            <div class="card p-8 text-center">
                                <p class="text-slate-400">You haven't listed any items yet. Use the form to add one!</p>
                            </div>
                        <?php else: ?>
                            <?php foreach ($listings as $listing): ?>
                                <?php
                                    $status = htmlspecialchars($listing['status']);
                                    $color_class = $status_colors[$status] ?? 'bg-slate-700 text-slate-300';
                                ?>
                                <div class="card p-4 flex items-start">
                                    <div class="w-16 h-16 rounded-lg flex items-center justify-center text-2xl mr-4 bg-slate-700">
                                        <?php if (!empty($listing['photo_url'])): ?>
                                          <img src="<?php echo htmlspecialchars($listing['photo_url']); ?>" 
                                               alt="Scrap Image" 
                                               class="w-full h-full object-cover rounded-lg">
                                      <?php else: ?>
                                          <span>📦</span> 
                                      <?php endif; ?>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex justify-between">
                                            <h3 class="font-medium"><?php echo htmlspecialchars($listing['scrap_name']); ?></h3>
                                            <span class="px-2 py-1 text-xs rounded-full <?php echo $color_class; ?>">
                                                <?php echo ucwords(str_replace('_', ' ', $status)); ?>
                                            </span>
                                        </div>
                                        <p class="text-sm text-slate-400"><?php echo htmlspecialchars($listing['scrap_type']); ?> • <?php echo htmlspecialchars($listing['weight_kg']); ?>kg</p>
                                        <p class="text-sm font-medium text-emerald-400 mt-1">$<?php echo htmlspecialchars($listing['unit_price']); ?>/kg</p>
                                    </div>
                                    <div class="flex space-x-2 ml-4">
                                        <button class="edit-listing p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-lg transition-colors" data-id="<?php echo $listing['id']; ?>">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="delete-listing p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors" data-id="<?php echo $listing['id']; ?>">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                        
                    </div>
                </div>
            </div>

            </div>
    </main>

    <script src="js/main.js"></script>
    <script src="js/seller.js"></script> </body>
</html>