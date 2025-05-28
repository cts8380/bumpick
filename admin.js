document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소들
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // 성능 최적화를 위한 변수들
    let updateTimeout = null;
    let isUpdating = false;

    // 초기화
    init();

    function init() {
        // 기본 데이터 초기화
        initializeDefaultData();
        
        // 대시보드 로드
        loadDashboard();
        
        // 이벤트 리스너 등록
        setupEventListeners();
        
        // 실시간 업데이트 시작 (최적화된 버전)
        startOptimizedRealTimeUpdates();
    }

    function initializeDefaultData() {
        // 기본 포트폴리오 데이터 초기화 (한 번만 실행)
        const existingPortfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
        const isFirstTime = localStorage.getItem('portfolios_initialized') !== 'true';
        
        if (existingPortfolios.length === 0 && isFirstTime) {
            const defaultPortfolios = [
                {
                    id: 1,
                    title: '로맨틱 커플 스냅',
                    location: '한강공원 · 골든아워',
                    category: 'couple',
                    image: 'images/IMG_2048.jpg',
                    details: '황금빛 노을과 함께하는 로맨틱한 순간을 담을 수 있는 최고의 장소입니다.',
                    additionalImages: []
                },
                {
                    id: 2,
                    title: '따뜻한 가족 사진',
                    location: '서울숲 · 오후 햇살',
                    category: 'family',
                    image: 'images/IMG_2047.jpg',
                    details: '자연과 도시가 어우러진 아름다운 배경으로 사계절 내내 인기가 높은 촬영지입니다.',
                    additionalImages: []
                },
                {
                    id: 3,
                    title: '개인 프로필 촬영',
                    location: '경복궁 · 전통미',
                    category: 'individual',
                    image: 'images/IMG_2046.jpg',
                    details: '전통과 현대가 만나는 특별한 공간에서 한국의 아름다움을 담아보세요.',
                    additionalImages: []
                },
                {
                    id: 4,
                    title: '자연스러운 커플 스냅',
                    location: '남산타워 · 야경',
                    category: 'couple',
                    image: 'images/IMG_2048.jpg',
                    additionalImages: []
                },
                {
                    id: 5,
                    title: '웨딩 스냅',
                    location: '덕수궁 · 클래식',
                    category: 'wedding',
                    image: 'images/IMG_2047.jpg',
                    additionalImages: []
                },
                {
                    id: 6,
                    title: '행복한 가족 순간',
                    location: '올림픽공원 · 봄날',
                    category: 'family',
                    image: 'images/IMG_2046.jpg',
                    additionalImages: []
                }
            ];
            localStorage.setItem('portfolios', JSON.stringify(defaultPortfolios));
            localStorage.setItem('portfolios_initialized', 'true');
        }

        // 기본 위치 데이터 초기화 (한 번만 실행)
        const existingLocations = JSON.parse(localStorage.getItem('locations') || '[]');
        const isLocationFirstTime = localStorage.getItem('locations_initialized') !== 'true';
        
        if (existingLocations.length === 0 && isLocationFirstTime) {
            const defaultLocations = [
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
            localStorage.setItem('locations_initialized', 'true');
        }
    }

    function setupEventListeners() {
        // 탭 버튼들
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // 포트폴리오 관련
        document.getElementById('addPortfolioBtn').addEventListener('click', showPortfolioForm);
        document.getElementById('portfolioForm').addEventListener('submit', handlePortfolioSubmit);
        
        // 이미지 파일 미리보기
        document.getElementById('portfolioImageFile').addEventListener('change', handleImagePreview);
        
        // 추가 이미지 파일 미리보기
        document.getElementById('portfolioAdditionalImages').addEventListener('change', handleAdditionalImagesPreview);

        // 위치 관련
        document.getElementById('addLocationBtn').addEventListener('click', showLocationForm);
        document.getElementById('locationForm').addEventListener('submit', handleLocationSubmit);

        // 설정 관련
        document.getElementById('siteInfoForm').addEventListener('submit', handleSiteInfoSubmit);

        // 문의 필터
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => filterInquiries(btn.dataset.status));
        });
    }

    function startOptimizedRealTimeUpdates() {
        // 3초마다 대시보드 업데이트 (1초에서 3초로 변경)
        setInterval(() => {
            if (!isUpdating) {
                loadDashboard();
            }
        }, 3000);

        // localStorage 변경 감지 (디바운싱 적용)
        window.addEventListener('storage', (e) => {
            if (e.key === 'inquiries') {
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(() => {
                    if (!isUpdating) {
                        loadDashboard();
                        if (document.getElementById('inquiries').classList.contains('active')) {
                            loadInquiries();
                        }
                    }
                }, 500);
            }
        });

        // 페이지 포커스 시 업데이트 (디바운싱 적용)
        window.addEventListener('focus', () => {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                if (!isUpdating) {
                    loadDashboard();
                    const activeTab = document.querySelector('.tab-content.active');
                    if (activeTab) {
                        const tabId = activeTab.id;
                        if (tabId === 'inquiries') loadInquiries();
                        else if (tabId === 'portfolio') loadPortfolios();
                        else if (tabId === 'locations') loadLocations();
                    }
                }
            }, 500);
        });
    }

    function switchTab(tabName) {
        // 탭 버튼 활성화
        tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // 탭 컨텐츠 표시
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');

        // 폼 숨기기
        hideAllForms();

        // 탭별 데이터 로드
        switch(tabName) {
            case 'inquiries':
                loadInquiries();
                break;
            case 'portfolio':
                loadPortfolios();
                break;
            case 'locations':
                loadLocations();
                break;
        }
    }

    function hideAllForms() {
        document.getElementById('portfolioAddForm').style.display = 'none';
        document.getElementById('locationAddForm').style.display = 'none';
    }

    function loadDashboard() {
        if (isUpdating) return;
        
        const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
        
        // 통계 업데이트
        document.getElementById('totalInquiries').textContent = inquiries.length;
        document.getElementById('pendingInquiries').textContent = inquiries.filter(i => i.status === '대기중').length;
        document.getElementById('completedInquiries').textContent = inquiries.filter(i => i.status === '완료').length;
        document.getElementById('totalPortfolios').textContent = portfolios.length;

        // 기본 탭 로드
        if (document.getElementById('inquiries').classList.contains('active')) {
            loadInquiries();
        }
    }

    function loadInquiries() {
        const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        const inquiriesList = document.getElementById('inquiriesList');
        
        if (inquiries.length === 0) {
            inquiriesList.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 2rem;">문의가 없습니다.</p>';
            return;
        }

        inquiriesList.innerHTML = inquiries.map(inquiry => `
            <div class="inquiry-item" data-status="${inquiry.status}">
                <div class="inquiry-header">
                    <div class="inquiry-info">
                        <h4>${inquiry.name} (${inquiry.phone})</h4>
                        <p>${inquiry.timestamp}</p>
                    </div>
                    <span class="inquiry-status ${inquiry.status}">${inquiry.status}</span>
                </div>
                <div class="inquiry-details">
                    <div><strong>패키지:</strong> ${getPackageName(inquiry.package)}</div>
                    <div><strong>희망 날짜:</strong> ${inquiry.date}</div>
                </div>
                <div><strong>메시지:</strong> ${inquiry.message}</div>
                <div class="inquiry-actions">
                    <button class="action-btn edit-btn" onclick="updateInquiryStatus(${inquiry.id}, '진행중')">진행중으로 변경</button>
                    <button class="action-btn edit-btn" onclick="updateInquiryStatus(${inquiry.id}, '완료')">완료로 변경</button>
                    <button class="action-btn delete-btn" onclick="deleteInquiry(${inquiry.id})">삭제</button>
                </div>
            </div>
        `).join('');
    }

    function getPackageName(value) {
        const packages = {
            'basic': '기본 패키지 (50,000원)',
            'premium': '프리미엄 패키지 (80,000원)',
            'luxury': '럭셔리 패키지 (120,000원)'
        };
        return packages[value] || value;
    }

    function filterInquiries(status) {
        // 필터 버튼 활성화
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-status="${status}"]`).classList.add('active');

        // 문의 항목 필터링
        const inquiryItems = document.querySelectorAll('.inquiry-item');
        inquiryItems.forEach(item => {
            if (status === 'all' || item.dataset.status === status) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 전역 함수들 (HTML에서 호출)
    window.updateInquiryStatus = function(id, newStatus) {
        const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        const inquiry = inquiries.find(i => i.id === id);
        if (inquiry) {
            inquiry.status = newStatus;
            localStorage.setItem('inquiries', JSON.stringify(inquiries));
            loadInquiries();
            loadDashboard();
            alert(`문의 상태가 "${newStatus}"로 변경되었습니다.`);
        }
    };

    window.deleteInquiry = function(id) {
        if (confirm('정말 삭제하시겠습니까?')) {
            const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
            const filteredInquiries = inquiries.filter(i => i.id !== id);
            localStorage.setItem('inquiries', JSON.stringify(filteredInquiries));
            loadInquiries();
            loadDashboard();
            alert('문의가 삭제되었습니다.');
        }
    };

    function loadPortfolios() {
        const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
        const portfolioGrid = document.getElementById('portfolioGrid');
        
        if (portfolios.length === 0) {
            portfolioGrid.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 2rem; grid-column: 1/-1;">포트폴리오가 없습니다.</p>';
            return;
        }

        portfolioGrid.innerHTML = portfolios.map(portfolio => `
            <div class="portfolio-admin-item">
                <img src="${portfolio.image}" alt="${portfolio.title}" onerror="this.style.display='none'; this.parentNode.style.background='#f5f5f5'; this.parentNode.innerHTML='<div style=&quot;display:flex;align-items:center;justify-content:center;height:200px;color:#999;font-size:14px;&quot;>이미지 없음</div>' + this.parentNode.innerHTML.replace(this.outerHTML, '');">
                <div class="portfolio-admin-info">
                    <span class="portfolio-category">${getCategoryName(portfolio.category)}</span>
                    <h4>${portfolio.title}</h4>
                    <p>${portfolio.location}</p>
                    <div class="inquiry-actions">
                        <button class="action-btn edit-btn" onclick="editPortfolio(${portfolio.id})">편집</button>
                        <button class="action-btn delete-btn" onclick="deletePortfolio(${portfolio.id})">삭제</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function getCategoryName(category) {
        const categories = {
            'couple': '커플',
            'family': '가족',
            'individual': '개인',
            'wedding': '웨딩'
        };
        return categories[category] || category;
    }

    function showPortfolioForm() {
        const form = document.getElementById('portfolioAddForm');
        const portfolioForm = document.getElementById('portfolioForm');
        
        // 폼 초기화
        portfolioForm.reset();
        delete portfolioForm.dataset.editId;
        
        // 이미지 미리보기 숨기기
        document.getElementById('portfolioImagePreview').style.display = 'none';
        
        // 추가 이미지 미리보기 숨기기
        document.getElementById('additionalImagesPreview').style.display = 'none';
        
        // 폼 표시
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }

    window.hidePortfolioForm = function() {
        document.getElementById('portfolioAddForm').style.display = 'none';
    };

    function handleImagePreview(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('portfolioImagePreview');
                const img = document.getElementById('portfolioPreviewImg');
                img.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    function handleAdditionalImagesPreview(e) {
        const files = e.target.files;
        const preview = document.getElementById('additionalImagesPreview');
        const previewGrid = document.getElementById('previewGrid');
        
        if (files.length > 0) {
            preview.style.display = 'block';
            previewGrid.innerHTML = '';
            
            Array.from(files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="추가 이미지 ${index + 1}">
                        <button type="button" class="remove-btn" onclick="removeAdditionalImage(${index})">×</button>
                    `;
                    previewGrid.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            });
        } else {
            preview.style.display = 'none';
        }
    }

    // 추가 이미지 제거 함수
    window.removeAdditionalImage = function(index) {
        const fileInput = document.getElementById('portfolioAdditionalImages');
        const dt = new DataTransfer();
        const files = fileInput.files;
        
        for (let i = 0; i < files.length; i++) {
            if (i !== index) {
                dt.items.add(files[i]);
            }
        }
        
        fileInput.files = dt.files;
        handleAdditionalImagesPreview({ target: fileInput });
    };

    // 기존 추가 이미지 제거 함수 (편집 시)
    window.removeExistingAdditionalImage = function(index) {
        const form = document.getElementById('portfolioForm');
        if (form.dataset.editId) {
            const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
            const portfolio = portfolios.find(p => p.id === parseInt(form.dataset.editId));
            if (portfolio && portfolio.additionalImages) {
                portfolio.additionalImages.splice(index, 1);
                localStorage.setItem('portfolios', JSON.stringify(portfolios));
                
                // 미리보기 다시 로드
                const preview = document.getElementById('additionalImagesPreview');
                const previewGrid = document.getElementById('previewGrid');
                
                if (portfolio.additionalImages.length > 0) {
                    preview.style.display = 'block';
                    previewGrid.innerHTML = '';
                    
                    portfolio.additionalImages.forEach((imageData, idx) => {
                        const previewItem = document.createElement('div');
                        previewItem.className = 'preview-item';
                        previewItem.innerHTML = `
                            <img src="${imageData}" alt="기존 이미지 ${idx + 1}">
                            <button type="button" class="remove-btn" onclick="removeExistingAdditionalImage(${idx})">×</button>
                        `;
                        previewGrid.appendChild(previewItem);
                    });
                } else {
                    preview.style.display = 'none';
                }
                
                // 실시간 동기화
                broadcastUpdate('portfolios');
            }
        }
    };

    function resizeImage(file, maxWidth = 400, maxHeight = 300, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                // 비율 계산
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // 이미지 그리기
                ctx.drawImage(img, 0, 0, width, height);
                
                // Base64로 변환
                const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(resizedDataUrl);
            };
            
            const reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    async function handlePortfolioSubmit(e) {
        e.preventDefault();
        
        // 중복 제출 방지
        if (isUpdating) {
            alert('처리 중입니다. 잠시만 기다려주세요.');
            return;
        }
        
        isUpdating = true;
        
        try {
            const form = e.target;
            const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
            
            const fileInput = document.getElementById('portfolioImageFile');
            let imageData = '';
            
            if (fileInput.files[0]) {
                // 이미지 리사이즈 및 압축
                imageData = await resizeImage(fileInput.files[0]);
            } else if (form.dataset.editId) {
                // 편집 시 기존 이미지 유지
                const existingPortfolio = portfolios.find(p => p.id === parseInt(form.dataset.editId));
                imageData = existingPortfolio ? existingPortfolio.image : '';
            }
            
            // 추가 이미지들 처리
            const additionalImagesInput = document.getElementById('portfolioAdditionalImages');
            let additionalImages = [];
            
            // 편집 시 기존 추가 이미지들 유지
            if (form.dataset.editId) {
                const existingPortfolio = portfolios.find(p => p.id === parseInt(form.dataset.editId));
                additionalImages = existingPortfolio ? (existingPortfolio.additionalImages || []) : [];
            }
            
            // 새로 업로드한 이미지들 추가
            if (additionalImagesInput.files.length > 0) {
                for (let i = 0; i < additionalImagesInput.files.length; i++) {
                    const resizedImage = await resizeImage(additionalImagesInput.files[i], 300, 200, 0.7);
                    additionalImages.push(resizedImage);
                }
            }
            
            const portfolioData = {
                id: form.dataset.editId ? parseInt(form.dataset.editId) : Date.now(),
                title: document.getElementById('portfolioTitle').value,
                location: document.getElementById('portfolioLocation').value,
                category: document.getElementById('portfolioCategory').value,
                image: imageData,
                details: document.getElementById('portfolioDetails').value,
                additionalImages: additionalImages
            };

            if (form.dataset.editId) {
                const index = portfolios.findIndex(p => p.id === parseInt(form.dataset.editId));
                portfolios[index] = portfolioData;
            } else {
                portfolios.push(portfolioData);
            }

            localStorage.setItem('portfolios', JSON.stringify(portfolios));
            
            // 최적화된 동기화 (디바운싱 적용)
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                triggerPortfolioUpdate();
            }, 100);
            
            hidePortfolioForm();
            loadPortfolios();
            loadDashboard();
            
            alert('포트폴리오가 저장되었습니다. portfolio.html에도 반영됩니다.');
            
        } catch (error) {
            alert('오류가 발생했습니다: ' + error.message);
        } finally {
            isUpdating = false;
        }
    }

    function triggerPortfolioUpdate() {
        // 여러 방법으로 업데이트 신호 전송 (최적화된 버전)
        try {
            window.dispatchEvent(new CustomEvent('portfolioUpdated'));
            
            // localStorage 이벤트 강제 발생
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'portfolios',
                newValue: localStorage.getItem('portfolios'),
                url: window.location.href
            }));
            
            // 다른 탭들에게 메시지 전송
            if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel('portfolio-updates');
                channel.postMessage({ type: 'portfolioUpdated', timestamp: Date.now() });
                channel.close(); // 채널 즉시 닫기
            }
        } catch (error) {
            console.warn('동기화 이벤트 발생 중 오류:', error);
        }
    }

    function triggerLocationUpdate() {
        // 여러 방법으로 업데이트 신호 전송 (최적화된 버전)
        try {
            window.dispatchEvent(new CustomEvent('locationUpdated'));
            
            // localStorage 이벤트 강제 발생
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'locations',
                newValue: localStorage.getItem('locations'),
                url: window.location.href
            }));
            
            // 다른 탭들에게 메시지 전송
            if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel('location-updates');
                channel.postMessage({ type: 'locationUpdated', timestamp: Date.now() });
                channel.close(); // 채널 즉시 닫기
            }
        } catch (error) {
            console.warn('동기화 이벤트 발생 중 오류:', error);
        }
    }

    window.editPortfolio = function(id) {
        const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
        const portfolio = portfolios.find(p => p.id === id);
        if (portfolio) {
            const form = document.getElementById('portfolioForm');
            const addForm = document.getElementById('portfolioAddForm');
            
            // 폼에 데이터 채우기
            document.getElementById('portfolioTitle').value = portfolio.title;
            document.getElementById('portfolioLocation').value = portfolio.location;
            document.getElementById('portfolioCategory').value = portfolio.category;
            document.getElementById('portfolioDetails').value = portfolio.details || '';
            form.dataset.editId = portfolio.id;
            
            // 기존 이미지 미리보기
            if (portfolio.image) {
                const preview = document.getElementById('portfolioImagePreview');
                const img = document.getElementById('portfolioPreviewImg');
                img.src = portfolio.image;
                preview.style.display = 'block';
            }
            
            // 기존 추가 이미지들 미리보기
            if (portfolio.additionalImages && portfolio.additionalImages.length > 0) {
                const preview = document.getElementById('additionalImagesPreview');
                const previewGrid = document.getElementById('previewGrid');
                preview.style.display = 'block';
                previewGrid.innerHTML = '';
                
                portfolio.additionalImages.forEach((imageData, index) => {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${imageData}" alt="추가 이미지 ${index + 1}">
                        <button type="button" class="remove-btn" onclick="removeExistingAdditionalImage(${index})">×</button>
                    `;
                    previewGrid.appendChild(previewItem);
                });
            }
            
            // 폼 표시
            addForm.style.display = 'block';
            addForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.deletePortfolio = function(id) {
        if (confirm('정말 삭제하시겠습니까?')) {
            const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
            const filteredPortfolios = portfolios.filter(p => p.id !== id);
            localStorage.setItem('portfolios', JSON.stringify(filteredPortfolios));
            
            // 최적화된 동기화 (디바운싱 적용)
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                triggerPortfolioUpdate();
            }, 100);
            
            loadPortfolios();
            loadDashboard();
            alert('포트폴리오가 삭제되었습니다.');
        }
    };

    function loadLocations() {
        const locations = JSON.parse(localStorage.getItem('locations') || '[]');
        const locationsList = document.getElementById('locationsList');
        
        if (locations.length === 0) {
            locationsList.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 2rem;">위치가 없습니다.</p>';
            return;
        }

        locationsList.innerHTML = locations.map(location => `
            <div class="location-admin-item">
                <div class="location-admin-header">
                    <div class="location-admin-info">
                        <h4>${location.icon} ${location.name}</h4>
                    </div>
                    <div class="inquiry-actions">
                        <button class="action-btn edit-btn" onclick="editLocation(${location.id})">편집</button>
                        <button class="action-btn delete-btn" onclick="deleteLocation(${location.id})">삭제</button>
                    </div>
                </div>
                <div class="location-admin-details">
                    <div><strong>시간:</strong> ${location.time}</div>
                    <div><strong>특징:</strong> ${location.features}</div>
                    <div><strong>날짜:</strong> ${location.day === 'today' ? '오늘' : location.day === 'tomorrow' ? '내일' : location.day === 'dayAfterTomorrow' ? '내일모레' : '미정'}</div>
                </div>
                <div><strong>설명:</strong> ${location.description}</div>
            </div>
        `).join('');
    }

    function showLocationForm() {
        const form = document.getElementById('locationAddForm');
        const locationForm = document.getElementById('locationForm');
        
        // 폼 초기화
        locationForm.reset();
        delete locationForm.dataset.editId;
        
        // 폼 표시
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }

    window.hideLocationForm = function() {
        document.getElementById('locationAddForm').style.display = 'none';
    };

    function handleLocationSubmit(e) {
        e.preventDefault();
        
        // 중복 제출 방지
        if (isUpdating) {
            alert('처리 중입니다. 잠시만 기다려주세요.');
            return;
        }
        
        isUpdating = true;
        
        try {
            const form = e.target;
            const locations = JSON.parse(localStorage.getItem('locations') || '[]');
            
            // 새로운 위치 추가 시 자동으로 날짜 설정
            let selectedDay = document.getElementById('locationDay').value;
            
            // 편집이 아닌 새로운 추가인 경우에만 자동 설정 로직 적용
            if (!form.dataset.editId) {
                // 사용자가 명시적으로 선택한 경우 그대로 사용
                // 7개째부터는 기본값을 내일모레로 제안하지만 사용자 선택을 우선
                if (locations.length >= 6 && selectedDay === 'today') {
                    // 경고 메시지 표시하지만 사용자 선택 존중
                    console.log('7개째 위치부터는 내일모레 추천');
                }
            }
            
            const locationData = {
                id: form.dataset.editId ? parseInt(form.dataset.editId) : Date.now(),
                name: document.getElementById('locationName').value,
                time: document.getElementById('locationTime').value,
                description: document.getElementById('locationDesc').value,
                icon: document.getElementById('locationIcon').value,
                features: document.getElementById('locationFeatures').value,
                day: selectedDay
            };

            if (form.dataset.editId) {
                const index = locations.findIndex(l => l.id === parseInt(form.dataset.editId));
                if (index !== -1) {
                    locations[index] = locationData;
                }
            } else {
                locations.push(locationData);
            }

            localStorage.setItem('locations', JSON.stringify(locations));
            
            // 최적화된 동기화 (디바운싱 적용)
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                triggerLocationUpdate();
            }, 100);
            
            hideLocationForm();
            loadLocations();
            
            // 7개째 추가 시 특별 메시지
            if (locations.length === 7 && !form.dataset.editId) {
                alert('위치가 저장되었습니다. 7개째 위치부터는 자동으로 "내일모레" 섹션에 추가됩니다!');
            } else {
                alert('위치가 저장되었습니다. location.html에도 반영됩니다.');
            }
            
        } catch (error) {
            alert('오류가 발생했습니다: ' + error.message);
        } finally {
            isUpdating = false;
        }
    }

    window.editLocation = function(id) {
        const locations = JSON.parse(localStorage.getItem('locations') || '[]');
        const location = locations.find(l => l.id === id);
        if (location) {
            const form = document.getElementById('locationForm');
            const addForm = document.getElementById('locationAddForm');
            
            // 폼에 데이터 채우기
            document.getElementById('locationName').value = location.name;
            document.getElementById('locationTime').value = location.time;
            document.getElementById('locationDesc').value = location.description;
            document.getElementById('locationIcon').value = location.icon;
            document.getElementById('locationFeatures').value = location.features;
            document.getElementById('locationDay').value = location.day || 'today';
            form.dataset.editId = location.id;
            
            // 폼 표시
            addForm.style.display = 'block';
            addForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.deleteLocation = function(id) {
        if (confirm('정말 삭제하시겠습니까?')) {
            const locations = JSON.parse(localStorage.getItem('locations') || '[]');
            const filteredLocations = locations.filter(l => l.id !== id);
            localStorage.setItem('locations', JSON.stringify(filteredLocations));
            
            // 최적화된 동기화 (디바운싱 적용)
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                triggerLocationUpdate();
            }, 100);
            
            loadLocations();
            alert('위치가 삭제되었습니다. location.html에도 반영됩니다.');
        }
    };

    function handleSiteInfoSubmit(e) {
        e.preventDefault();
        const siteInfo = {
            title: document.getElementById('siteTitle').value,
            phone: document.getElementById('sitePhone').value,
            instagram: document.getElementById('siteInstagram').value
        };
        
        localStorage.setItem('siteInfo', JSON.stringify(siteInfo));
        alert('사이트 정보가 저장되었습니다.');
    }
}); 