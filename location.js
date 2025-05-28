document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const currentDateElement = document.getElementById('current-date');
    const locationBtns = document.querySelectorAll('.location-btn:not(.disabled)');

    // 현재 날짜 표시
    const today = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
    };
    currentDateElement.textContent = today.toLocaleDateString('ko-KR', options);

    // 헤더 스크롤 효과
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
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

    // 예약 버튼 클릭 이벤트
    locationBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.location-card');
            const locationName = card.querySelector('h3').textContent;
            const locationTime = card.querySelector('.location-time').textContent;
            
            // 예약 확인 다이얼로그
            const confirmed = confirm(`${locationName} 촬영을 예약하시겠습니까?\n\n시간: ${locationTime}\n날짜: ${currentDateElement.textContent}\n\n확인을 누르시면 연락하기 페이지로 이동합니다.`);
            
            if (confirmed) {
                // 메인 페이지의 연락하기 섹션으로 이동
                window.location.href = 'index.html#contact';
            }
        });
    });

    // 스크롤 애니메이션
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
    document.querySelectorAll('.location-card, .reservation-info, .location-cta').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 카드 호버 효과 개선
    document.querySelectorAll('.location-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        });
    });
}); 