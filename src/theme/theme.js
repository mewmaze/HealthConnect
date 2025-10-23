import { createTheme } from "@mui/material/styles";

const customTheme = createTheme({
  palette: {
    primary: {
      light: "#42a5f5",
      main: "#FFAA46",
      dark: "#b27000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    text: {
      primary: "#212121", // 기본 본문 텍스트 (거의 검정)
      secondary: "#757575", // 보조 텍스트 (회색)
      disabled: "#bdbdbd", // 비활성화된 텍스트
    },
    background: {
      default: "#fafafa", // 전체 배경
      paper: "#fff", // 카드/패널 배경
    },
  },
});
export default customTheme;
