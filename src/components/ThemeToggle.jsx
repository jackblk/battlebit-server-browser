import { Button } from "antd";
import { BsSun, BsMoon } from "react-icons/bs";

const ThemeToggle = ({ themeMode, toggleTheme }) => {
  const renderButtonIcon = () => {
    return themeMode === "default" ? <BsSun /> : <BsMoon />;
  };

  return (
    <Button type="primary" onClick={toggleTheme} icon={renderButtonIcon()} />
  );
};

export default ThemeToggle;
