// Seller dashboard functionality
class SellerDashboard {
    constructor() {
        this.listings = [];
        this.init();
    }

    init() {
        this.loadListings();
        this.setupEventListeners();
        this.renderListings();
    }

    loadListings() {
        // Sample data - in a real app, this would come from an API
        this.listings = [
            {
                id: 1,
                title: "Copper Wiring",
                type: "metal",
                weight: "25kg",
                price: "$8.50/kg",
                status: "Active",
                image: "🔌",
                gradient: "from-orange-500 to-amber-600"
            },
            {
                id: 2,
                title: "Aluminum Cans",
                type: "metal",
                weight: "15kg",
                price: "$1.20/kg",
                status: "Sold",
                image: "🥫",
                gradient: "from-blue-500 to-cyan-600"
            }
        ];
    }

    setupEventListeners() {
        // New listing form
        const listingForm = document.getElementById('listingForm');
        if (listingForm) {
            listingForm.addEventListener('submit', (e) => this.handleNewListing(e));
        }

        // File upload
        const fileInput = document.getElementById('itemImage');
        const fileLabel = document.getElementById('fileLabel');
        
        if (fileInput && fileLabel) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    fileLabel.textContent = e.target.files[0].name;
                } else {
                    fileLabel.textContent = 'Choose file';
                }
            });
        }

        // Delete listing buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.delete-listing')) {
                const listingId = e.target.closest('.delete-listing').getAttribute('data-id');
                this.deleteListing(listingId);
            }
        });

        // Edit listing buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-listing')) {
                const listingId = e.target.closest('.edit-listing').getAttribute('data-id');
                this.editListing(listingId);
            }
        });
    }

    handleNewListing(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        const newListing = {
            id: Date.now(), // Simple ID generation
            title: data.title,
            type: data.type,
            weight: `${data.weight}kg`,
            price: "Pending",
            status: "Active",
            image: this.getIconForType(data.type),
            gradient: this.getRandomGradient()
        };

        this.listings.unshift(newListing);
        this.renderListings();
        
        // Reset form
        e.target.reset();
        document.getElementById('fileLabel').textContent = 'Choose file';
        
        window.scrapSmartApp.showNotification('Listing added successfully!', 'success');
    }

    deleteListing(listingId) {
        if (confirm('Are you sure you want to delete this listing?')) {
            this.listings = this.listings.filter(listing => listing.id != listingId);
            this.renderListings();
            window.scrapSmartApp.showNotification('Listing deleted successfully!', 'success');
        }
    }

    editListing(listingId) {
        const listing = this.listings.find(l => l.id == listingId);
        if (listing) {
            // In a real app, this would open an edit form/modal
            window.scrapSmartApp.showNotification(`Editing: ${listing.title}`, 'info');
        }
    }

    getIconForType(type) {
        const icons = {
            metal: "🔩",
            electronics: "💻",
            batteries: "🔋",
            wires: "🔌",
            automotive: "🚗",
            other: "📦"
        };
        return icons[type] || icons.other;
    }

    getRandomGradient() {
        const gradients = [
            "from-orange-500 to-amber-600",
            "from-blue-500 to-cyan-600",
            "from-purple-500 to-indigo-600",
            "from-green-500 to-emerald-600",
            "from-red-500 to-pink-600",
            "from-yellow-500 to-amber-600"
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    }

    renderListings() {
        const container = document.getElementById('sellerListings');
        if (!container) return;

        const activeCount = this.listings.filter(l => l.status === 'Active').length;
        const soldCount = this.listings.filter(l => l.status === 'Sold').length;

        // Update counts
        const activeElement = document.getElementById('activeCount');
        const soldElement = document.getElementById('soldCount');
        
        if (activeElement) activeElement.textContent = `${activeCount} Active`;
        if (soldElement) soldElement.textContent = `${soldCount} Sold`;

        if (this.listings.length === 0) {
            container.innerHTML = `
                <div class="card p-8 text-center">
                    <p class="text-slate-400">You haven't listed any items yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.listings.map(listing => `
            <div class="card p-4 flex items-start">
                <div class="w-16 h-16 rounded-lg flex items-center justify-center text-2xl mr-4 bg-gradient-to-r ${listing.gradient}">
                    ${listing.image}
                </div>
                <div class="flex-1">
                    <div class="flex justify-between">
                        <h3 class="font-medium">${listing.title}</h3>
                        <span class="px-2 py-1 text-xs rounded-full ${
                            listing.status === "Active" 
                                ? "bg-emerald-500/20 text-emerald-300" 
                                : "bg-slate-700/50 text-slate-400"
                        }">
                            ${listing.status}
                        </span>
                    </div>
                    <p class="text-sm text-slate-400">${listing.type} • ${listing.weight}</p>
                    <p class="text-sm font-medium text-emerald-400 mt-1">${listing.price}</p>
                </div>
                <div class="flex space-x-2 ml-4">
                    <button class="edit-listing p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-lg transition-colors" data-id="${listing.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-listing p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors" data-id="${listing.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize seller dashboard when it becomes active
window.addEventListener('pageChanged', (event) => {
    if (event.detail.page === 'seller') {
        new SellerDashboard();
    }
});