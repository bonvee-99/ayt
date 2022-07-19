import { useState } from "react";
import styles from "../styles/Home.module.css"

const User = ({ user, toggleUser }) => {
  const [checked, setChecked] = useState(user.display);

  const handleCheckBoxChange = (event) => {
    setChecked(event.target.checked);
    toggleUser(user)
  };

  return (
    <li className={styles.user}>
      <span
        className={styles.userCol}
        style={{ backgroundColor: user.color }}
      ></span>
      <label
        style={{ fontSize: 12, display: "inline-block", marginLeft: 5 }}
      >{user.name}</label>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckBoxChange}
      />
    </li>
  );
};

export default User;
