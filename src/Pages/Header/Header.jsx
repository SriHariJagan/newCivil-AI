import React, { useState, useEffect, useRef } from "react";
import styles from "./header.module.css";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { NavLink, Link } from "react-router-dom";

import { images } from "../../constantData";

import {
  useProjectData,
  useTaskData,
  useUserData,
} from "../../Store/UseContexts/UseContexts";
import { Moon, Search, Sun } from "lucide-react";

const Header = ({ getData }) => {
  const [showInput, setShowInput] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dark, setDark] = useState(false);

  // Get data from context directly
  const { projectsList } = useProjectData();
  const { tasksList } = useTaskData();
  const { usersList } = useUserData();

  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const searchRef = useRef(null);
  const menuBtnRef = useRef(null);

  const avatar = images.userIcon;

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    setDark(!dark);
  };

  const toggleNavbar = () => {
    setMenuOpen((prev) => !prev);
    setDropdownOpen(false);
  };

  const toggleAdminDropdown = () => {
    setDropdownOpen((prev) => !prev);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowInput(false);
        setSearchTerm("");
        setSearchResults([]);
      }

      if (
        menuOpen &&
        !(
          navRef.current?.contains(event.target) ||
          menuBtnRef.current?.contains(event.target)
        )
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchResults([]);
      return;
    }

    let results = [];

    if (term === "project" || term === "projects") {
      results = projectsList.map((p) => ({
        type: "Project",
        name: p.name || p.title || "Unnamed Project",
      }));
    } else if (term === "task" || term === "tasks") {
      results = tasksList.map((t) => ({
        type: "Task",
        name: t.name || t.title || "Unnamed Task",
      }));
    } else if (term === "user" || term === "users") {
      results = usersList.map((u) => ({
        type: "User",
        name:
          u.name ||
          u.full_name ||
          `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() ||
          "Unnamed User",
      }));
    } else {
      const matchedProjects = projectsList.filter((p) =>
        (p.name || p.title || "").toLowerCase().includes(term)
      );

      const matchedTasks = tasksList.filter((t) =>
        (t.name || t.title || "").toLowerCase().includes(term)
      );

      const matchedUsers = usersList.filter((u) =>
        (
          u.name ||
          u.full_name ||
          `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim()
        )
          .toLowerCase()
          .includes(term)
      );

      results = [
        ...matchedProjects.map((p) => ({
          type: "Project",
          name: p.name || p.title || "Unnamed Project",
        })),
        ...matchedTasks.map((t) => ({
          type: "Task",
          name: t.name || t.title || "Unnamed Task",
        })),
        ...matchedUsers.map((u) => ({
          type: "User",
          name:
            u.name ||
            u.full_name ||
            `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() ||
            "Unnamed User",
        })),
      ];
    }

    setSearchResults(results);
  }, [searchTerm, projectsList, tasksList, usersList]);

  const logoutUser = () => {
    localStorage.removeItem("authToken");
    setDropdownOpen(false);
    window.location.reload();
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerLogo}>
        <Link to="/">
          <img src="/Images/logo.png" alt="App Logo" />
        </Link>
      </div>

      <nav
        ref={navRef}
        className={`${styles.navbar} ${menuOpen ? styles.navOpen : ""}`}
      >
        <ul>
          {["/", "/projects", "/tasks", "/users", "/logs"].map((route, idx) => (
            <li key={route} onClick={() => setMenuOpen(false)}>
              <NavLink
                to={route}
                className={({ isActive }) =>
                  isActive ? styles.activeLink : ""
                }
              >
                {["Overview", "Projects", "Tasks", "Users", "Logs"][idx]}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.rightHeader}>
        <span className={styles.searchContainer} ref={searchRef}>
          {showInput && (
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          )}
          <button
            onClick={() => setShowInput((prev) => !prev)}
            className={styles.searchBtn}
          >
            {/* <img src="/Images/searchIcon.png" alt="Search Icon" width={10} /> */}
            <Search />
          </button>

          <span className={styles.theme}>
            {dark ? (
              <Moon size={25} onClick={toggleTheme} />
            ) : (
              <Sun size={25} onClick={toggleTheme} />
            )}
          </span>

          {searchResults.length > 0 && (
            <div className={styles.searchDropdown}>
              {searchResults.map((result, idx) => (
                <Link to="/details" key={idx} onClick={() => getData(result)}>
                  <div
                    className={styles.searchItem}
                    onClick={() => {
                      setSearchResults([]);
                      setShowInput(false);
                    }}
                  >
                    <strong>{result.type}:</strong> {result.name}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </span>

        <div className={styles.adminWrapper} ref={dropdownRef}>
          <button className={styles.adminBtn} onClick={toggleAdminDropdown}>
            <img src={avatar} alt="user icon" width={25} />
          </button>

          {dropdownOpen && (
            <div className={styles.adminDropdown}>
              <div className={styles.profileHeader}>
                <img
                  src={avatar}
                  alt="User Avatar"
                  className={styles.profilePic}
                />
                <span className={styles.username}>Rahul</span>
              </div>
              <hr />
              <ul>
                <li>
                  <Link
                    to="/admin_Profile"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Edit Profile
                  </Link>
                </li>
                <li>
                  <Link to="/emails" onClick={() => setDropdownOpen(false)}>
                    View Emails
                  </Link>
                </li>
                <li>
                  <Link
                    to="/change_password"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Change Password
                  </Link>
                </li>
                <li>
                  <button className={styles.logoutBtn} onClick={logoutUser}>
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <button
          ref={menuBtnRef}
          className={styles.menuBtn}
          onClick={toggleNavbar}
        >
          {menuOpen ? <IoMdClose size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
