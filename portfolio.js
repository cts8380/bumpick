document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioGallery = document.getElementById('portfolioGallery');

    // 성능 최적화를 위한 변수들
    let lastPortfolioHash = '';
    let isUpdating = false;
    let updateTimeout = null;

    // 초기화
    init();

    function init() {
        // 기본 포트폴리오 데이터 초기화
        initializeDefaultPortfolios();
        
        // 포트폴리오 갤러리 로드
        loadPortfolioGallery();
        
        // 이벤트 리스너 설정
        setupEventListeners();
        
        // 실시간 업데이트 시작 (최적화된 버전)
        startOptimizedRealTimeUpdates();
    }

    function initializeDefaultPortfolios() {
        const existingPortfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
        
        if (existingPortfolios.length === 0) {
            const defaultPortfolios = [
                {
                    id: 1,
                    title: '로맨틱 커플 스냅',
                    location: '한강공원 · 골든아워',
                    category: 'couple',
                    image: 'images/IMG_2048.jpg',
                    details: '황금빛 노을을 배경으로 한 로맨틱한 커플 촬영입니다. 자연스러운 포즈와 따뜻한 조명이 어우러져 특별한 순간을 담았습니다. 한강공원의 넓은 공간과 아름다운 석양이 만들어내는 환상적인 분위기 속에서 두 분의 사랑스러운 모습을 포착했습니다.',
                    additionalImages: []
                },
                {
                    id: 2,
                    title: '따뜻한 가족 사진',
                    location: '서울숲 · 오후 햇살',
                    category: 'family',
                    image: 'images/IMG_2047.jpg',
                    details: '가족의 소중한 순간을 자연스럽게 담은 촬영입니다. 아이들의 밝은 웃음과 부모님의 따뜻한 미소가 인상적입니다. 서울숲의 푸른 자연을 배경으로 가족 간의 사랑과 행복이 가득한 순간들을 아름답게 기록했습니다.',
                    additionalImages: []
                },
                {
                    id: 3,
                    title: '개인 프로필 촬영',
                    location: '경복궁 · 전통미',
                    category: 'individual',
                    image: 'images/IMG_2046.jpg',
                    details: '한국의 전통미를 살린 개인 프로필 촬영입니다. 고궁의 아름다운 배경과 한복이 조화를 이루어 우아한 분위기를 연출했습니다. 경복궁의 웅장한 건축미와 전통 한복의 우아함이 어우러져 품격 있는 프로필 사진을 완성했습니다.',
                    additionalImages: []
                },
                {
                    id: 4,
                    title: '자연스러운 커플 스냅',
                    location: '남산타워 · 야경',
                    category: 'couple',
                    image: 'images/IMG_2048.jpg',
                    details: '서울의 야경을 배경으로 한 로맨틱한 커플 촬영입니다. 남산타워의 화려한 조명과 도시의 불빛이 만들어내는 환상적인 분위기 속에서 두 분의 특별한 순간을 담았습니다.',
                    additionalImages: []
                },
                {
                    id: 5,
                    title: '웨딩 스냅',
                    location: '덕수궁 · 클래식',
                    category: 'wedding',
                    image: 'images/IMG_2047.jpg',
                    details: '덕수궁의 고전적인 아름다움을 배경으로 한 웨딩 촬영입니다. 신랑신부의 행복한 모습과 고궁의 우아한 분위기가 조화를 이루어 평생 간직할 소중한 추억을 만들었습니다.',
                    additionalImages: []
                },
                {
                    id: 6,
                    title: '행복한 가족 순간',
                    location: '올림픽공원 · 봄날',
                    category: 'family',
                    image: 'images/IMG_2046.jpg',
                    details: '봄날의 올림픽공원에서 촬영한 가족 사진입니다. 만개한 벚꽃과 따뜻한 봄 햇살 아래에서 가족 모두의 밝은 웃음과 행복한 순간들을 자연스럽게 포착했습니다.',
                    additionalImages: []
                }
            ];
            localStorage.setItem('portfolios', JSON.stringify(defaultPortfolios));
        }
    }

    function generatePortfolioHash(portfolios) {
        // 포트폴리오 데이터의 해시를 생성하여 변경 감지
        return JSON.stringify(portfolios.map(p => ({ id: p.id, title: p.title, category: p.category })));
    }

    function loadPortfolioGallery(category = 'all', forceUpdate = false) {
        if (isUpdating && !forceUpdate) return;
        
        const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
        const currentHash = generatePortfolioHash(portfolios);
        
        // 데이터가 변경되지 않았고 카테고리도 같으면 업데이트하지 않음
        if (currentHash === lastPortfolioHash && !forceUpdate) {
            // 카테고리 필터링만 적용
            filterPortfolios(category);
            return;
        }
        
        isUpdating = true;
        lastPortfolioHash = currentHash;
        
        // 갤러리 업데이트
        updatePortfolioGallery(portfolios, category);
        
        isUpdating = false;
    }

    function updatePortfolioGallery(portfolios, category = 'all') {
        if (!portfolioGallery) return;
        
        // 카테고리 필터링
        const filteredPortfolios = category === 'all' 
            ? portfolios 
            : portfolios.filter(p => p.category === category);
        
        if (filteredPortfolios.length === 0) {
            portfolioGallery.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 2rem; grid-column: 1/-1;">포트폴리오가 없습니다.</p>';
            return;
        }
        
        // 기존 아이템들과 비교하여 부분 업데이트
        const existingItems = portfolioGallery.querySelectorAll('.portfolio-item');
        const existingIds = Array.from(existingItems).map(item => item.dataset.id);
        const newIds = filteredPortfolios.map(p => p.id.toString());
        
        // 삭제된 아이템 제거
        existingItems.forEach(item => {
            if (!newIds.includes(item.dataset.id)) {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => item.remove(), 300);
            }
        });
        
        // 새로운 아이템 추가 또는 기존 아이템 업데이트
        filteredPortfolios.forEach(portfolio => {
            const existingItem = portfolioGallery.querySelector(`[data-id="${portfolio.id}"]`);
            
            if (existingItem) {
                // 기존 아이템 업데이트 (내용이 변경된 경우에만)
                updatePortfolioItem(existingItem, portfolio);
            } else {
                // 새로운 아이템 생성
                const newItem = createPortfolioItem(portfolio);
                portfolioGallery.appendChild(newItem);
                
                // 새 아이템 애니메이션
                setTimeout(() => {
                    newItem.style.opacity = '1';
                    newItem.style.transform = 'translateY(0) scale(1)';
                }, 100);
            }
        });
    }

    function updatePortfolioItem(item, portfolio) {
        const img = item.querySelector('img');
        const title = item.querySelector('h4');
        const location = item.querySelector('p');
        
        if (img && img.src !== portfolio.image) img.src = portfolio.image;
        if (title && title.textContent !== portfolio.title) title.textContent = portfolio.title;
        if (location && location.textContent !== portfolio.location) location.textContent = portfolio.location;
    }

    function createPortfolioItem(portfolio) {
        const item = document.createElement('div');
        item.className = 'portfolio-item';
        item.dataset.id = portfolio.id;
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px) scale(0.9)';
        item.style.transition = 'all 0.6s ease';
        
        item.innerHTML = `
            <img src="${portfolio.image}" alt="${portfolio.title}" onerror="this.style.display='none'; this.parentNode.style.background='#f5f5f5';">
            <div class="portfolio-overlay">
                <h4>${portfolio.title}</h4>
                <p>${portfolio.location}</p>
                <span class="view-btn" onclick="viewPortfolioDetail(${portfolio.id})">자세히 보기</span>
            </div>
        `;
        
        return item;
    }

    function filterPortfolios(category) {
        // 필터 버튼 활성화
        filterBtns.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        // 포트폴리오 아이템 필터링
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            const itemCategory = getItemCategory(item.dataset.id);
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function getItemCategory(itemId) {
        const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
        const portfolio = portfolios.find(p => p.id.toString() === itemId);
        return portfolio ? portfolio.category : '';
    }

    function startOptimizedRealTimeUpdates() {
        // 5초마다 포트폴리오 업데이트 확인 (성능 개선)
        setInterval(() => {
            if (!isUpdating) {
                const currentCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
                loadPortfolioGallery(currentCategory);
            }
        }, 5000);

        // BroadcastChannel로 즉시 업데이트
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('portfolio-updates');
            channel.onmessage = function(event) {
                if (event.data.type === 'portfolioUpdated') {
                    // 디바운싱으로 중복 업데이트 방지
                    clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(() => {
                        const currentCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
                        loadPortfolioGallery(currentCategory, true);
                    }, 200);
                }
            };
        }

        // 페이지 포커스 시에만 업데이트
        let isPageVisible = true;
        document.addEventListener('visibilitychange', () => {
            isPageVisible = !document.hidden;
            if (isPageVisible && !isUpdating) {
                const currentCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
                loadPortfolioGallery(currentCategory, true);
            }
        });

        // 윈도우 포커스 시 업데이트
        window.addEventListener('focus', () => {
            if (!isUpdating) {
                setTimeout(() => {
                    const currentCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
                    loadPortfolioGallery(currentCategory, true);
                }, 300);
            }
        });
    }

    function setupEventListeners() {
        // 헤더 스크롤 효과 (최적화)
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 100) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        // 모바일 메뉴 토글
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.background = 'white';
                nav.style.flexDirection = 'column';
                nav.style.padding = '1rem';
                nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            });
        }

        // 필터 버튼 이벤트
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                loadPortfolioGallery(category, true);
            });
        });

        // 포트폴리오 업데이트 이벤트 리스너 (관리자 페이지에서 발생)
        window.addEventListener('portfolioUpdated', () => {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                const currentCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
                loadPortfolioGallery(currentCategory, true);
            }, 200);
        });

        // localStorage 변경 감지 (다른 탭에서 변경 시)
        window.addEventListener('storage', (e) => {
            if (e.key === 'portfolios') {
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(() => {
                    const currentCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
                    loadPortfolioGallery(currentCategory, true);
                }, 200);
            }
        });
    }

    // 전역 함수로 포트폴리오 상세 페이지 이동
    window.viewPortfolioDetail = function(id) {
        window.location.href = `portfolio_detail.html?id=${id}`;
    };
});