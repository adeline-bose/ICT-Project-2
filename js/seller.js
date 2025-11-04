document.addEventListener('DOMContentLoaded', () => {
    
    const listingForm = document.getElementById('listingForm');
    if (listingForm) {
        listingForm.addEventListener('submit', handleListingSubmit);
    }

    const itemImageInput = document.getElementById('itemImage');
    const fileLabel = document.getElementById('fileLabel');
    
    if (itemImageInput && fileLabel) {
        itemImageInput.addEventListener('change', () => {
            if (itemImageInput.files.length > 0) {
                fileLabel.textContent = itemImageInput.files[0].name;
            } else {
                fileLabel.textContent = 'Choose file';
            }
        });
    }

    document.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-listing');
        if (deleteButton) {
            e.preventDefault();
            const listingId = deleteButton.getAttribute('data-id');
            handleDeleteListing(listingId);
        }

        const editButton = e.target.closest('.edit-listing');
        if (editButton) {
            e.preventDefault();
            const listingId = editButton.getAttribute('data-id');
            handleEditListing(listingId);
        }
    });
});


function handleListingSubmit(e) {
    e.preventDefault(); // Stop the form from reloading the page
    const formData = new FormData(e.target);
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    if (submitButton) {
        submitButton.textContent = 'Posting...';
        submitButton.disabled = true; 
    }

    // This path is correct
    fetch('src/submit_post.php', { 
        method: 'POST',
        body: formData 
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            location.reload(true); // Reload the page to show the new listing
        } else {
            alert('Error: ' + data.message);
            if (submitButton) {
                // Reset button text
                const idInput = document.getElementById('listingIdField');
                submitButton.textContent = idInput ? 'Update Item' : 'List Item';
                submitButton.disabled = false;
            }
        }
    })
    .catch(error => {
        console.error('Submission error:', error);
        alert('An error occurred. Could not connect to the server.');
        if (submitButton) {
            const idInput = document.getElementById('listingIdField');
            submitButton.textContent = idInput ? 'Update Item' : 'List Item';
            submitButton.disabled = false;
        }
    });
}

/**
 * --- THIS IS THE NEW, WORKING DELETE FUNCTION ---
 */
function handleDeleteListing(listingId) {
    if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
        
        fetch('src/delete_listing.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${listingId}` // Send the ID as POST data
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Listing deleted successfully!');
                location.reload(true); // Hard reload the page
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Delete error:', error);
            alert('An error occurred. Could not connect to the server.');
        });
    }
}

/**
 * --- THIS FUNCTION IS NOW FIXED ---
 */
function handleEditListing(listingId) {
    // Fetch the listing data from our new PHP script
    fetch(`src/get_listing.php?id=${listingId}`)
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                const data = result.data;
                
                // Fill in the form with the data
                document.getElementById('itemTitle').value = data.scrap_name;
                document.getElementById('scrapType').value = data.scrap_type;
                document.getElementById('itemWeight').value = data.weight_kg;
                document.getElementById('itemDescription').value = data.descr;
                document.querySelector('input[name="price"]').value = data.unit_price;
                document.querySelector('input[name="location"]').value = data.address;
                
                // Change the form button to "Update"
                const submitButton = document.querySelector('#listingForm button[type="submit"]');
                submitButton.textContent = 'Update Item';

                // --- SYNTAX ERROR FIX: This is now a comment ---
                // Add a hidden input to store the ID
                
                // First, check if one already exists
                let idInput = document.getElementById('listingIdField');
                if (!idInput) {
                    // Create it if it doesn't
                    idInput = document.createElement('input');
                    idInput.type = 'hidden';
                    idInput.id = 'listingIdField';
                    idInput.name = 'id'; // This is what submit_post.php looks for
                    document.getElementById('listingForm').appendChild(idInput);
                }
                idInput.value = data.id; // Set the ID

                window.scrollTo({ top: 0, behavior: 'smooth' });

            } else {
                alert('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Could not fetch listing details.');
        });
}