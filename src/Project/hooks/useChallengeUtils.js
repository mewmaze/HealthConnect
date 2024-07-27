const useChallengeUtils = () => {
    const calculateEndDate = (startDate, period) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + period * 7); // 주 단위로 기간을 계산하여 종료일 설정
        return end; // YYYY-MM-DD 형식으로 반환
    };

    const calculateBadges = (target_days, start_date, period, testDate) => {
        const start = new Date(start_date); // 챌린지 시작일
        const today = new Date(testDate); // 테스트 날짜
        start.setHours(0, 0, 0, 0); 

        if (today < start) {
            // 시작일 이전에는 뱃지 수가 0이어야 함
            return 0;
        }

        const daysDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24)); // 챌린지 시작일부터 오늘까지의 일수 차이 계산

        const currentWeek = Math.floor(daysDiff / 7) + 1; // 현재 주차 계산
        const remainingWeeks = period - currentWeek + 1; // 남은 전체 주차 계산

        // 현재 주의 뱃지 수 계산
        const daysRemainingInCurrentWeek = 7 - (daysDiff % 7); // 현재 주의 남은 날짜 계산

        let badgeCount = 0;

        if (daysDiff === 0) {
            // 시작일에는 최대 뱃지 수를 설정
            badgeCount = period; // 시작일에 최대 뱃지 수
        } else if (daysRemainingInCurrentWeek >= target_days) {
            // 현재 주에서 목표 달성 조건을 충족하면
            badgeCount = remainingWeeks; // 남은 주차 수만큼 뱃지 수 설정
        } else {
            // 현재 주에서 목표 달성 조건을 충족하지 못하면
            badgeCount = remainingWeeks - 1; // 목표 달성하지 못한 주 수 만큼 뱃지 수 감소
        }

        return Math.max(0, badgeCount); // 음수로 떨어지지 않도록 보장
    };

    return { calculateEndDate, calculateBadges };
}

export default useChallengeUtils;
