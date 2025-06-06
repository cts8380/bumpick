document.addEventListener('DOMContentLoaded', () => {
    const leftDoor = document.querySelector('.left-door');
    const rightDoor = document.querySelector('.right-door');
    const content = document.querySelector('.content');
    const slogan = document.querySelector('.slogan');
    const introBadges = document.querySelector('.intro-badges');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const shutterSound = document.getElementById('shutter-sound');
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    // 인트로 애니메이션
    setTimeout(() => {
        // 셔터 소리 재생 (오류 처리 추가)
        shutterSound.play().catch(e => {
            console.log('오디오 재생 실패:', e);
        });

        // 문 열기
        leftDoor.classList.add('open');
        rightDoor.classList.add('open');

        // 컨텐츠 표시
        content.classList.add('visible');
        slogan.classList.add('visible');
        introBadges.classList.add('visible');
        scrollIndicator.classList.add('visible');

        // 스크롤 가능하게 변경
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 2000);
    }, 800);

    // 스크롤 인디케이터 클릭 시 부드럽게 스크롤
    scrollIndicator.addEventListener('click', () => {
        document.querySelector('#about').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // 헤더 스크롤 효과
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 네비게이션 링크 부드러운 스크롤 (내부 링크만)
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 모바일 메뉴 토글
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

    // 가격 패키지 선택 버튼
    document.querySelectorAll('.pricing-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.pricing-card');
            const packageName = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            
            // 연락하기 섹션으로 스크롤
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
            
            // 패키지 선택 자동 설정
            setTimeout(() => {
                const packageSelect = document.getElementById('package');
                if (packageName.includes('기본')) {
                    packageSelect.value = 'basic';
                } else if (packageName.includes('프리미엄')) {
                    packageSelect.value = 'premium';
                } else if (packageName.includes('럭셔리')) {
                    packageSelect.value = 'luxury';
                }
            }, 500);
        });
    });

    // 연락 폼 제출 처리
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const inquiryData = {
            id: Date.now(),
            name: formData.get('name'),
            phone: formData.get('phone'),
            package: formData.get('package'),
            date: formData.get('date'),
            message: formData.get('message'),
            timestamp: new Date().toLocaleString('ko-KR'),
            status: '대기중'
        };

        // 간단한 유효성 검사
        if (!inquiryData.name || !inquiryData.phone || !inquiryData.package || !inquiryData.date || !inquiryData.message) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        // 로컬 스토리지에 문의 내역 저장
        let inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
        inquiries.push(inquiryData);
        localStorage.setItem('inquiries', JSON.stringify(inquiries));

        // 성공 메시지
        alert(`문의해주셔서 감사합니다, ${inquiryData.name}님!\n선택하신 패키지: ${getPackageName(inquiryData.package)}\n희망 날짜: ${inquiryData.date}\n\n빠른 시일 내에 연락드리겠습니다.`);
        contactForm.reset();
    });

    // 패키지 이름 변환 함수
    function getPackageName(value) {
        const packages = {
            'basic': '기본 패키지 (50,000원)',
            'premium': '프리미엄 패키지 (80,000원)',
            'luxury': '럭셔리 패키지 (120,000원)'
        };
        return packages[value] || value;
    }

    // 스크롤 애니메이션 (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 애니메이션할 요소들 관찰
    document.querySelectorAll('.photo-item, .location-card, .contact-form, .contact-links, .feature-item, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 소셜 링크 클릭 이벤트
    document.querySelectorAll('.social-link:not(.phone):not(.instagram), .footer-social-link:not([href*="instagram"])').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('실제 서비스에서는 해당 SNS로 연결됩니다.');
        });
    });

    // 현재 날짜 이후만 선택 가능하도록 설정
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // URL 파라미터 확인 및 폼 자동 입력
    handleURLParams();
    
    // 모바일에서 날짜 입력 필드 개선
    dateInput.addEventListener('focus', function() {
        this.style.color = '#333';
    });
    
    dateInput.addEventListener('blur', function() {
        if (!this.value) {
            this.style.color = '#999';
        }
    });
    
    // 날짜 입력 필드에 라벨 추가 (모바일 지원)
    if (dateInput && !dateInput.value) {
        dateInput.style.color = '#999';
        const label = document.createElement('label');
        label.textContent = '촬영 희망 날짜';
        label.style.position = 'absolute';
        label.style.left = '1rem';
        label.style.top = '1rem';
        label.style.color = '#999';
        label.style.pointerEvents = 'none';
        label.style.transition = 'all 0.3s ease';
        
        const formGroup = dateInput.parentElement;
        formGroup.style.position = 'relative';
        formGroup.insertBefore(label, dateInput);
        
        dateInput.addEventListener('focus', () => {
            label.style.transform = 'translateY(-1.5rem) scale(0.8)';
            label.style.color = '#e74c3c';
        });
        
        dateInput.addEventListener('blur', () => {
            if (!dateInput.value) {
                label.style.transform = 'translateY(0) scale(1)';
                label.style.color = '#999';
            }
        });
        
        if (dateInput.value) {
            label.style.transform = 'translateY(-1.5rem) scale(0.8)';
            label.style.color = '#e74c3c';
        }
    }
    
    // URL 파라미터 처리 (위치안내에서 예약 시)
    function handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const location = urlParams.get('location');
        const date = urlParams.get('date');
        const message = urlParams.get('message');
        
        if (location || date || message) {
            // 연락하기 섹션으로 스크롤
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // 폼 필드 자동 입력
                    if (date) {
                        const dateInput = document.getElementById('date');
                        if (dateInput) {
                            dateInput.value = date;
                        }
                    }
                    
                    if (message) {
                        const messageTextarea = document.getElementById('message');
                        if (messageTextarea) {
                            // 기존 메시지가 있으면 추가, 없으면 새로 설정
                            const currentMessage = messageTextarea.value.trim();
                            if (currentMessage) {
                                messageTextarea.value = currentMessage + '\n\n' + message;
                            } else {
                                messageTextarea.value = message;
                            }
                        }
                    }
                    
                    // URL에서 파라미터 제거 (깔끔하게)
                    const newUrl = window.location.pathname + window.location.hash.split('?')[0];
                    window.history.replaceState({}, document.title, newUrl);
                }
            }, 500);
        }
    }
}); 