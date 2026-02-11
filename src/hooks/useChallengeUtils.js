const useChallengeUtils = () => {
  const calculateEndDate = (startDate, period) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + period * 7); // 주 단위로 기간을 계산하여 종료일 설정
    return end.toISOString().split("T")[0];
  };

  const calculateBadges = (targetPeriod, startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today > end) {
      return 0;
    }
    let totalBadges = 0;
    // 현재 날짜가 챌린지 시작일 이후 몇 일째인지 계산
    const diffDays = Math.floor((today - start) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.floor(diffDays / 7) + 1; // 현재 주차
    const totalWeeks = Math.ceil((end - start) / (7 * 24 * 60 * 60 * 1000)); // 전체 주차

    const daysSinceWeekStart = diffDays % 7; // 이번 주에서 지난 일수
    const daysLeftInWeek = 7 - daysSinceWeekStart; // 이번 주 남은 일수

    // 이번 주에 target_period를 달성할 수 있으면 추가
    if (daysLeftInWeek >= targetPeriod) {
      totalBadges += 1;
    }

    // 남은 주차 수 계산 (현재 주차를 포함하지 않음)
    const remainingWeeks = totalWeeks - currentWeek;
    totalBadges += remainingWeeks;

    return totalBadges;
  };

  return { calculateEndDate, calculateBadges };
};

export default useChallengeUtils;
