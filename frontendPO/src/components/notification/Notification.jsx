import { useEffect } from "react";
import "./Notification.css";

function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 7000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{ width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
      <div className={`notification ${type}`}>
        {message}
      </div>
    </div>
  );
}

export default Notification;
