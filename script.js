document.addEventListener('DOMContentLoaded', () => {
    const drawBtn = document.getElementById('draw-btn');
    const ballsContainer = document.getElementById('balls-container');
    const themeToggleBtn = document.getElementById('theme-toggle');

    // 테마 설정 불러오기
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeToggleBtn.textContent = '🌙 다크 모드';
    }

    // 테마 변경 버튼 이벤트
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙 다크 모드';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️ 화이트 모드';
        }
    });

    drawBtn.addEventListener('click', drawNumbers);

    function drawNumbers() {
        // 버튼 비활성화 (연타 방지)
        drawBtn.disabled = true;
        const originalText = drawBtn.querySelector('.btn-text').textContent;
        drawBtn.querySelector('.btn-text').textContent = '추첨 중...';

        // 이전 결과 초기화
        ballsContainer.innerHTML = '';

        // 보너스 번호 포함 여부 확인
        const includeBonus = document.getElementById('bonus-toggle').checked;
        const totalBalls = includeBonus ? 7 : 6;

        // 중복 없이 숫자 추출
        const numbers = new Set();
        while(numbers.size < totalBalls) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const numbersArray = Array.from(numbers);
        const regularNumbers = numbersArray.slice(0, 6).sort((a, b) => a - b);
        
        let finalItems = [...regularNumbers];
        if (includeBonus) {
            finalItems.push('+');
            finalItems.push(numbersArray[6]); // 7번째 숫자는 보너스 번호 (정렬하지 않음)
        }

        // 약간의 시간차를 두고 공 또는 기호를 화면에 표시
        finalItems.forEach((item, index) => {
            setTimeout(() => {
                if (item === '+') {
                    const plus = document.createElement('div');
                    plus.className = 'plus-sign';
                    plus.textContent = '+';
                    ballsContainer.appendChild(plus);
                } else {
                    const ball = document.createElement('div');
                    ball.className = `ball ${getColorClass(item)}`;
                    ball.textContent = item;
                    ballsContainer.appendChild(ball);
                }

                // 마지막 항목이 표시된 후 버튼 다시 활성화
                if (index === finalItems.length - 1) {
                    setTimeout(() => {
                        drawBtn.disabled = false;
                        drawBtn.querySelector('.btn-text').textContent = '다시 추첨하기';
                    }, 800); // 마지막 애니메이션이 끝날 때까지 대기
                }
            }, index * 400); // 0.4초 간격으로 하나씩 표시
        });
    }

    // 숫자에 따른 색상 클래스 반환 (동행복권 기준)
    function getColorClass(number) {
        if (number <= 10) return 'c-1';
        if (number <= 20) return 'c-2';
        if (number <= 30) return 'c-3';
        if (number <= 40) return 'c-4';
        return 'c-5';
    }
});
