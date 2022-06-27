import React from "react";
import PropTypes from "prop-types";
import Stats from "./Stats";
import Time from "./Time";

const Header = ({ players, title }) => {
  return (
    <header>
      <Stats players={players} />
      <h1>{title}</h1>
      <Time />
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Header.defaultProps = {
  title: "Scoreboard",
};

export default Header;
