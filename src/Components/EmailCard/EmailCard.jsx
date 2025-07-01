import React, { useState } from "react";
import styles from "./emailCard.module.css";
import { FileText, Eye, Download, X } from "lucide-react";

const EmailCard = ({ subject, content, attachmentName, attachmentUrl }) => {
  const [showPreview, setShowPreview] = useState(false);

  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(attachmentName);
  const isPDF = /\.pdf$/i.test(attachmentName);

  return (
    <>
      <div className={styles.card}>
        <h3 className={styles.subject}>{subject}</h3>
        <p className={styles.content}>{content}</p>

        <div className={styles.attachment}>
          <FileText size={20} />
          <span className={styles.attachmentName}>{attachmentName}</span>
          <div className={styles.actions}>
            <button onClick={() => setShowPreview(true)}><Eye size={16} /> View</button>
            <a href={attachmentUrl} download className={styles.downloadBtn}>
              <Download size={16} /> Download
            </a>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setShowPreview(false)}>
              <X size={30} />
            </button>
            {isImage ? (
              <img src={attachmentUrl} alt="Attachment Preview" className={styles.previewImage} />
            ) : isPDF ? (
              <iframe src={attachmentUrl} title="PDF Preview" className={styles.previewPDF} />
            ) : (
              <p>Unsupported file format</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EmailCard;
