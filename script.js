document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL STATE ---
    let allPromotions = [];
    let allCompetitors = [];
    let allCategories = [];
    let currentDate = new Date('2025-08-01T00:00:00Z');

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

    const baseCategories = [
        'Bank & Payment', 'HP & Gadget', 'Laptop & PC',
        'TV & Audio', 'Home Appliances', 'Back to School',
        'National Day', 'Smart Home & IoT', 'General'
    ];


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
            'Bank & Payment': `<svg class="icon" viewBox="0 0 24 24"><path fill="#C7D2FE" d="M4 8h16v2H4z"/><path fill="#4F46E5" d="M20 6H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2zm0 12H4V10h16v8zm-8-2h2v-4h-2v4z"/></svg>`,
            'HP & Gadget': `<svg class="icon" viewBox="0 0 24 24"><path fill="#A7F3D0" d="M8 3h8v11H8z"/><path fill="#10B981" d="M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zm-5 18a1 1 0 110-2 1 1 0 010 2zm3-3H9V4h6v13z"/></svg>`,
            'Laptop & PC': `<svg class="icon" viewBox="0 0 24 24"><path fill="#FDE68A" d="M4 5h16v10H4z"/><path fill="#F59E0B" d="M22 15H2a2 2 0 00-2 2v1h24v-1a2 2 0 00-2-2zM20 4H4a2 2 0 00-2 2v10h20V6a2 2 0 00-2-2z"/></svg>`,
            'TV & Audio': `<svg class="icon" viewBox="0 0 24 24"><path fill="#FECACA" d="M5 7h14v8H5z"/><path fill="#EF4444" d="M21 5H3a2 2 0 00-2 2v10a2 2 0 002 2h4l-1.8 2.7A1 1 0 006 23h12a1 1 0 00.8-1.6L17 19h4a2 2 0 002-2V7a2 2 0 00-2-2zM5 15V7h14v8H5z"/></svg>`,
            'Home Appliances': `<svg class="icon" viewBox="0 0 24 24"><path fill="#A7F3D0" d="M15 15h-2v4h2v-4zm-4 0H9v4h2v-4z"/><path fill="#10B981" d="M18 3H6a2 2 0 00-2 2v16h16V5a2 2 0 00-2-2zm-8 2h4v3h-4V5zM8 19v-4h8v4H8z"/></svg>`,
            'Back to School': `<svg class="icon" viewBox="0 0 24 24"><path fill="#DDD6FE" d="M6 4h12v16H6z"/><path fill="#8B5CF6" d="M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm-6 4l-3 4h6l-3-4z"/></svg>`,
            'National Day': `<svg class="icon" viewBox="0 0 24 24"><path fill="#FECACA" d="M5 5h14v6H5z"/><path fill="#DC2626" d="M5 3h1a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1zm15 2v6H6V5h14z"/></svg>`,
            'Smart Home & IoT': `<svg class="icon" viewBox="0 0 24 24"><path fill="#C7D2FE" d="M12 10a2 2 0 100 4 2 2 0 000-4z"/><path fill="#4F46E5" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15a5 5 0 110-10 5 5 0 010 10z"/><path fill="#C7D2FE" d="M12 10a2 2 0 100 4 2 2 0 000-4z"/></svg>`,
            'General': `<svg class="icon" viewBox="0 0 24 24"><path fill="#E5E7EB" d="M6 4h12v12H6z"/><path fill="#6B7280" d="M18 2H6a2 2 0 00-2 2v12a2 2 0 002 2h4v4l4-4h4a2 2 0 002-2V4a2 2 0 00-2-2zm0 14H6V4h12v12z"/></svg>`
        };
        return icons[category] || icons['General'];
    };

    const calculatePromotionSpan = (startDate, endDate) => {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        let promoStart = new Date(startDate), promoEnd = new Date(endDate);
        promoStart = promoStart < monthStart ? monthStart : promoStart;
        promoEnd = promoEnd > monthEnd ? monthEnd : promoEnd;

        if (promoStart > promoEnd) return { startDay: -1, duration: 0 };
        
        const startDay = promoStart.getDate();
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
                
                const dailyPromoCount = Array(daysInMonth + 1).fill(0);

                categoryPromos.forEach(promo => {
                    const span = calculatePromotionSpan(promo.startDate, promo.endDate);
                    if (span.duration > 0 && dayCells[span.startDay - 1]) {
                        const offset = Math.max(...dailyPromoCount.slice(span.startDay, span.startDay + span.duration));
                        const bar = document.createElement('div');
                        bar.className = `timeline-bar ${config.colorClass}`;
                        bar.style.width = `${(span.duration * 35) - 4}px`;
                        bar.style.top = `${7 + (offset * 28)}px`;
                        bar.textContent = promo.title;
                        bar.onclick = () => showDetailsModal(promo);
                        
                        dayCells[span.startDay - 1].appendChild(bar);

                        // Update offsets for all days in span
                        for (let i = 0; i < span.duration; i++) {
                            if (span.startDay + i <= daysInMonth) {
                                dailyPromoCount[span.startDay + i]++;
                            }
                        }
                    }
                });

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
            categorySelect.innerHTML = allCategories.map(c => `<option value="${c}">${c}</option>`).join('');
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
                allCompetitors = [...new Set(allPromotions.map(p => p.competitor))].sort();
                allCategories = [...new Set([...allPromotions.map(p => p.category), ...baseCategories])].sort();
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
