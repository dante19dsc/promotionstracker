document.addEventListener('DOMContentLoaded', () => {
    
    // --- GLOBAL CONFIGURATION ---
    const competitorConfig = {
        'Hartono': { colorClass: 'hartono', bgColor: '#FFFBEB' },
        'Electronic City': { colorClass: 'electronic-city', bgColor: '#EFF6FF' },
        'Erablue': { colorClass: 'erablue', bgColor: '#F0FDFA' }
    };
    const MONTH_YEAR = '2025-08';

    // --- UTILITY FUNCTIONS ---
    const getPromoCategory = (promo) => {
        const text = (promo.title + ' ' + promo.details).toLowerCase();
        if (text.includes('bank') || text.includes('credit card') || text.includes('cicilan') || text.includes('dbs') || text.includes('mandiri') || text.includes('kredivo') || text.includes('indodana') || text.includes('akulaku') || text.includes('cimb')) return 'Bank & Payment';
        if (text.includes('hp') || text.includes('smartphone') || text.includes('galaxy') || text.includes('foldable') || text.includes('reno') || text.includes('vivo') || text.includes('realme') || text.includes('wearables')) return 'HP & Gadget';
        if (text.includes('laptop') || text.includes('vivobook') || text.includes('acer') || text.includes('lenovo') || text.includes('hp') || text.includes('asus') || text.includes('pc') || text.includes('snapdragon') || text.includes('monitor')) return 'Laptop & PC';
        if (text.includes('tv') || text.includes('soundbar') || text.includes('qled') || text.includes('uhd') || text.includes('google tv') || text.includes('smart tv') || text.includes('speaker')) return 'TV & Audio';
        if (text.includes('refrigerator') || text.includes('kulkas') || text.includes('mesin cuci') || text.includes('washing machine') || text.includes('water heater') || text.includes('air cooler') || text.includes('setrika') || text.includes('rice cooker') || text.includes('cooker') || text.includes('bosch') || text.includes('ac')) return 'Home Appliances';
        if (text.includes('back to school') || text.includes('kembali ke sekolah')) return 'Back to School';
        if (text.includes('independence day') || text.includes('kemerdekaan') || text.includes('17 agustus') || text.includes('merdeka') || text.includes('agustusan')) return 'Independence Day';
        if (text.includes('cctv') || text.includes('smart home') || text.includes('door lock') || text.includes('starlink')) return 'Smart Home & IoT';
        return 'General';
    };

    const getCategoryImageUrl = (category) => {
        let text = '', bgColor = '6B7280';
        switch (category) {
            case 'Bank & Payment': text = 'Bank'; bgColor = '60A5FA'; break;
            case 'HP & Gadget': text = 'Phone'; bgColor = '2DD4BF'; break;
            case 'Laptop & PC': text = 'Laptop'; bgColor = 'FBBF24'; break;
            case 'TV & Audio': text = 'TV'; bgColor = 'F87171'; break;
            case 'Home Appliances': text = 'Home'; bgColor = '34D399'; break;
            case 'Back to School': text = 'School'; bgColor = 'A78BFA'; break;
            case 'Independence Day': text = 'Flag'; bgColor = 'EF4444'; break;
            case 'Smart Home & IoT': text = 'IoT'; bgColor = '818CF8'; break;
            default: text = 'Promo'; bgColor = '9CA3AF'; break;
        }
        return `https://placehold.co/100x100/${bgColor}/ffffff?text=${encodeURIComponent(text)}&font=inter`;
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

    // --- MODAL HANDLING ---
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


    // --- RENDERING FUNCTIONS ---
    const createTimeline = (promotions, competitors, categories) => {
        const container = document.getElementById('timeline-grid');
        if (!container) return;
        container.innerHTML = '';

        // Create header row
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

        // Create rows for each competitor and their categories
        competitors.forEach(compName => {
            const config = competitorConfig[compName] || { colorClass: 'gray', bgColor: '#F9FAFB' };
            
            // Competitor Header Row
            const competitorRow = document.createElement('div');
            competitorRow.className = 'timeline-row';
            competitorRow.innerHTML = `<div class="timeline-label competitor-header">${compName}</div>` + 
                Array(31).fill(`<div class="timeline-cell" style="background-color: ${config.bgColor};"></div>`).join('');
            container.appendChild(competitorRow);

            // Category Rows
            categories.forEach(catName => {
                const categoryPromos = promotions.filter(p => p.competitor === compName && p.category === catName);
                if (categoryPromos.length === 0) return; // Don't render empty rows

                const categoryRow = document.createElement('div');
                categoryRow.className = 'timeline-row';
                const label = `<div class="timeline-label">${catName}</div>`;
                categoryRow.innerHTML = label;

                const dayCells = Array.from({ length: 31 }, () => {
                    const cell = document.createElement('div');
                    cell.className = 'timeline-cell';
                    cell.style.backgroundColor = config.bgColor;
                    return cell;
                });

                categoryPromos.forEach(promo => {
                    const span = calculatePromotionSpan(promo.startDate, promo.endDate);
                    if (span.duration > 0 && dayCells[span.startDay - 1]) {
                        const bar = document.createElement('div');
                        bar.className = `timeline-bar ${config.colorClass}`;
                        bar.style.width = `${(span.duration * 35) - 4}px`; // 35px cell width
                        bar.textContent = promo.title;
                        bar.onclick = () => showModal(promo);
                        dayCells[span.startDay - 1].appendChild(bar);
                    }
                });

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
                        <img src="${promo.imageUrl}" alt="${promo.category}" class="promo-item-img">
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

    // --- DATA FETCHING AND INITIALIZATION ---
    async function initialize() {
        try {
            const response = await fetch('./promotions.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            let promotions = await response.json();
            
            // Process data: add category and image URL
            promotions.forEach(promo => {
                promo.category = getPromoCategory(promo);
                promo.imageUrl = getCategoryImageUrl(promo.category);
            });

            // Get unique, sorted lists of competitors and categories
            const competitors = [...new Set(promotions.map(p => p.competitor))].sort();
            const categories = [...new Set(promotions.map(p => p.category))].sort();

            // Render components
            createTimeline(promotions, competitors, categories);
            renderPromotionCards(promotions, competitors);

        } catch (error) {
            console.error("Failed to load and render promotions:", error);
            const container = document.getElementById('timeline-grid');
            if(container) container.innerHTML = `<p style="color: red; padding: 2rem;">Error: Could not load promotion data. Please check the console.</p>`;
        }
    }

    initialize();
});