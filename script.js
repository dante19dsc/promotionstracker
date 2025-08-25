document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL STATE ---
    let allPromotions = [];
    let allCompetitors = [];
    let allCategories = [];
    let currentDate = new Date('2025-08-01T00:00:00Z');

    // --- BASE CATEGORIES ---
    const baseCategories = [
        'Bank & Payment', 'HP & Gadget', 'Laptop & PC', 'TV & Audio',
        'Home Appliances', 'Back to School', 'National Day',
        'Smart Home & IoT', 'General'
    ];

    // --- DOM ELEMENTS ---
    const detailsModal = document.getElementById('promoModal');
    const detailsModalBody = document.getElementById('modal-body');
    const detailsModalCloseButton = document.getElementById('modalCloseButton');
    const addPromoModal = document.getElementById('addPromoModal');
    const addPromoBtn = document.getElementById('addPromotionBtn');
    const addPromoForm = document.getElementById('addPromoForm');
    const addModalCancelButton = document.getElementById('addModalCancelButton');
    const countrySelector = document.getElementById('countrySelector');
    const monthDisplay = document.getElementById('monthDisplay');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');

    // --- GLOBAL CONFIGURATION ---
    const competitorConfig = {
        'Hartono': { colorClass: 'hartono', bgColor: '#DBEAFE' },
        'Electronic City': { colorClass: 'electronic-city', bgColor: '#DBEAFE' },
        'Erablue': { colorClass: 'erablue', bgColor: '#E0E7FF' },
        'Courts': { colorClass: 'courts', bgColor: '#E0E7FF' },
        'Harvey Norman': { colorClass: 'harvey-norman', bgColor: '#E5E7EB' }
    };
    const API_KEY = '$2a$10$a9opB6cl3g504axvVz6kwOM3WAs4VeFQIsfg7tJnMg.eLeV7I8Zmi';
    const dataSources = {
        id: '68abbd4943b1c97be92887d9',
        sg: 'REPLACE_WITH_SINGAPORE_BIN_ID',
        my: 'REPLACE_WITH_MALAYSIA_BIN_ID'
    };

    // --- UTILITY FUNCTIONS ---
    const getPromoCategory = (promo) => {
        const text = (promo.title + ' ' + promo.details).toLowerCase();
        if (text.includes('bank') || text.includes('credit card') || text.includes('cicilan')) return 'Bank & Payment';
        if (text.includes('hp') || text.includes('smartphone') || text.includes('wearables')) return 'HP & Gadget';
        if (text.includes('laptop') || text.includes('pc') || text.includes('monitor')) return 'Laptop & PC';
        if (text.includes('tv') || text.includes('soundbar') || text.includes('speaker')) return 'TV & Audio';
        if (text.includes('refrigerator') || text.includes('kulkas') || text.includes('mesin cuci') || text.includes('ac')) return 'Home Appliances';
        if (text.includes('back to school')) return 'Back to School';
        if (text.includes('independence day') || text.includes('national day') || text.includes('merdeka')) return 'National Day';
        if (text.includes('smart home') || text.includes('cctv')) return 'Smart Home & IoT';
        return 'General';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Bank & Payment': /* SVG */,
            'HP & Gadget': /* SVG */,
            'Laptop & PC': /* SVG */,
            'TV & Audio': /* SVG */,
            'Home Appliances': /* SVG */,
            'Back to School': /* SVG */,
            'National Day': /* SVG */,
            'Smart Home & IoT': /* SVG */,
            'General': /* SVG */
        };
        // ... (copy SVG content from your original code)
        return icons[category] || icons['General'];
    };

    const calculatePromotionSpan = (startDate, endDate) => {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

        let promoStart = new Date(startDate), promoEnd = new Date(endDate);
        promoStart = promoStart < monthStart ? monthStart : promoStart;
        promoEnd = promoEnd > monthEnd ? monthEnd : promoEnd;

        if (promoStart > promoEnd) return { startDay: -1, duration: 0 };

        const startDay = promoStart.getDate();  // Not getUTCDate
        const duration = promoEnd.getDate() - startDay + 1;
        return { startDay, duration };
    };

    // --- MODAL HANDLING ---
    const showDetailsModal = (promo) => {
        detailsModalBody.innerHTML = `
            <p><strong>Competitor:</strong> ${promo.competitor}</p>
            <p><strong>Title:</strong> ${promo.title}</p>
            <p><strong>Category:</strong> ${promo.category}</p>
            <p><strong>Duration:</strong> ${promo.startDate} to ${promo.endDate}</p>
            <p><strong>Details:</strong> ${promo.details}</p>
            ${promo.url ? `<p><strong>Source:</strong> <a href="${promo.url}" target="_blank" rel="noopener noreferrer">View Promotion</a></p>` : ''}
        `;
        detailsModal.classList.remove('hidden');
    };

    // --- RENDERING FUNCTIONS ---
    const renderAll = () => {
        updateMonthDisplay();
        createTimeline(allPromotions, allCompetitors, allCategories);
        renderPromotionCards(allPromotions, allCompetitors);
    };

    const updateMonthDisplay = () => {
        if (monthDisplay) {
            monthDisplay.textContent = currentDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        }
    };

    const createTimeline = (promotions, competitors, categories) => {
        const container = document.getElementById('timeline-grid');
        if (!container) return;
        container.innerHTML = '';

        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const gridTemplateColumns = `220px repeat(${daysInMonth}, 35px)`;
        const totalWidth = 220 + (daysInMonth * 35);
        container.style.minWidth = `${totalWidth}px`;

        const header = document.createElement('div');
        header.className = 'timeline-header';
        header.style.gridTemplateColumns = gridTemplateColumns;
        let headerHTML = '<div class="timeline-header-cell">Category</div>';
        for (let day = 1; day <= daysInMonth; day++) {
            headerHTML += `<div class="timeline-header-cell">${day}</div>`;
        }
        header.innerHTML = headerHTML;
        container.appendChild(header);

        competitors.forEach(compName => {
            const config = competitorConfig[compName] || { colorClass: 'gray', bgColor: '#F9FAFB' };

            const competitorRow = document.createElement('div');
            competitorRow.className = 'timeline-row';
            competitorRow.style.gridTemplateColumns = gridTemplateColumns;
            competitorRow.innerHTML = `<div class="timeline-label competitor-header">${compName}</div>` +
                Array(daysInMonth).fill(`<div class="timeline-cell" style="background-color: ${config.bgColor};"></div>`).join('');
            container.appendChild(competitorRow);

            categories.forEach(catName => {
                const categoryPromos = promotions.filter(p => p.competitor === compName && p.category === catName);
                if (categoryPromos.length === 0) return;

                const categoryRow = document.createElement('div');
                categoryRow.className = 'timeline-row';
                categoryRow.style.gridTemplateColumns = gridTemplateColumns;
                const label = `<div class="timeline-label">${getCategoryIcon(catName)}<span>${catName}</span></div>`;
                categoryRow.innerHTML = label;

                const dayCells = Array.from({ length: daysInMonth }, () => {
                    const cell = document.createElement('div');
                    cell.className = 'timeline-cell';
                    cell.style.backgroundColor = config.bgColor;
                    return cell;
                });

                // Track bar stack offset for each day
                const dailyPromoCount = Array(daysInMonth + 2).fill(0);

                categoryPromos.forEach(promo => {
                    const span = calculatePromotionSpan(promo.startDate, promo.endDate);
                    if (span.duration > 0 && dayCells[span.startDay - 1]) {
                        // Find the maximum offset across the days this bar covers
                        let offset = 0;
                        for (let i = 0; i < span.duration; i++) {
                            offset = Math.max(offset, dailyPromoCount[span.startDay + i]);
                        }

                        const bar = document.createElement('div');
                        bar.className = `timeline-bar ${config.colorClass}`;
                        bar.style.width = `${(span.duration * 35) - 4}px`;
                        bar.style.top = `${7 + (offset * 28)}px`;
                        bar.textContent = promo.title;
                        bar.onclick = () => showDetailsModal(promo);

                        dayCells[span.startDay - 1].appendChild(bar);

                        // Update offsets for every covered day
                        for (let i = 0; i < span.duration; i++) {
                            dailyPromoCount[span.startDay + i] = offset + 1;
                        }
                    }
                });

                // Set row height based on overlapping bars
                const maxOffset = Math.max(...dailyPromoCount);
                if (maxOffset > 1) {
                    categoryRow.style.minHeight = `${maxOffset * 28 + 12}px`;
                }

                dayCells.forEach(cell => categoryRow.appendChild(cell));
                container.appendChild(categoryRow);
            });
        });
    };

    const renderPromotionCards = (promotions, competitors) => {
        const container = document.getElementById('promo-cards-container');
        if (!container) return;
        container.innerHTML = '';

        competitors.forEach(compName => {
            const compPromotions = promotions.filter(p => p.competitor === compName);
            if (compPromotions.length === 0) return;

            const card = document.createElement('div');
            card.className = 'promo-card';

            let itemsHTML = '';
            compPromotions.forEach(promo => {
                itemsHTML += `
                    <div class="promo-item">
                        <div class="promo-item-icon-wrapper">${getCategoryIcon(promo.category)}</div>
                        <div class="promo-item-details">
                            <div class="promo-item-title">${promo.title}</div>
                            <div class="promo-item-category">${promo.category}</div>
                            <p class="promo-item-description">${promo.details}</p>
                            <p class="promo-item-description" style="font-size: 0.75rem; color: #9CA3AF; margin-top: 0.25rem;">
                                ${promo.startDate} to ${promo.endDate}
                            </p>
                        </div>
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="promo-card-header">${compName}</div>
                <div class="promo-card-content">${itemsHTML}</div>
            `;
            container.appendChild(card);
        });
    };

    const populateFormDropdowns = () => {
        const competitorSelect = document.getElementById('competitor');
        const categorySelect = document.getElementById('category');
        if (competitorSelect) {
            competitorSelect.innerHTML = allCompetitors.map(c => `<option value="${c}">${c}</option>`).join('');
        }
        if (categorySelect) {
            // Always include base categories for robustness
            const allCats = [...new Set([...allCategories, ...baseCategories])].sort();
            categorySelect.innerHTML = allCats.map(c => `<option value="${c}">${c}</option>`).join('');
        }
    };

    // --- DATA FETCHING AND INITIALIZATION ---
    async function initialize(countryCode) {
        addPromoBtn.disabled = true;
        const binId = dataSources[countryCode];
        if (!binId || binId.startsWith('REPLACE_WITH')) {
            const timelineGrid = document.getElementById('timeline-grid');
            timelineGrid.innerHTML = `<div style="padding: 2rem; text-align: center; color: #9A3412; background-color: #FFEDD5; border-radius: 0.5rem;"><p><strong>Configuration needed:</strong> Please update the 'script.js' file with a valid Bin ID for the selected country.</p></div>`;
            document.getElementById('promo-cards-container').innerHTML = '';
            return;
        }

        const url = `https://api.jsonbin.io/v3/b/${binId}/latest`;

        try {
            const response = await fetch(url, { headers: { 'X-Master-Key': API_KEY } });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}. Check API Key and Bin ID.`);

            const data = await response.json();
            const promotions = data.record;

            if (!Array.isArray(promotions)) throw new Error("Fetched data is not an array.");

            allPromotions = promotions.map(promo => ({...promo, category: getPromoCategory(promo) }));
            allCompetitors = [...new Set(allPromotions.map(p => p.competitor))].sort();
            allCategories = [...new Set([...allPromotions.map(p => p.category), ...baseCategories])].sort();

            populateFormDropdowns();
            renderAll();
            addPromoBtn.disabled = false;

        } catch (error) {
            console.error(`Failed to load promotions from Bin ID ${binId}:`, error);
            const timelineGrid = document.getElementById('timeline-grid');
            timelineGrid.innerHTML = `<div style="padding: 2rem; text-align: center; color: #991B1B; background-color: #FEF2F2; border-radius: 0.5rem;"><p><strong>Error:</strong> Could not load promotion data.</p><p>${error.message}</p></div>`;
            document.getElementById('promo-cards-container').innerHTML = '';
        }
    }

    // --- SETUP EVENT LISTENERS ---
    function setupEventListeners() {
        if (detailsModalCloseButton) detailsModalCloseButton.onclick = () => detailsModal.classList.add('hidden');
        if (detailsModal) detailsModal.onclick = (e) => { if (e.target === detailsModal) detailsModal.classList.add('hidden'); };

        if (addModalCancelButton) addModalCancelButton.onclick = () => addPromoModal.classList.add('hidden');
        if (addPromoModal) addPromoModal.onclick = (e) => { if (e.target === addPromoModal) addPromoModal.classList.add('hidden'); };

        if (addPromoBtn) {
            addPromoBtn.addEventListener('click', () => {
                addPromoForm.reset();
                addPromoModal.classList.remove('hidden');
            });
        }

        if (addPromoForm) {
            addPromoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(addPromoForm);
                const newPromo = {
                    competitor: formData.get('competitor'),
                    title: formData.get('title'),
                    startDate: formData.get('startDate'),
                    endDate: formData.get('endDate'),
                    details: formData.get('details'),
                    category: formData.get('category'),
                    url: ''
                };
                allPromotions.push(newPromo);
                // Always update competitors/categories on add
                allCompetitors = [...new Set(allPromotions.map(p => p.competitor))].sort();
                allCategories = [...new Set([...allPromotions.map(p => p.category), ...baseCategories])].sort();
                populateFormDropdowns();
                renderAll();
                addPromoModal.classList.add('hidden');
            });
        }

        if (countrySelector) {
            countrySelector.addEventListener('change', (event) => {
                initialize(event.target.value);
            });
        }

        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderAll();
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderAll();
            });
        }
    }

    // --- INITIAL LOAD ---
    setupEventListeners();
    initialize(countrySelector.value);
});
