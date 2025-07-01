import React, { useState, useEffect } from "react";
import styles from "./logs.module.css";
import { Eye, Pencil, Trash2 } from "lucide-react";
import LogModal from "../../Components/LogsModal/LogModal";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [modalMode, setModalMode] = useState(null); // 'create', 'edit', 'delete'
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    setLogs([
      {
        id: 1,
        date: "2025-06-27",
        subject: "System Maintenance",
        receivedFrom: "admin@system.com",
        sentTo: "staff@company.com"
      },
      {
        id: 2,
        date: "2025-06-25",
        subject: "Meeting Update",
        receivedFrom: "hr@company.com",
        sentTo: "all@company.com"
      }
    ]);
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.subject.toLowerCase().includes(filterSubject.toLowerCase()) &&
      log.receivedFrom.toLowerCase().includes(filterFrom.toLowerCase()) &&
      log.sentTo.toLowerCase().includes(filterTo.toLowerCase())
  );

  const openModal = (mode, log = null) => {
    setModalMode(mode);
    setSelectedLog(log);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedLog(null);
  };

  const handleSave = (data) => {
    if (modalMode === "edit") {
      setLogs((prev) => prev.map((l) => (l.id === data.id ? data : l)));
    } else {
      setLogs((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
    closeModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <div className={styles.filterBar}>
          <input
            type="text"
            placeholder="Filter by Subject"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className={styles.filterInput}
          />
          <input
            type="text"
            placeholder="Received From"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className={styles.filterInput}
          />
          <input
            type="text"
            placeholder="Sent To"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className={styles.filterInput}
          />
          <button
            className={styles.clearBtn}
            onClick={() => {
              setFilterSubject("");
              setFilterFrom("");
              setFilterTo("");
            }}
          >
            Clear Filter
          </button>
        </div>
        <button
          className={styles.addLogBtn}
          onClick={() => openModal("create")}
        >
          Create Log
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Subject</th>
              <th>Received From</th>
              <th>Sent To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.noDataFound}>
                  No logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => (
                <tr key={log.id}>
                  <td>{index + 1}</td>
                  <td>{log.date}</td>
                  <td>{log.subject.length > 30 ? log.subject.slice(0, 40) + "..." : log.subject}</td>
                  <td>{log.receivedFrom}</td>
                  <td>{log.sentTo}</td>
                  <td className={styles.modifyRow}>
                     <button
                      className={styles.edit}
                      onClick={() => openModal("view", log)}
                    >
                      <span className="icon eye-icon"><Eye size={25} /></span>
                    </button>
                    <button
                      className={styles.edit}
                      onClick={() => openModal("edit", log)}
                    >
                      <span className="icon pencil-icon"><Pencil size={25} /></span>
                    </button>
                    <button
                      className={styles.delete}
                      onClick={() => openModal("delete", log)}
                    >
                      <span className="icon trash-icon"><Trash2 size={25} /></span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalMode && (
        <LogModal
          mode={modalMode}
          log={selectedLog}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Logs;
