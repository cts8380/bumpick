document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const currentDateElement = document.getElementById('current-date');
    const tomorrowDateElement = document.getElementById('tomorrow-date');
    const dayAfterTomorrowDateElement = document.getElementById('day-after-tomorrow-date');
    const dayAfterTomorrowSection = document.getElementById('day-after-tomorrow-section');

    // 성능 최적화를 위한 변수들
    let lastLocationHash = '';
    let isUpdating = false;
    let updateTimeout = null;

    // 초기화
    init();

    function init() {
        // 날짜 표시
        displayDates();
        
        // 기본 위치 데이터 초기화
        initializeDefaultLocations();
        
        // 위치 목록 로드
        loadLocationGrids();
        
        // 이벤트 리스너 설정
        setupEventListeners();
        
        // 실시간 업데이트 시작 (최적화된 버전)
        startOptimizedRealTimeUpdates();
    }

    function displayDates() {
        // 현재 날짜 표시
        const today = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long' 
        };
        currentDateElement.textContent = today.toLocaleDateString('ko-KR', options);

        // 내일 날짜 표시
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        tomorrowDateElement.textContent = tomorrow.toLocaleDateString('ko-KR', options);

        // 내일모레 날짜 표시
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);
        dayAfterTomorrowDateElement.textContent = dayAfterTomorrow.toLocaleDateString('ko-KR', options);
    }

    function initializeDefaultLocations() {
        const existingLocations = JSON.parse(localStorage.getItem('locations') || '[]');
        
        if (existingLocations.length === 0) {
            const defaultLocations = [
                // 오늘 위치들
                {
                    id: 1,
                    name: '서울숲',
                    time: '오후 3시 ~ 6시',
                    description: '자연과 도시가 어우러진 아름다운 배경으로 사계절 내내 인기가 높은 촬영지입니다.',
                    icon: '📍',
                    features: '자연광, 넓은 공간, 주차 가능',
                    day: 'today',
                    featured: true
                },
                {
                    id: 2,
                    name: '한강공원',
                    time: '오후 5시 ~ 7시',
                    description: '황금빛 노을과 함께하는 로맨틱한 순간을 담을 수 있는 최고의 장소입니다.',
                    icon: '🌅',
                    features: '골든아워, 강변 뷰, 접근성 좋음',
                    day: 'today'
                },
                {
                    id: 3,
                    name: '경복궁',
                    time: '오전 10시 ~ 12시',
                    description: '전통과 현대가 만나는 특별한 공간에서 한국의 아름다움을 담아보세요.',
                    icon: '🏛️',
                    features: '전통미, 한복 촬영, 문화재',
                    day: 'today'
                },
                // 내일 위치들
                {
                    id: 4,
                    name: '여의도공원',
                    time: '오후 2시 ~ 5시',
                    description: '계절별 다양한 꽃과 나무들이 아름다운 배경을 만들어주는 도심 속 힐링 공간입니다.',
                    icon: '🌸',
                    features: '계절감, 벚꽃, 산책로',
                    day: 'tomorrow'
                },
                {
                    id: 5,
                    name: '남산타워',
                    time: '오후 6시 ~ 8시',
                    description: '서울의 야경을 배경으로 한 로맨틱한 촬영이 가능한 대표적인 랜드마크입니다.',
                    icon: '🏙️',
                    features: '야경, 도시 뷰, 랜드마크',
                    day: 'tomorrow'
                },
                {
                    id: 6,
                    name: '반포한강공원',
                    time: '오후 7시 ~ 9시',
                    description: '무지개분수와 함께하는 특별한 촬영으로 독특하고 화려한 배경을 연출할 수 있습니다.',
                    icon: '🌊',
                    features: '분수쇼, 야간 촬영, 특별함',
                    day: 'tomorrow'
                }
            ];
            localStorage.setItem('locations', JSON.stringify(defaultLocations));
        }
    }

    function generateLocationHash(locations) {
        // 위치 데이터의 해시를 생성하여 변경 감지
        return JSON.stringify(locations.map(l => ({ id: l.id, name: l.name, day: l.day })));
    }

    function loadLocationGrids(forceUpdate = false) {
        if (isUpdating && !forceUpdate) return;
        
        const locations = JSON.parse(localStorage.getItem('locations') || '[]');
        const currentHash = generateLocationHash(locations);
        
        // 데이터가 변경되지 않았으면 업데이트하지 않음
        if (currentHash === lastLocationHash && !forceUpdate) {
            return;
        }
        
        isUpdating = true;
        lastLocationHash = currentHash;
        
        // 날짜별로 위치 분리
        const todayLocations = locations.filter(loc => loc.day === 'today' || !loc.day);
        const tomorrowLocations = locations.filter(loc => loc.day === 'tomorrow');
        const dayAfterTomorrowLocations = locations.filter(loc => loc.day === 'dayAfterTomorrow');
        
        // 각 그리드 업데이트
        updateLocationGrid('today-grid', todayLocations);
        updateLocationGrid('tomorrow-grid', tomorrowLocations);
        updateLocationGrid('day-after-tomorrow-grid', dayAfterTomorrowLocations);
        
        // 내일모레 섹션 표시/숨김 처리
        if (dayAfterTomorrowLocations.length > 0) {
            dayAfterTomorrowSection.style.display = 'block';
        } else {
            dayAfterTomorrowSection.style.display = 'none';
        }
        
        // 예약 버튼 이벤트 재설정
        setupReservationButtons();
        
        // 애니메이션 재적용 (새로운 아이템에만)
        applyScrollAnimationsToNewItems();
        
        isUpdating = false;
    }

    function updateLocationGrid(gridId, locations) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        
        const existingCards = grid.querySelectorAll('.location-card');
        const existingIds = Array.from(existingCards).map(card => card.dataset.id);
        const newIds = locations.map(l => l.id.toString());
        
        // 삭제된 카드 제거
        existingCards.forEach(card => {
            if (!newIds.includes(card.dataset.id)) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => card.remove(), 300);
            }
        });
        
        // 새로운 카드 추가 또는 기존 카드 업데이트
        locations.forEach(location => {
            const existingCard = grid.querySelector(`[data-id="${location.id}"]`);
            
            if (existingCard) {
                // 기존 카드 업데이트 (내용이 변경된 경우에만)
                updateLocationCard(existingCard, location);
            } else {
                // 새로운 카드 생성
                const newCard = createLocationCard(location);
                grid.appendChild(newCard);
                
                // 새 카드 애니메이션
                setTimeout(() => {
                    newCard.style.opacity = '1';
                    newCard.style.transform = 'translateY(0) scale(1)';
                }, 100);
            }
        });
        
        // 빈 상태 처리
        if (locations.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 2rem; grid-column: 1/-1;">등록된 위치가 없습니다.</p>';
        }
    }

    function updateLocationCard(card, location) {
        const title = card.querySelector('h3');
        const time = card.querySelector('.location-time');
        const desc = card.querySelector('.location-desc');
        const icon = card.querySelector('.location-icon');
        const features = card.querySelector('.location-features');
        const button = card.querySelector('.location-btn');
        
        if (title && title.textContent !== location.name) title.textContent = location.name;
        if (time && time.textContent !== location.time) time.textContent = location.time;
        if (desc && desc.textContent !== location.description) desc.textContent = location.description;
        if (icon && icon.textContent !== location.icon) icon.textContent = location.icon;
        
        if (features) {
            const newFeaturesHTML = location.features.split(',').map(feature => 
                `<span class="feature-tag">${feature.trim()}</span>`
            ).join('');
            if (features.innerHTML !== newFeaturesHTML) {
                features.innerHTML = newFeaturesHTML;
            }
        }
        
        if (button) {
            button.dataset.location = location.name;
            button.dataset.time = location.time;
        }
        
        // featured 클래스 업데이트
        if (location.featured) {
            card.classList.add('featured');
            if (!card.querySelector('.location-badge')) {
                const badge = document.createElement('div');
                badge.className = 'location-badge';
                badge.textContent = '추천';
                card.insertBefore(badge, card.firstChild);
            }
        } else {
            card.classList.remove('featured');
            const badge = card.querySelector('.location-badge');
            if (badge) badge.remove();
        }
    }

    function createLocationCard(location) {
        const card = document.createElement('div');
        card.className = `location-card ${location.featured ? 'featured' : ''}`;
        card.dataset.id = location.id;
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.transition = 'all 0.6s ease';
        
        card.innerHTML = `
            ${location.featured ? '<div class="location-badge">추천</div>' : ''}
            <div class="location-icon">${location.icon}</div>
            <h3>${location.name}</h3>
            <p class="location-time">${location.time}</p>
            <p class="location-desc">${location.description}</p>
            <div class="location-features">
                ${location.features.split(',').map(feature => 
                    `<span class="feature-tag">${feature.trim()}</span>`
                ).join('')}
            </div>
            <div class="location-status available">예약 가능</div>
            <button class="location-btn" data-location="${location.name}" data-time="${location.time}">예약하기</button>
        `;
        
        // 호버 효과 추가
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        });
        
        return card;
    }

    function startOptimizedRealTimeUpdates() {
        // 3초마다 위치 업데이트 확인 (성능 개선)
        setInterval(() => {
            if (!isUpdating) {
                loadLocationGrids();
            }
        }, 3000);

        // BroadcastChannel로 즉시 업데이트
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('location-updates');
            channel.onmessage = function(event) {
                if (event.data.type === 'locationUpdated') {
                    // 디바운싱으로 중복 업데이트 방지
                    clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(() => {
                        loadLocationGrids(true);
                    }, 200);
                }
            };
        }

        // 페이지 포커스 시에만 업데이트
        let isPageVisible = true;
        document.addEventListener('visibilitychange', () => {
            isPageVisible = !document.hidden;
            if (isPageVisible && !isUpdating) {
                loadLocationGrids(true);
            }
        });

        // 윈도우 포커스 시 업데이트
        window.addEventListener('focus', () => {
            if (!isUpdating) {
                setTimeout(() => loadLocationGrids(true), 300);
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

        // 위치 업데이트 이벤트 리스너 (관리자 페이지에서 발생)
        window.addEventListener('locationUpdated', () => {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                loadLocationGrids(true);
            }, 200);
        });

        // localStorage 변경 감지 (다른 탭에서 변경 시)
        window.addEventListener('storage', (e) => {
            if (e.key === 'locations') {
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(() => {
                    loadLocationGrids(true);
                }, 200);
            }
        });
    }

    function setupReservationButtons() {
        // 예약 버튼 클릭 이벤트
        const locationBtns = document.querySelectorAll('.location-btn');
        locationBtns.forEach(btn => {
            // 기존 이벤트 리스너 제거 방지
            if (!btn.hasAttribute('data-listener-added')) {
                btn.addEventListener('click', (e) => {
                    const locationName = e.target.dataset.location;
                    const locationTime = e.target.dataset.time;
                    const locationCard = e.target.closest('.location-card');
                    const locationId = locationCard.dataset.id;
                    
                    // 위치 데이터에서 날짜 정보 가져오기
                    const locations = JSON.parse(localStorage.getItem('locations') || '[]');
                    const location = locations.find(l => l.id == locationId);
                    
                    // 예약 확인 다이얼로그
                    const confirmed = confirm(`${locationName} 촬영을 예약하시겠습니까?\n\n시간: ${locationTime}\n\n확인을 누르시면 연락하기 페이지로 이동합니다.`);
                    
                    if (confirmed) {
                        // 위치의 날짜 정보에 따라 실제 날짜 계산
                        const today = new Date();
                        let targetDate = new Date(today);
                        
                        if (location && location.day) {
                            switch (location.day) {
                                case 'today':
                                    // 오늘 날짜 그대로
                                    break;
                                case 'tomorrow':
                                    targetDate.setDate(today.getDate() + 1);
                                    break;
                                case 'dayAfterTomorrow':
                                    targetDate.setDate(today.getDate() + 2);
                                    break;
                                default:
                                    // 기본값은 오늘
                                    break;
                            }
                        }
                        
                        const dateString = targetDate.toISOString().split('T')[0];
                        
                        // URL 파라미터로 위치 정보와 날짜 전달
                        const params = new URLSearchParams({
                            location: locationName,
                            date: dateString,
                            message: `@${locationName} 선택하였습니다!`
                        });
                        
                        // 메인 페이지의 연락하기 섹션으로 이동
                        window.location.href = `index.html#contact?${params.toString()}`;
                    }
                });
                btn.setAttribute('data-listener-added', 'true');
            }
        });
    }

    function applyScrollAnimationsToNewItems() {
        // 새로 추가된 아이템에만 스크롤 애니메이션 적용
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        // 아직 애니메이션되지 않은 요소들만 관찰
        document.querySelectorAll('.location-card:not(.animated), .reservation-info:not(.animated), .location-cta:not(.animated)').forEach(el => {
            observer.observe(el);
        });
    }

    function renderLocationCard(location, sectionId) {
        return `
            <div class="location-card" data-id="${location.id}">
                <div class="location-image">
                    <img src="${location.image}" alt="${location.name}" onerror="this.style.display='none';">
                </div>
                <div class="location-info">
                    <h3 class="location-name">${location.name}</h3>
                    <p class="location-description">${location.description}</p>
                    <div class="location-details">
                        <span class="location-time">⏰ ${location.time}</span>
                        <span class="location-price">💰 ${location.price}</span>
                    </div>
                    <button class="location-btn" data-location="${location.name}" data-time="${location.time}">
                        예약하기
                    </button>
                </div>
            </div>
        `;
    }
}); 