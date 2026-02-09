import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useChallengeUtils from "../../hooks/useChallengeUtils";
import dayjs from "dayjs";
import "./ChallengeEditor.css";

function ChallengeEditor({ initData, onSubmit, text }) {
  const navigate = useNavigate();
  const { calculateEndDate } = useChallengeUtils();
  const today = dayjs().format("YYYY-MM-DD");

  const [form, setForm] = useState(() => ({
    challengeName: initData?.challenge_name ?? "",
    description: initData?.description ?? "",
    targetPeriod: initData?.target_period ?? 1,
    targetDays: initData?.target_days ?? 1,
    participantCount: initData?.participant_count ?? 0,
    challengeImg: null,
    startDate: initData?.start_date ?? today,
  }));

  const endDate = useMemo(
    () => calculateEndDate(form.startDate, form.targetPeriod),
    [form.startDate, form.targetPeriod, calculateEndDate]
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("challenge_name", form.challengeName);
    formData.append("description", form.description);
    formData.append("target_period", form.targetPeriod);
    formData.append("target_days", form.targetDays);
    formData.append("participant_count", form.participantCount);
    formData.append("challenge_img", form.challengeImg);
    formData.append("start_date", form.startDate);
    formData.append("end_date", endDate);
    try {
      await onSubmit(formData);
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
            name="challengeName"
            placeholder="챌린지 이름을 입력하세요"
            value={form.challengeName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="ChallengeCreate-content">챌린지 설명</label>
          <textarea
            id="ChallengeCreate-content"
            name="description"
            placeholder="상세설명을 입력하세요"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="targetPeriod">기간선택</label>
          <select
            id="targetPeriod"
            name="targetPeriod"
            value={form.targetPeriod}
            onChange={(e) =>
              setForm((prevState) => ({
                ...prevState,
                targetPeriod: parseInt(e.target.value),
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
                  form.targetDays === targetDays ? "active" : ""
                }`}
                onClick={() =>
                  setForm((prevState) => ({
                    ...prevState,
                    targetDays: targetDays,
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
            name="challengeImg"
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
