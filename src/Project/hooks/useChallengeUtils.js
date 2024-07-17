const useChallengeUtils = () => {
    const calculateEndDate = (startDate, period) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + period * 7); // 주 단위로 기간을 계산하여 종료일 설정
        return end.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
    };
    
    const calculateBadges = (target_days, start_date, period, testDate) => {
        const start = new Date(start_date); //start_date는 챌린지가 만들어져서 시작된 날짜
        const today = new Date(testDate); // testDate를 사용하여 오늘 날짜를  설정
    
        const daysDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24)); // 챌린지 생성일부터 오늘까지의 일수 차이 계산
    
        const currentWeek = Math.floor(daysDiff / 7) + 1; // 현재 주차 계산
        const remainingWeeks = period - currentWeek + 1; // 남은 주차 계산
    
        const daysRemainingInCurrentWeek = 7 - (daysDiff % 7); // 현재 주의 남은 날짜 계산
    
        let badgeCount = 0;
    
        if (daysRemainingInCurrentWeek >= target_days) {
            badgeCount += 1; // 현재 주에서 뱃지를 받을 수 있는 경우
        }
    
        badgeCount += remainingWeeks - 1; // 남은 전체 주차에 대한 뱃지 추가
    
        return badgeCount;
    };
    return { calculateEndDate, calculateBadges };
}

export default useChallengeUtils;