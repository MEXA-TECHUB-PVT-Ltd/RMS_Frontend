import React from "react";
import routes from "../navigation/vertical";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const SidebarLayout = () => {
  const theme = useSelector((state) => state.theme);

  const location = useLocation();

  return (
    <div>
      {routes.map((item, i) => {
        const isActive = location.pathname === item.path;

        return (
          <div
            className={`link-container ${
              isActive && `${theme.bgColor} text-white drop-shadow-md`
            } `}
            key={i}
          >
            <Link to={item.path} className="links">
              <p>{item.icon}</p>
              <h1 className="text-sm">{item.title}</h1>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarLayout;
