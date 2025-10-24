// Details page functionality
class DetailsPage {
    constructor() {
        this.listing = null;
        this.selectedImage = 0;
        this.quantity = 100;
        this.isFavorited = false;

        this.init();
    }

    init() {
        this.loadListing();
        this.setupEventListeners();
        this.renderListing();
    }

    loadListing() {
        // In a real app, this would fetch from an API based on ID
        // For now, we'll use sample data
        this.listing = {
            id: 1,
            title: "High Purity Copper Wire Scrap",
            category: "Metals",
            subCategory: "Copper",
            price: 450,
            priceUnit: "per kg",
            availableQuantity: 2500,
            minQuantity: 100,
            condition: "Excellent",
            description: "Premium-grade copper wire scrap from industrial electrical installations. 99.9% pure copper with PVC insulation removed. Material has been thoroughly cleaned and sorted for optimal recycling efficiency. Suitable for smelting and manufacturing applications.",
            location: "Mumbai, Maharashtra",
            images: [
                "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            ],
            postedDate: "2024-12-15",
            seller: {
                id: 101,
                name: "Rajesh Kumar",
                businessName: "Kumar Scrap Trading",
                rating: 4.7,
                totalReviews: 156,
                memberSince: "2022",
                verified: true,
                phone: "+91 98765 43210",
                email: "rajesh@kumarscrap.com",
                location: "Andheri East, Mumbai"
            },
            specifications: {
                purity: "99.9%",
                wireGauge: "Mixed (12-16 AWG)",
                packaging: "Bundled (50kg bundles)",
                origin: "Industrial electrical",
                moistureContent: "<0.5%",
                contamination: "Negligible"
            },
            delivery: {
                available: true,
                freeDeliveryAbove: 1000,
                estimatedDays: "3-5 business days",
                charges: 50
            },
            gradient: "from-orange-500 to-amber-600"
        };
    }

    setupEventListeners() {
        // Thumbnail selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.thumbnail')) {
                const index = parseInt(e.target.closest('.thumbnail').getAttribute('data-index'));
                this.selectImage(index);
            }
        });

        // Quantity controls
        document.getElementById('decreaseQty')?.addEventListener('click', () => {
            this.adjustQuantity(-100);
        });

        document.getElementById('increaseQty')?.addEventListener('click', () => {
            this.adjustQuantity(100);
        });

        document.getElementById('quantityInput')?.addEventListener('change', (e) => {
            this.setQuantity(parseInt(e.target.value) || this.listing.minQuantity);
        });

        // Favorite button
        document.getElementById('favoriteBtn')?.addEventListener('click', () => {
            this.toggleFavorite();
        });

        // Action buttons
        document.getElementById('purchaseBtn')?.addEventListener('click', () => {
            this.handlePurchase();
        });

        document.getElementById('inquiryBtn')?.addEventListener('click', () => {
            this.handleInquiry();
        });
    }

    selectImage(index) {
        this.selectedImage = index;
        
        // Update main image
        const mainImage = document.getElementById('mainImage');
        if (mainImage && this.listing.images[index]) {
            mainImage.src = this.listing.images[index];
        }

        // Update thumbnail states
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    adjustQuantity(change) {
        const newQuantity = this.quantity + change;
        this.setQuantity(newQuantity);
    }

    setQuantity(newQuantity) {
        this.quantity = Math.max(
            this.listing.minQuantity, 
            Math.min(this.listing.availableQuantity, newQuantity)
        );
        
        const quantityInput = document.getElementById('quantityInput');
        if (quantityInput) {
            quantityInput.value = this.quantity;
        }
        
        this.updatePrice();
    }

    updatePrice() {
        const totalPrice = this.quantity * this.listing.price;
        const deliveryCharge = totalPrice >= this.listing.delivery.freeDeliveryAbove ? 0 : this.listing.delivery.charges;
        const finalPrice = totalPrice + deliveryCharge;

        const priceBreakdown = document.getElementById('priceBreakdown');
        if (priceBreakdown) {
            priceBreakdown.innerHTML = `
                <div class="space-y-2">
                    <div class="flex justify-between text-sm text-slate-300">
                        <span>Price (${this.quantity}kg × ₹${this.listing.price})</span>
                        <span>₹${totalPrice.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between text-sm text-slate-300">
                        <span>Delivery Charges</span>
                        <span class="${deliveryCharge === 0 ? 'text-emerald-400' : ''}">
                            ${deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                        </span>
                    </div>
                    <div class="border-t border-slate-600/50 pt-2">
                        <div class="flex justify-between font-semibold text-lg">
                            <span class="text-slate-300">Total</span>
                            <span class="text-emerald-400">₹${finalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    toggleFavorite() {
        this.isFavorited = !this.isFavorited;
        const favoriteBtn = document.getElementById('favoriteBtn');
        
        if (favoriteBtn) {
            if (this.isFavorited) {
                favoriteBtn.classList.add('text-red-400', 'bg-red-500/20');
                favoriteBtn.classList.remove('text-slate-400');
                favoriteBtn.querySelector('i').classList.add('fas');
                favoriteBtn.querySelector('i').classList.remove('far');
            } else {
                favoriteBtn.classList.remove('text-red-400', 'bg-red-500/20');
                favoriteBtn.classList.add('text-slate-400');
                favoriteBtn.querySelector('i').classList.remove('fas');
                favoriteBtn.querySelector('i').classList.add('far');
            }
        }
    }

    handlePurchase() {
        const purchaseData = {
            listingId: this.listing.id,
            quantity: this.quantity,
            totalPrice: this.quantity * this.listing.price
        };

        // In a real app, this would open a purchase modal or redirect to checkout
        window.scrapSmartApp.showNotification('Purchase initiated!', 'success');
        console.log('Purchase data:', purchaseData);
    }

    handleInquiry() {
        const inquiryData = {
            listingId: this.listing.id,
            sellerId: this.listing.seller.id,
            message: `I'm interested in ${this.quantity}kg of ${this.listing.title}`
        };

        // In a real app, this would open a messaging interface
        window.scrapSmartApp.showNotification('Inquiry sent to seller!', 'success');
        console.log('Inquiry data:', inquiryData);
    }

    renderListing() {
        if (!this.listing) return;

        // Update main content
        this.updateElement('listingTitle', this.listing.title);
        this.updateElement('listingPrice', `₹${this.listing.price}`);
        this.updateElement('priceUnit', this.listing.priceUnit);
        this.updateElement('listingDescription', this.listing.description);
        this.updateElement('listingLocation', this.listing.location);
        this.updateElement('availableQuantity', `${this.listing.availableQuantity} kg`);
        this.updateElement('minQuantity', `${this.listing.minQuantity} kg`);
        this.updateElement('condition', this.listing.condition);
        this.updateElement('postedDate', new Date(this.listing.postedDate).toLocaleDateString());

        // Update seller information
        this.updateElement('sellerName', this.listing.seller.name);
        this.updateElement('sellerBusiness', this.listing.seller.businessName);
        this.updateElement('sellerRating', this.listing.seller.rating);
        this.updateElement('sellerReviews', `(${this.listing.seller.totalReviews} reviews)`);
        this.updateElement('sellerLocation', this.listing.seller.location);
        this.updateElement('sellerPhone', this.listing.seller.phone);
        this.updateElement('sellerEmail', this.listing.seller.email);
        this.updateElement('sellerSince', this.listing.seller.memberSince);

        // Render specifications
        this.renderSpecifications();

        // Render images
        this.renderImages();

        // Set initial quantity
        this.setQuantity(this.listing.minQuantity);
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    renderSpecifications() {
        const container = document.getElementById('specifications');
        if (!container) return;

        container.innerHTML = Object.entries(this.listing.specifications)
            .map(([key, value]) => `
                <div class="flex justify-between py-2 border-b border-slate-700">
                    <span class="text-slate-400 capitalize">${key.replace(/([A-Z])/g, ' $1')}</span>
                    <span class="font-medium">${value}</span>
                </div>
            `).join('');
    }

    renderImages() {
        const mainImage = document.getElementById('mainImage');
        const thumbnailsContainer = document.getElementById('thumbnails');

        if (mainImage && this.listing.images.length > 0) {
            mainImage.src = this.listing.images[this.selectedImage];
        }

        if (thumbnailsContainer) {
            thumbnailsContainer.innerHTML = this.listing.images
                .map((img, index) => `
                    <button class="thumbnail ${index === this.selectedImage ? 'active' : ''}" data-index="${index}">
                        <img src="${img}" alt="Thumbnail ${index + 1}" class="object-cover w-full h-full">
                    </button>
                `).join('');
        }
    }
}

// Initialize details page when it becomes active
window.addEventListener('pageChanged', (event) => {
    if (event.detail.page === 'details') {
        new DetailsPage();
    }
});