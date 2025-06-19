import React, { useEffect, useState } from "react";
import styles from "./user.module.css";
import UserModal from "../../Components/UserModal/UserModal";
import NewUserForm from "../../Components/NewUserForm/NewUserForm";

import { useUserData } from "../../Store/UseContexts/UseContexts";
import { images } from "../../constantData";
import { useLocation } from "react-router-dom";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterTotalTasks, setFilterTotalTasks] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(true);


  const location = useLocation();
  const assignedUserNav = location.state?.asignedUser;

  const { usersList, refetchUsers } = useUserData();

 useEffect(() => {
  if (usersList.length > 0) {
    if (assignedUserNav) {
      const filtered = usersList.filter(
        (user) =>
          `${user.full_name}`.toLowerCase() ===
          assignedUserNav.toLowerCase()
      );
      setUsers(filtered);
      setShowAll(false);
    } else {
      setUsers(usersList);
      setShowAll(true);
    }
  } else {
    setUsers([]);
  }
  setLoading(false);
}, [usersList, assignedUserNav]);



useEffect(() => {
  refetchUsers(); // ✅ reload data every time page loads
}, []);



  const filteredUsers = users.filter(
    (user) =>
      (filterName === "" ||
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(filterName.toLowerCase())) &&
      (filterTotalTasks === "" ||
        user.totalTasks?.toString().includes(filterTotalTasks)) &&
      (filterStatus === "All" || user.status === filterStatus)
  );

  if (loading) {
    return <p>Loading Users Data.............</p>;
  }

  return (
    <>
      {showNewUserForm && (
        <div className={styles.newUserForm}>
          <NewUserForm
            onClose={() => setShowNewUserForm(false)}
            setShowNewUserForm={setShowNewUserForm}
          />
        </div>
      )}

      {modalData && (
        <UserModal
          user={modalData}
          mode={modalMode}
          onClose={() => setModalData(null)}
        />
      )}

      <div className={styles.container}>
        <div className={styles.filter}>
          <div className={styles.filterBar}>
            <input
              type="text"
              placeholder="Filter by name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className={styles.filterInput}
            />
            <input
              type="number"
              placeholder="Filter by total tasks"
              value={filterTotalTasks}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || Number(value) >= 0) {
                  setFilterTotalTasks(value);
                }
              }}
              className={styles.filterInput}
              min={0}
            />
            <button
              className={styles.clearBtn}
              onClick={() => {
                setFilterName("");
                setFilterTotalTasks("");
                setFilterStatus("All");
              }}
            >
              Clear Filter
            </button>

            {!showAll && (
              <button
               className={styles.showAllBtn}
                onClick={() => {
                  setUsers(usersList);
                  setShowAll(true);
                  window.history.replaceState({}, document.title); // clear assignedUserNav
                }}
              >
                Show All Users
              </button>
            )}

          </div>
          <button
            className={styles.addUserBtn}
            onClick={() => setShowNewUserForm(true)}
          >
            Add User
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>NAME</th>
                <th>TOTAL TASK</th>
                <th>PENDING</th>
                <th>DATE JOINED</th>
                <th>NOTIFICATIONS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.noDataFound}>
                    No users Found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.full_name}</td>
                    <td>{user.totalTasks}</td>
                    <td>{user.pending}</td>
                    <td>{user.date_joined}</td>
                    <td>{user.notification}</td>
                    <td className={styles.modifyRow}>
                      <button
                        className={styles.view}
                        onClick={() => {
                          setModalData(user);
                          setModalMode("view");
                        }}
                      >
                        <i className="fa-solid fa-eye" />
                      </button>
                      <button
                        className={styles.edit}
                        onClick={() => {
                          setModalData(user);
                          setModalMode("edit");
                        }}
                      >
                        <img src={images.editIcon} width={20} alt="edit" />
                      </button>
                      <button
                        className={styles.delete}
                        onClick={() => {
                          setModalData(user);
                          setModalMode("delete");
                        }}
                      >
                        <img src={images.deleteicon} width={20} alt="delete" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserTable;
