document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("AppDataUpdated", function () {
        // Read initial state from URL
        const urlParams = new URLSearchParams(window.location.search);
        const swapTabs = document.querySelector(".widget.switch-tabs");
        let activeTab;
        if (window.location.href.includes("/community")) {
            activeTab = urlParams.get("tab") || "community";
            swapTabs.remove();
        } else if (window.location.href.includes("/p/skills")) {
            activeTab = urlParams.get("tab") || "skills";
            swapTabs.remove();
        } else if (window.location.href.includes("help.ideagen.com/hc")) {
            activeTab = urlParams.get("tab") || "help";
            swapTabs.remove();
        } else if (window.location.href.includes("/events")) {
            activeTab = urlParams.get("tab") || "events";
            swapTabs.remove();
        } else if (window.location.href.includes("/p/support")) {
            activeTab = urlParams.get("tab") || "support";
            swapTabs.remove();
        } else {
            activeTab = urlParams.get("tab") || "all";
        }
        let currentPage = parseInt(urlParams.get("page")) || 1;
        let isInitialLoad = true;

        // DOM Elements
        const searchInput = document.querySelector('#product-search input[type="search"]');
        const productListContainer = document.getElementById("productListContainer");
        const productList = document.getElementById("product-list");
        const clearIcon = document.querySelector("#product-search #clear-icon");
        const searchIcon = document.querySelector("#product-search #search-icon");
        const tabButtons = document.querySelectorAll(".tab-switch-pill");
        const paginationContainer = document.createElement("div");
        paginationContainer.className = "pagination-container";
        productListContainer.appendChild(paginationContainer);

        // State variables
        let selectedIndex = -1;
        let productElements = [];
        const itemsPerPage = 12;
        let totalPages = 1;
        let filteredProducts = [];

        // Initialize UI
        clearIcon.style.display = "none";
        searchIcon.style.display = "block";
        productListContainer.style.display = "block";

        // Set active tab button if coming from URL
        tabButtons.forEach((button) => {
            button.classList.toggle("active", button.id === activeTab);
        });

        // Function to update URL parameters
        function updateURL() {
            const params = new URLSearchParams(window.location.search);
            params.set("tab", activeTab);
            params.set("page", currentPage);
            window.history.replaceState(null, "", "?" + params.toString());
        }

        // Function to update selected product
        function updateSelection() {
            productElements.forEach((el, i) => {
                el.classList.toggle("selected", i === selectedIndex);
                if (i === selectedIndex) {
                    el.focus();
                }
            });
        }

        // Reset selection
        function resetSelection() {
            selectedIndex = -1;
            updateSelection();
        }

        // Tab handling
        function handleTabClick(tabId) {
            activeTab = tabId;
            currentPage = 1; // Reset to first page when changing tabs
            isInitialLoad = false; // Explicitly mark as not initial load
            tabButtons.forEach((button) => {
                button.classList.toggle("active", button.id === tabId);
            });
            generateProductList(searchInput.value);
            updateURL();
        }

        // Add tab event listeners
        tabButtons.forEach((button) => {
            button.addEventListener("click", () => handleTabClick(button.id));
        });

// Get sorted products
function getSortedProducts() {
    const productDirectory = window.AppData.productDirectory;
    const products = [];

    for (const [productCategory, categoryProducts] of Object.entries(productDirectory)) {
        for (const [productName, productData] of Object.entries(categoryProducts)) {
            const hasEditions = productData.images === undefined;

            if (hasEditions) {
                // Collect all available tabs from all editions
                const availableTabs = new Set();
                for (const [editionName, editionData] of Object.entries(productData)) {
                    // Skip non-edition properties
                    if (editionName === "alt-names" || editionName === "description") continue;
                    
                    if (editionData.url) {
                        Object.keys(editionData.url).forEach(tab => availableTabs.add(tab));
                    }
                }
                
                products.push({
                    category: productCategory,
                    name: productName,
                    edition: null,
                    data: productData,
                    displayName: productName.toLowerCase(),
                    hasEditions: true,
                    availableTabs: Array.from(availableTabs) // Ensure this is always an array
                });
            } else {
                products.push({
                    category: productCategory,
                    name: productName,
                    edition: null,
                    data: productData,
                    displayName: productName.toLowerCase(),
                    hasEditions: false,
                    availableTabs: productData.url ? Object.keys(productData.url) : [] // Ensure array
                });
            }
        }
    }

    return products.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

// Search matching
function productMatchesSearch(product, searchText) {
    const lowerSearch = searchText.toLowerCase();
    
    // Check main product name
    if (product.displayName.includes(lowerSearch)) return true;

    // Check alt names for main product
    let altNames = [];
    if (product.data["alt-names"]) {
        altNames = product.data["alt-names"];
    }
    
    // Check if any alt names match
    if (altNames.some((alt) => alt.toLowerCase().includes(lowerSearch))) {
        return true;
    }

    // For products with editions, check each edition's data
    if (product.hasEditions) {
        for (const [editionName, editionData] of Object.entries(product.data)) {
            // Skip non-edition properties
            if (editionName === "alt-names" || editionName === "description") continue;
            
            // Check edition name itself
            if (editionName.toLowerCase().includes(lowerSearch)) {
                return true;
            }
            
            // Check edition's legacy name
            if (editionData.legacy_name && 
                editionData.legacy_name.toLowerCase().includes(lowerSearch)) {
                return true;
            }
            
            // Check edition's alt names
            if (editionData["alt-names"]) {
                if (editionData["alt-names"].some(alt => 
                    alt.toLowerCase().includes(lowerSearch))) {
                    return true;
                }
            }
        }
    }

    return false;
}

// Create product element
function createProductElement(container, category, name, edition, data, hasEditions) {
    // Get availableTabs - default to empty array if not present
    const availableTabs = data.availableTabs || [];
    
    // Determine if this product should be clickable in the current tab
    let isClickable = false;
    let productUrl = "#";
    
    if (hasEditions) {
        // For products with editions, check if any edition has this tab
        isClickable = activeTab === "all" || 
                     availableTabs.includes(activeTab);
    } else {
        // For regular products, check if they have this tab
        isClickable = activeTab === "all" || 
                     (data.url && data.url[activeTab]);
        if (isClickable && data.url) {
            productUrl = activeTab === "all" 
                ? (Object.values(data.url)[0] || "#") 
                : (data.url[activeTab] || Object.values(data.url)[0] || "#");
        }
    }

    const element = document.createElement(isClickable ? "a" : "div");
    if (isClickable) {
        element.href = productUrl;
        if (productUrl !== "#" && !productUrl.includes("ideagen.com")) {
            element.target = "_blank";
        }
        
        if (hasEditions) {
            element.addEventListener("click", (e) => {
                e.preventDefault();
                showEditionsPopup(category, name, data);
            });
        }
    } else if (hasEditions) {
        element.classList.add("product-with-editions");
        element.addEventListener("click", (e) => {
            e.preventDefault();
            showEditionsPopup(category, name, data);
        });
    }
    
    // Rest of the element creation remains the same
    element.tabIndex = -1;

    const prodIdDiv = document.createElement("div");
    prodIdDiv.className = "prod-id";

    const iconDiv = document.createElement("div");
    iconDiv.className = "prod-icon";
    
    if (hasEditions) {
        // Create a container for multiple edition icons
        const editionsIconsContainer = document.createElement("div");
        editionsIconsContainer.className = "editions-icons-container";
        
        // Get all editions that have images
        const editionsWithImages = Object.values(data).filter(ed => ed.images);
        
        // Limit to showing 4 icons max (you can adjust this number)
        const iconsToShow = editionsWithImages.slice(0, 4);
        
        // Add each edition icon
        iconsToShow.forEach(editionData => {
            const editionIcon = document.createElement("img");
            editionIcon.src = editionData.images.ident;
            editionIcon.alt = name;
            editionIcon.className = "edition-icon";
            editionsIconsContainer.appendChild(editionIcon);
        });
        
        // If there are more than 4 editions, add a counter
        if (editionsWithImages.length > 4) {
            const counter = document.createElement("div");
            counter.className = "edition-icon-counter";
            counter.textContent = `+${editionsWithImages.length - 4}`;
            editionsIconsContainer.appendChild(counter);
        }
        
        iconDiv.appendChild(editionsIconsContainer);
    } else {
        // Single product case
        const iconImg = document.createElement("img");
        iconImg.src = data.images.ident;
        iconImg.alt = name;
        iconDiv.appendChild(iconImg);
    }

    const textWrapper = document.createElement("div");
    textWrapper.className = "prod-text-wrapper";

    const nameWrapper = document.createElement("div");
    nameWrapper.className = "prod-name-wrapper";
    const nameSpan = document.createElement("span");
    nameSpan.className = "prod-name";
    nameSpan.textContent = name;
    nameWrapper.appendChild(nameSpan);

// Get all legacy names for products with editions
let legacyNames = [];
if (hasEditions) {
    // Collect all unique legacy names from editions
    const allLegacyNames = Object.values(data)
        .filter(ed => ed.images && ed.legacy_name)
        .map(ed => ed.legacy_name.trim())
        .filter(name => name !== "");
    
    // Remove duplicates
    legacyNames = [...new Set(allLegacyNames)];
} else if (data.legacy_name && data.legacy_name.trim() !== "") {
    legacyNames = [data.legacy_name.trim()];
}

// Format the legacy names string
if (legacyNames.length > 0) {
    const legacySpan = document.createElement("span");
    legacySpan.className = "prod-legacyName";
    
    let legacyText = "Formerly ";
    if (legacyNames.length === 1) {
        legacyText += legacyNames[0];
    } else {
        // Join with commas and use "&" before last item
        legacyText += legacyNames.slice(0, -1).join(", ");
        if (legacyNames.length > 2) {
            legacyText += ","; // Oxford comma
        }
        legacyText += ` & ${legacyNames[legacyNames.length - 1]}`;
    }
    
    legacySpan.textContent = legacyText;
    nameWrapper.appendChild(legacySpan);
}

    textWrapper.appendChild(nameWrapper);

    const description = document.createElement("span");
    description.className = "prod-description";
    description.textContent = hasEditions ? `The ${name} suite contains multiple editions to choose from.` : data.description;

    const separator = document.createElement("hr");

    prodIdDiv.appendChild(iconDiv);
    prodIdDiv.appendChild(textWrapper);
    element.appendChild(prodIdDiv);
    element.appendChild(separator);
    element.appendChild(description);
    container.appendChild(element);

    // Add chevron icon for products with editions
    if (hasEditions) {
        const chevronIcon = document.createElement("i");
        chevronIcon.className = "i-expand-modal";
        chevronIcon.id = "editionsChevron";
        prodIdDiv.appendChild(chevronIcon);
    } else if (!(productUrl.includes("ideagen.com") || productUrl.includes("insided.com"))) {
        const externalLinkIcon = document.createElement("i");
        externalLinkIcon.className = "i-external-link";
        externalLinkIcon.id = "externalLink";
        prodIdDiv.appendChild(externalLinkIcon);
        externalLinkIcon.style.display = "block";
    }
}

// Show editions popup
function showEditionsPopup(category, name, productData) {
    const popup = document.createElement("div");
    popup.className = "editions-popup";
    
    const popupContent = document.createElement("div");
    popupContent.className = "editions-popup-content";
    
    const closeButton = document.createElement("i");
    closeButton.className = "i-cross";
    closeButton.addEventListener("click", () => document.body.removeChild(popup));
    
    const title = document.createElement("h3");
    title.textContent = `${name} Editions`;

    const helpDesc = document.createElement("span");
    helpDesc.innerHTML = `Check the about section of your solution to discover the edition of your product`;

    const separator = document.createElement("hr");
    
    popupContent.appendChild(closeButton);
    popupContent.appendChild(title);
    popupContent.appendChild(helpDesc);
    popupContent.appendChild(separator);
    
    const editionsContainer = document.createElement("div");
    editionsContainer.className = "editions-container";
    
    for (const [editionName, editionData] of Object.entries(productData)) {
        // Skip non-edition properties and editions without images
        if (editionName === "alt-names" || editionName === "description" || !editionData.images) continue;
        
        // Skip editions that don't have a URL for the current tab (unless tab is "all")
        if (activeTab !== "all") {
            if (!editionData.url || !editionData.url[activeTab]) continue;
        }
        
        // Skip editions that don't have any URL at all
        if (!editionData.url || Object.keys(editionData.url).length === 0) continue;

        const editionButton = document.createElement("a");
        editionButton.className = "edition-button";
        
        // Get the appropriate URL
        const productUrl = activeTab === "all" 
            ? editionData.url[Object.keys(editionData.url)[0]] 
            : editionData.url[activeTab];
        
        editionButton.href = productUrl;
        if (!productUrl.includes("ideagen.com")) {
            editionButton.target = "_blank";
        }

        const editionprodIdDiv = document.createElement("div");
        editionprodIdDiv.className = "prod-id";
    
        const editioniconDiv = document.createElement("div");
        editioniconDiv.className = "prod-icon";
        
        const editioniconImg = document.createElement("img");
        editioniconImg.src = editionData.images.ident;
        editioniconImg.alt = name;
        editioniconDiv.appendChild(editioniconImg);

        const editiontextWrapper = document.createElement("div");
        editiontextWrapper.className = "prod-text-wrapper";

        const editionnameWrapper = document.createElement("div");
        editionnameWrapper.className = "prod-name-wrapper";
        const editionnameSpan = document.createElement("span");
        editionnameSpan.className = "prod-name";
        editionnameSpan.textContent = name === "Internal Audit" && editionName ? editionName : editionName ? `${name}: ${editionName}` : name;
        editionnameWrapper.appendChild(editionnameSpan);
    
        // Legacy name handling
        let editionlegacyNames = [];
        if (editionData.legacy_name && editionData.legacy_name.trim() !== "") {
            editionlegacyNames = [editionData.legacy_name.trim()];
        }
        
        if (editionlegacyNames.length > 0) {
            const editionlegacySpan = document.createElement("span");
            editionlegacySpan.className = "prod-legacyName";
            editionlegacySpan.textContent = `Formerly ${editionlegacyNames[0]}`;
            editionnameWrapper.appendChild(editionlegacySpan);
        }
    
        editiontextWrapper.appendChild(editionnameWrapper);
    
        const editiondescription = document.createElement("span");
        editiondescription.className = "prod-description";
        editiondescription.textContent = editionData.description;
    
        const editionseparator = document.createElement("hr");
    
        editionprodIdDiv.appendChild(editioniconDiv);
        editionprodIdDiv.appendChild(editiontextWrapper);
        editionButton.appendChild(editionprodIdDiv);
        editionButton.appendChild(editionseparator);
        editionButton.appendChild(editiondescription);
        
        if (!productUrl.includes("ideagen.com")) {
            const externalIcon = document.createElement("i");
            externalIcon.className = "i-external-link";
            editionButton.appendChild(externalIcon);
        }
        
        editionsContainer.appendChild(editionButton);
    }
    
    // If no editions match the current tab, show a message
    if (editionsContainer.children.length === 0) {
        const noEditionsMessage = document.createElement("p");
        noEditionsMessage.textContent = `No editions available for ${name} in the ${activeTab} tab.`;
        noEditionsMessage.style.textAlign = "center";
        noEditionsMessage.style.padding = "20px";
        editionsContainer.appendChild(noEditionsMessage);
    }
    
    popupContent.appendChild(editionsContainer);
    popup.appendChild(popupContent);
    
    document.body.appendChild(popup);
    
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            document.body.removeChild(popup);
        }
    });
}

        // Create pagination controls
        function createPaginationControls() {
            paginationContainer.innerHTML = "";

            if (totalPages <= 1) return;

            const paginationDiv = document.createElement("div");
            paginationDiv.className = "pagination";

            // Previous button
            const prevButton = document.createElement("button");
            prevButton.innerHTML = `<i class="i-chevron-left"></i>`;
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderCurrentPage();
                    updateURL();
                }
            });

            paginationDiv.appendChild(prevButton);

            // Page number buttons
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement("button");
                pageButton.textContent = i;
                pageButton.className = i === currentPage ? "active" : "";
                pageButton.addEventListener("click", () => {
                    currentPage = i;
                    renderCurrentPage();
                    updateURL();
                });
                paginationDiv.appendChild(pageButton);
            }

            // Next button
            const nextButton = document.createElement("button");
            nextButton.innerHTML = `<i class="i-chevron-right"></i>`;
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderCurrentPage();
                    updateURL();
                }
            });

            paginationDiv.appendChild(nextButton);
            paginationContainer.appendChild(paginationDiv);
        }

