import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import useChallengeUtils from "../hooks/useChallengeUtils";
import "./ChallengeEditor.css";

//initData는 챌린지를 수정할 때 기존 챌린지 데이터를 전달받아 미리 폼에 채울때 사용
function ChallengeEditor({ initData, onSubmit, text }) {
  const navigate = useNavigate();
  const { calculateEndDate } = useChallengeUtils();
  const today = new Date().toISOString().split("T")[0];
  const initialState = {
    //이거 왜필요한거지?
    challenge_name: "",
    description: "",
    target_period: 1,
    target_days: 1, // 기본값
    participant_count: 0,
    challenge_img: null,
    start_date: today,
    end_date: calculateEndDate(today, 1), // 초기값은 빈 문자열로 설정
  };

  const [state, setState] = useState(initialState); //여기서 폼에 들어오는 내용들 관리.

  useEffect(() => {
    if (initData) {
      // 초기 데이터가 주어지면 상태를 설정 . 챌린지 수정할때
      setState({
        ...initData,
        end_date: calculateEndDate(initData.start_date, initData.target_period), // 초기 데이터가 있을 때 end_date 설정
      });
    }
  }, [initData, calculateEndDate]);

  useEffect(() => {
    // target_period 또는 start_date가 변경될 때 end_date를 업데이트
    const newEndDate = calculateEndDate(state.start_date, state.target_period);
    setState((prevState) => ({
      ...prevState,
      end_date: newEndDate,
    }));
  }, [state.start_date, state.target_period, calculateEndDate]);

  const handleChange = (e) => {
    // 모든 입력 필드의 변화 처리
    const { name, value, files } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value, // 파일 입력이면 files[0], 아니면 value
    }));
  };

  //파일을 보내므로 FormData를 사용함.
  const handleSubmit = async () => {
    const startDateUTC = DateTime.fromISO(state.start_date).toUTC().toISO(); // 이미 UTC로 변환된 날짜
    const endDateUTC = DateTime.fromISO(state.end_date).toUTC().toISO(); // 이미 UTC로 변환된 날짜
    console.log("target_period", state.target_period);
    console.log("end_", state.end_date);
    const formData = new FormData();
    formData.append("challenge_name", state.challenge_name);
    formData.append("description", state.description);
    formData.append("target_period", state.target_period);
    formData.append("target_days", state.target_days);
    formData.append("participant_count", state.participant_count);
    formData.append("challenge_img", state.challenge_img);
    formData.append("start_date", startDateUTC);
    formData.append("end_date", endDateUTC);
    try {
      await onSubmit(formData);
      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="ChallengeEditor">
      <div className="ChallengeCreate-Form">
        <div>
          <label htmlFor="ChallengeCreate-Name">챌린지 이름</label>
          <textarea
            id="ChallengeCreate-Name"
            name="challenge_name"
            placeholder="챌린지 이름을 입력하세요"
            value={state.challenge_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="ChallengeCreate-content">챌린지 설명</label>
          <textarea
            id="ChallengeCreate-content"
            name="description"
            placeholder="상세설명을 입력하세요"
            value={state.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="targetPeriod">기간선택</label>
          <select
            id="targetPeriod"
            name="target_period"
            value={state.target_period}
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                target_period: parseInt(e.target.value),
              }))
            }
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
              <option key={period} value={period}>
                {period}주
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="targetFrequency">달성조건</label>
          <div className="targetFrequency">
            {[1, 2, 3, 4, 5, 6, 7].map((targetDays) => (
              <button
                key={targetDays}
                className={`targetDays-button ${
                  state.target_days === targetDays ? "active" : ""
                }`}
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    target_days: targetDays,
                  }))
                }
              >
                {targetDays}번
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="challengeImg">챌린지 이미지 업로드</label>
          <input
            type="file"
            id="challengeImg"
            name="challenge_img"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div>
          <button
            className="ChallengeEditorbtn"
            type="button"
            onClick={handleSubmit}
          >
            {text}
          </button>
          <button
            className="ChallengeEditorbtn"
            type="button"
            onClick={handleCancel}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChallengeEditor;
