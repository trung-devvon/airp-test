// Global variables
let airportsData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;
let searchTimeouts = {};

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Cannot load data.json');
        }
        airportsData = await response.json();
        filteredData = [...airportsData];
        updateTable();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('tableBody').innerHTML = `
            <tr>
                <td colspan="8" class="no-results">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Không thể tải dữ liệu</h3>
                    <p>Vui lòng kiểm tra file data.json</p>
                </td>
            </tr>
        `;
    }
}

// Remove Vietnamese accents and normalize string
function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .replace(/\s+/g, '');
}

// Setup search input with 500ms delay
function setupSearchInput(inputId) {
    const input = document.getElementById(inputId);
    
    input.addEventListener('input', function() {
        // Clear previous timeout
        if (searchTimeouts[inputId]) {
            clearTimeout(searchTimeouts[inputId]);
        }

        // Set new timeout (500ms delay)
        searchTimeouts[inputId] = setTimeout(() => {
            performSearch();
        }, 500);
    });
}

// Perform search across all fields (case-insensitive, accent-insensitive, space-insensitive)
function performSearch() {
    const citySearch = removeAccents(document.getElementById('searchCity').value);
    const iataSearch = removeAccents(document.getElementById('searchIATA').value);
    const vietnameseSearch = removeAccents(document.getElementById('searchVietnamese').value);
    const englishSearch = removeAccents(document.getElementById('searchEnglish').value);

    filteredData = airportsData.filter(airport => {
        const cityMatch = !citySearch || removeAccents(airport['THÀNH PHỐ']).includes(citySearch);
        const iataMatch = !iataSearch || removeAccents(airport['MÃ IATA']).includes(iataSearch);
        const vietnameseMatch = !vietnameseSearch || removeAccents(airport['TIẾNG VIỆT']).includes(vietnameseSearch);
        const englishMatch = !englishSearch || removeAccents(airport['TIẾNG ANH']).includes(englishSearch);

        return cityMatch && iataMatch && vietnameseMatch && englishMatch;
    });

    currentPage = 1;
    updateTable();
}

// Update table with current page data
function updateTable() {
    const tableBody = document.getElementById('tableBody');
    const totalResults = document.getElementById('totalResults');
    
    totalResults.textContent = filteredData.length;

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    // Check if no results
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Không tìm thấy kết quả</h3>
                    <p>Vui lòng thử với từ khóa khác</p>
                </td>
            </tr>
        `;
        updatePagination();
        return;
    }

    // Generate table rows
    tableBody.innerHTML = pageData.map((airport, index) => {
        const globalIndex = startIndex + index + 1;
        return `
            <tr>
                <td>${globalIndex}</td>
                <td>${airport['THÀNH PHỐ']}</td>
                <td>${airport['MÃ IATA']}</td>
                <td>${truncateText(airport['TIẾNG VIỆT'], globalIndex, 'TIẾNG VIỆT')}</td>
                <td>${truncateText(airport['TIẾNG ANH'], globalIndex, 'TIẾNG ANH')}</td>
                <td>${truncateText(airport['TIẾNG HÀN'], globalIndex, 'TIẾNG HÀN')}</td>
                <td>${truncateText(airport['TIẾNG NHẬT'], globalIndex, 'TIẾNG NHẬT')}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-edit" onclick="editRow(${startIndex + index})">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    updatePagination();
}

// Truncate text and add copy button if needed
function truncateText(text, rowIndex, field, maxLength = 25) {
    if (text.length <= maxLength) {
        return text;
    }
    const truncated = text.substring(0, maxLength) + '...';
    const fullText = text.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    return `
        <span class="text-truncate" title="${fullText}">${truncated}</span>
        <button class="copy-btn" onclick="copyText('${fullText}')">
            <i class="fas fa-copy"></i> Copy
        </button>
    `;
}

// Copy text to clipboard
function copyText(text) {
    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    const decodedText = textarea.value;
    
    navigator.clipboard.writeText(decodedText).then(() => {
        // Show success message
        const btn = event.target.closest('.copy-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.background = '#48bb78';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '#667eea';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Không thể copy. Vui lòng thử lại!');
    });
}

// Edit row function
function editRow(index) {
    const airport = filteredData[index];
    
    // Create a simple prompt-based edit (you can enhance this with a modal later)
    const newVietnamese = prompt('Sửa tên tiếng Việt:', airport['TIẾNG VIỆT']);
    if (newVietnamese !== null && newVietnamese.trim() !== '') {
        airport['TIẾNG VIỆT'] = newVietnamese.trim();
    }
    
    const newEnglish = prompt('Sửa tên tiếng Anh:', airport['TIẾNG ANH']);
    if (newEnglish !== null && newEnglish.trim() !== '') {
        airport['TIẾNG ANH'] = newEnglish.trim();
    }
    
    const newKorean = prompt('Sửa tên tiếng Hàn:', airport['TIẾNG HÀN']);
    if (newKorean !== null && newKorean.trim() !== '') {
        airport['TIẾNG HÀN'] = newKorean.trim();
    }
    
    const newJapanese = prompt('Sửa tên tiếng Nhật:', airport['TIẾNG NHẬT']);
    if (newJapanese !== null && newJapanese.trim() !== '') {
        airport['TIẾNG NHẬT'] = newJapanese.trim();
    }
    
    // Update the display
    updateTable();
}

// Update pagination controls
function updatePagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Trước
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-info">...</span>`;
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                ${i}
            </button>
        `;
    }
    
    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-info">...</span>`;
        }
        paginationHTML += `<button onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Tiếp <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    // Page info
    paginationHTML += `
        <span class="page-info">
            Trang ${currentPage} / ${totalPages}
        </span>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    updateTable();
    
    // Scroll to top of table
    document.querySelector('.table-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load data
    loadData();
    
    // Setup search inputs
    setupSearchInput('searchCity');
    setupSearchInput('searchIATA');
    setupSearchInput('searchVietnamese');
    setupSearchInput('searchEnglish');
});