// Render current page of products
function renderCurrentPage() {
    productList.innerHTML = "";
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);

    for (let i = startIndex; i < endIndex; i++) {
        const product = filteredProducts[i];
        createProductElement(
            productList, 
            product.category, 
            product.name, 
            product.edition, 
            product.data,
            product.hasEditions
        );
    }

    productElements = Array.from(productList.querySelectorAll("a, div.product-with-editions"));
    resetSelection();
    createPaginationControls();
    updateURL();
    
    if (!isInitialLoad) {
        const productDirectory = document.getElementById('productDirectory');
        if (productDirectory) {
            productDirectory.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    isInitialLoad = false;
}

function generateProductList(searchText = "") {
    if (!window.AppData?.productDirectory) {
        console.error("Product directory not loaded yet");
        return;
    }

    const sortedProducts = getSortedProducts();
    filteredProducts = [];
    currentPage = 1;

    for (const product of sortedProducts) {
        // Skip "Audit and Risk Management"
        if (product.name === "Audit and Risk Management") {
            continue;
        }
        
        if (searchText && !productMatchesSearch(product, searchText)) continue;
        
        // Modified tab filtering logic - defensive checks
        if (activeTab !== "all") {
            const availableTabs = product.availableTabs || [];
            
            // For products with editions, check if any edition has this tab
            if (product.hasEditions) {
                if (!availableTabs.includes(activeTab)) {
                    continue;
                }
            } 
            // For regular products, check if they have this tab
            else if (!availableTabs.includes(activeTab)) {
                continue;
            }
        }

        filteredProducts.push(product);
    }

    // Rest of the function remains the same
    totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (filteredProducts.length === 0) {
        productList.innerHTML = "";
        const noResults = document.createElement("div");
        noResults.className = "not-found";
        noResults.innerHTML = `
         <img src="https://dkzqv2h4biivh.cloudfront.net/images/graphics/empty-box.svg">
         <h3>No results found for ${searchText}</h3>
         <p style="margin-bottom: 0;">You might have misspelled the solution name, or it may not have a dedicated page yet.</p>
        `
        productList.appendChild(noResults);
        paginationContainer.innerHTML = "";
    } else {
        renderCurrentPage();
    }

    productListContainer.style.display = "block";
}

        // Event Listeners
        searchInput.addEventListener("input", function () {
            const hasText = this.value.length > 0;
            clearIcon.style.display = hasText ? "block" : "none";
            searchIcon.style.display = hasText ? "none" : "block";
            generateProductList(this.value);
        });

        searchInput.addEventListener("focus", function () {
            generateProductList(this.value);
            productListContainer.style.display = "block";
        });

        clearIcon.addEventListener("click", function (e) {
            e.stopPropagation();
            searchInput.value = "";
            clearIcon.style.display = "none";
            searchIcon.style.display = "block";
            generateProductList();
            searchInput.focus();
        });

        document.addEventListener("click", function (e) {
            if (!e.target.closest("#product-search") && !e.target.closest("#productListContainer") && !e.target.closest("#clear-icon")) {
            }
        });

        // Initial generation - with error checking
        function initializeProductSearch() {
            if (!window.AppData?.productDirectory) {
                console.error("AppData.productDirectory not available");
                setTimeout(initializeProductSearch, 100); // Retry after delay
                return;
            }
        
            console.log("Initializing product search with data:", window.AppData.productDirectory);
            isInitialLoad = true; // Set flag for initial load
            generateProductList();
        }

        // Start initialization
        initializeProductSearch();
    });
});
