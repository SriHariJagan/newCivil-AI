import React from "react";
import styles from "./emails.module.css";
import EmailCard from "../../Components/EmailCard/EmailCard";

const Emails = () => {
  return (
    <div className={styles.emailContainer}>
      <EmailCard
        subject="Project Proposal"
        content="Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback."
        attachmentName="proposal.pdf"
        attachmentUrl="/files/proposal.pdf"
      />
      <EmailCard
        subject="Civil AI"
        content="Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback."
        attachmentName="proposal.pdf"
        attachmentUrl="/files/proposal.pdf"
      />
      <EmailCard
        subject="Project"
        content="Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback."
        attachmentName="proposal.pdf"
        attachmentUrl="/files/proposal.pdf"
      />
      <EmailCard
        subject="Project"
        content="Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback."
        attachmentName="proposal.pdf"
        attachmentUrl="/files/proposal.pdf"
      />
      <EmailCard
        subject="Project"
        content="Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback."
        attachmentName="proposal.pdf"
        attachmentUrl="/files/proposal.pdf"
      />
      <EmailCard
        subject="Project"
        content="Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback Please find the attached project proposal. Let me know your feedback."
        attachmentName="proposal.pdf"
        attachmentUrl="/files/proposal.pdf"
      />
    </div>
  );
};

export default Emails;
