import React from "react";
import SearchBar from "../form/SearchBar";
import Button from "../form/Button";
import GridButton from "../form/GridButton";

const Header = ({
  title,
  onSearch,
  onAddButtonClick,
  buttonTitle,
  buttonIcon,
  viewType,
  onViewType,
}) => {

  const handleSearch = (query) => {
    onSearch(query);
  };

  return (
    <div className="header">
      <h1 className="cursor-pointer font-bold text-lg text-light_text_1 dark:text-dark_text_1">
        {title}
      </h1>

      <div className="header-items">
        <SearchBar onChange={handleSearch} field="title" />
        <div className="header-buttons">
          <Button
            title={buttonTitle}
            icon={buttonIcon}
            onClick={onAddButtonClick}
          />
          <GridButton
            onGridView={() => onViewType("GRID")}
            onListView={() => onViewType("")}
            grid={viewType === "GRID"}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
