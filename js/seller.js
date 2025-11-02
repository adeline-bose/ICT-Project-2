/*
* This script now has two jobs:
* 1. Handle the "List Item" form submission using fetch().
* 2. Update the "Choose file" label text.
* 3. (Future) Handle the delete/edit buttons.
*
* All fake data and rendering functions have been removed
* because the PHP file now handles displaying the listings.
*/
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Find the form and add the submit listener
    const listingForm = document.getElementById('listingForm');
    if (listingForm) {
        listingForm.addEventListener('submit', handleListingSubmit);
    }

    // 2. Find the file input and add the change listener
    const itemImageInput = document.getElementById('itemImage');
    const fileLabel = document.getElementById('fileLabel');
    
    if (itemImageInput && fileLabel) {
        itemImageInput.addEventListener('change', ()_ => {
            if (itemImageInput.files.length > 0) {
                fileLabel.textContent = itemImageInput.files[0].name;
            } else {
                fileLabel.textContent = 'Choose file';
            }
        });
    }

    // 3. Add listeners for delete/edit buttons
    // We listen on the whole document in case listings are added/removed
    document.addEventListener('click', (e) => {
        // Find the closest delete button to where the user clicked
        const deleteButton = e.target.closest('.delete-listing');
        if (deleteButton) {
            e.preventDefault();
            const listingId = deleteButton.getAttribute('data-id');
            handleDeleteListing(listingId);
        }

        // Find the closest edit button
        const editButton = e.target.closest('.edit-listing');
        if (editButton) {
            e.preventDefault();
            const listingId = editButton.getAttribute('data-id');
            handleEditListing(listingId);
        }
    });
});

/**
 * Handles the submission of the new listing form
 * This is the same function from before, it is correct.
 */
function handleListingSubmit(e) {
    e.preventDefault(); // Stop the form from reloading the page
    const formData = new FormData(e.target);
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    if (submitButton) {
        submitButton.textContent = 'Posting...';
        submitButton.disabled = true; 
    }

    fetch('submit_post.php', { // Assumes submit_post.php is in the root
        method: 'POST',
        body: formData 
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Listing posted successfully!');
            location.reload(); // Reload the page to show the new listing
        } else {
            alert('Error: ' + data.message);
            if (submitButton) {
                submitButton.textContent = 'List Item';
                submitButton.disabled = false;
            }
        }
    })
    .catch(error => {
        console.error('Submission error:', error);
        alert('An error occurred. Could not connect to the server.');
        if (submitButton) {
            submitButton.textContent = 'List Item';
            submitButton.disabled = false;
        }
    });
}

/**
 * Handles deleting a listing
 */
function handleDeleteListing(listingId) {
    if (confirm('Are you sure you want to delete this listing?')) {
        // TODO: Create a 'delete_listing.php' file to handle this
        alert(`Pressed delete for listing ID ${listingId}. \nWe need to create delete_listing.php next!`);
        
        /* // This is what the code will look like:
        fetch('delete_listing.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${listingId}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Listing deleted!');
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        });
        */
    }
}

/**
 * Handles editing a listing
 */
function handleEditListing(listingId) {
    // TODO: Build the edit functionality
    alert(`Pressed edit for listing ID ${listingId}. \nThis would open an edit form.`);
}