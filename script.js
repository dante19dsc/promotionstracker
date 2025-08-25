document.addEventListener('DOMContentLoaded', () => {
    
    // --- GLOBAL CONFIGURATION ---
    const competitorConfig = {
        'Hartono': { colorClass: 'hartono', bgColor: '#FFFBEB' },
        'Electronic City': { colorClass: 'electronic-city', bgColor: '#EFF6FF' },
        'Erablue': { colorClass: 'erablue', bgColor: '#F0FDFA' },
        'Courts': { colorClass: 'hartono', bgColor: '#FEF2F2' },
        'Harvey Norman': { colorClass: 'electronic-city', bgColor: '#F0F9FF' }
    };
    const MONTH_YEAR = '2025-08';

    // --- NEW: DATA SOURCE CONFIGURATION ---
    // 1. PASTE YOUR API KEY HERE
    const API_KEY = '$2a$10$a9opB6cl3g504axvVz6kwOM3WAs4VeFQIsfg7tJnMg.eLeV7I8Zmi';

    // 2. PASTE THE UNIQUE BIN ID FOR EACH COUNTRY'S JSON FILE HERE
    const dataSources = {
        id: 'REPLACE_WITH_INDONESIA_BIN_ID', // Bin ID for promotions_id.json
        sg: 'REPLACE_WITH_SINGAPORE_BIN_ID', // Bin ID for promotions_sg.json
        my: 'REPLACE_WITH_MALAYSIA_BIN_ID'  // Bin ID for promotions_my.json
    };


    // --- UTILITY FUNCTIONS (No changes here) ---
    const getPromoCategory = (promo) => {
        const text = (promo.title + ' ' + promo.details).toLowerCase();
        if (text.includes('bank') || text.includes('credit card') || text.includes('cicilan') || text.includes('dbs') || text.includes('mandiri') || text.includes('kredivo') || text.includes('indodana') || text.includes('akulaku') || text.includes('cimb')) return 'Bank & Payment';
        if (text.includes('hp') || text.includes('smartphone') || text.includes('galaxy') || text.includes('foldable') || text.includes('reno') || text.includes('vivo') || text.includes('realme') || text.includes('wearables')) return 'HP & Gadget';
        if (text.includes('laptop') || text.includes('vivobook') || text.includes('acer') || text.includes('lenovo') || text.includes('hp') || text.includes('asus') || text.includes('pc') || text.includes('snapdragon') || text.includes('monitor')) return 'Laptop & PC';
        if (text.includes('tv') || text.includes('soundbar') || text.includes('qled') || text.includes('uhd') || text.includes('google tv') || text.includes('smart tv') || text.includes('speaker')) return 'TV & Audio';
        if (text.includes('refrigerator') || text.includes('kulkas') || text.includes('mesin cuci') || text.includes('washing machine') || text.includes('water heater') || text.includes('air cooler') || text.includes('setrika') || text.includes('rice cooker') || text.includes('cooker') || text.includes('bosch') || text.includes('ac')) return 'Home Appliances';
        if (text.includes('back to school') || text.includes('kembali ke sekolah')) return 'Back to School';
        if (text.includes('independence day') || text.includes('kemerdekaan') || text.includes('17 agustus') || text.includes('merdeka') || text.includes('agustusan') || text.includes('national day')) return 'National Day';
        if (text.includes('cctv') || text.includes('smart home') || text.includes('door lock') || text.includes('starlink')) return 'Smart Home & IoT';
        return 'General';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Bank & Payment': `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>`,
            'HP & Gadget': `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`,
            'Laptop & PC': `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
            'TV & Audio': `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`,
            'Home Appliances': `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`,
            'Back to School': `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`,
            'National Day': `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>`,
            'Smart Home & IoT': `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M1.394 9.343a15 15 0 0121.213 0"></path></svg>`,
            'General': `<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>`
        };
        return icons[category] || icons['General'];
    };

    const calculatePromotionSpan = (startDate, endDate) => {
        const monthStart = new Date(`${MONTH_YEAR}-01T00:00:00Z`);
        const monthEnd = new Date(monthStart);
        monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1);
        monthEnd.setUTCDate(0);
        monthEnd.setUTCHours(23, 59, 59);

        let promoStart = new Date(startDate), promoEnd = new Date(endDate);
        promoStart = promoStart < monthStart ? monthStart : promoStart;
        promoEnd = promoEnd > monthEnd ? monthEnd : promoEnd;

        if (promoStart > promoEnd) return { startDay: -1, duration: 0 };
        
        const startDay = promoStart.getUTCDate();
        const duration = promoEnd.getUTCDate() - startDay + 1;
        return { startDay, duration };
    };
    
    // --- MODAL HANDLING (No changes here) ---
    const modal = document.getElementById('promoModal');
    const modalBody = document.getElementById('modal-body');
    const modalCloseButton = document.getElementById('modalCloseButton');
    
    const showModal = (promo) => {
        modalBody.innerHTML = `
            <p><strong>Competitor:</strong> ${promo.competitor}</p>
            <p><strong>Title:</strong> ${promo.title}</p>
            <p><strong>Category:</strong> ${promo.category}</p>
            <p><strong>Duration:</strong> ${promo.startDate} to ${promo.endDate}</p>
            <p><strong>Details:</strong> ${promo.details}</p>
            ${promo.url ? `<p><strong>Source:</strong> <a href="${promo.url}" target="_blank" rel="noopener noreferrer">View Promotion</a></p>` : ''}
        `;
        modal.classList.remove('hidden');
    };

    modalCloseButton.onclick = () => modal.classList.add('hidden');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };


    // --- RENDERING FUNCTIONS (No changes here) ---
    const createTimeline = (promotions, competitors, categories) => {
        const container = document.getElementById('timeline-grid');
        if (!container) return;
        container.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'timeline-header';
        let headerHTML = '<div class="timeline-header-cell">Category</div>';
        const today = new Date();
        const currentDayOfMonth = (today.getFullYear() === 2025 && today.getMonth() === 7) ? today.getDate() : -1;

        for (let day = 1; day <= 31; day++) {
            let specialClass = '';
            if (day === currentDayOfMonth) specialClass = 'today';
            else if (day === 17) specialClass = 'independence-day';
            headerHTML += `<div class="timeline-header-cell ${specialClass}">${day}</div>`;
        }
        header.innerHTML = headerHTML;
        container.appendChild(header);

        competitors.forEach(compName => {
            const config = competitorConfig[compName] || { colorClass: 'gray', bgColor: '#F9FAFB' };
            
            const competitorRow = document.createElement('div');
            competitorRow.className = 'timeline-row';
            competitorRow.innerHTML = `<div class="timeline-label competitor-header">${compName}</div>` + 
                Array(31).fill(`<div class="timeline-cell" style="background-color: ${config.bgColor};"></div>`).join('');
            container.appendChild(competitorRow);

            categories.forEach(catName => {
                const categoryPromos = promotions.filter(p => p.competitor === compName && p.category === catName);
                if (categoryPromos.length === 0) return;

                const categoryRow = document.createElement('div');
                categoryRow.className = 'timeline-row';
                const label = `<div class="timeline-label">${getCategoryIcon(catName)}<span>${catName}</span></div>`;
                categoryRow.innerHTML = label;

                const dayCells = Array.from({ length: 31 }, () => {
                    const cell = document.createElement('div');
                    cell.className = 'timeline-cell';
                    cell.style.backgroundColor = config.bgColor;
                    return cell;
                });
                
                const dailyPromoCount = Array(32).fill(0);

                categoryPromos.forEach(promo => {
                    const span = calculatePromotionSpan(promo.startDate, promo.endDate);
                    if (span.duration > 0 && dayCells[span.startDay - 1]) {
                        const bar = document.createElement('div');
                        const offset = dailyPromoCount[span.startDay];
                        
                        bar.className = `timeline-bar ${config.colorClass}`;
                        bar.style.width = `${(span.duration * 35) - 4}px`;
                        bar.style.top = `${7 + (offset * 28)}px`;
                        bar.textContent = promo.title;
                        bar.onclick = () => showModal(promo);
                        
                        dayCells[span.startDay - 1].appendChild(bar);

                        for(let i = 0; i < span.duration; i++) {
                            dailyPromoCount[span.startDay + i]++;
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

    // --- DATA FETCHING AND INITIALIZATION (UPDATED) ---
    async function initialize(countryCode) {
        const binId = dataSources[countryCode];
        if (!binId || binId.startsWith('REPLACE_WITH')) {
            const timelineGrid = document.getElementById('timeline-grid');
            timelineGrid.innerHTML = `<div style="padding: 2rem; text-align: center; color: #9A3412; background-color: #FFEDD5; border-radius: 0.5rem;">
                <p><strong>Configuration needed:</strong> Please update the 'script.js' file with a valid Bin ID for the selected country.</p>
            </div>`;
            document.getElementById('promo-cards-container').innerHTML = '';
            return;
        }

        const url = `https://api.jsonbin.io/v3/b/${binId}/latest`;

        try {
            const response = await fetch(url, {
                headers: {
                    'X-Master-Key': API_KEY
                }
            });

            if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}. Check your API Key and Bin ID.`);
            }
            
            // JSONBin nests the actual data inside a 'record' property
            const data = await response.json();
            const promotions = data.record; 

            if (!Array.isArray(promotions)) {
                throw new Error("The fetched data is not an array. Check your JSON format in the bin.");
            }
            
            promotions.forEach(promo => {
                promo.category = getPromoCategory(promo);
            });

            const competitors = [...new Set(promotions.map(p => p.competitor))].sort();
            const categories = [...new Set(promotions.map(p => p.category))].sort();

            createTimeline(promotions, competitors, categories);
            renderPromotionCards(promotions, competitors);

        } catch (error) {
            console.error(`Failed to load and render promotions from Bin ID ${binId}:`, error);
            const timelineGrid = document.getElementById('timeline-grid');
            const cardsContainer = document.getElementById('promo-cards-container');
            const errorMessage = `<div style="padding: 2rem; text-align: center; color: #991B1B; background-color: #FEF2F2; border-radius: 0.5rem;">
                <p><strong>Error:</strong> Could not load promotion data.</p>
                <p>${error.message}</p>
            </div>`;
            if(timelineGrid) timelineGrid.innerHTML = errorMessage;
            if(cardsContainer) cardsContainer.innerHTML = '';
        }
    }

    // --- EVENT LISTENERS ---
    const countrySelector = document.getElementById('countrySelector');
    countrySelector.addEventListener('change', (event) => {
        initialize(event.target.value);
    });

    // Initial load
    initialize(countrySelector.value);
});
