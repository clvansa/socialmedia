import React, { useState, useContext, useEffect } from "react";
import { Switch, FormControlLabel } from "@material-ui/core";
import { SocketContext } from "../../context/SocketContext";

const ChoiseTheme = () => {
  const [dark, setDark] = useState(false);
  const { setTheme, theme } = useContext(SocketContext);

  useEffect(() => {
    setDark(theme === "dark" ? true : false);
  }, []);

  const handleChange = () => {
    setDark(!dark);
    if (theme === "light") {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };
  return (
    <Switch
      checked={dark}
      onChange={handleChange}
      name="dark"
      color="primary"
    />
  );
};

export default ChoiseTheme;
