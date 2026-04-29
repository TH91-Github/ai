import React from 'react';
import styles from './TempPage.module.scss';

const previewHtml = String.raw``;

const TempPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>임시</h1>
        <p className={styles.pageDesc}>잠시 올려서 확인하는 HTML을 이 공간에서 바로 볼 수 있습니다.</p>
      </div>

      <iframe
        title="임시 HTML 미리보기"
        className={styles.previewFrame}
        srcDoc={previewHtml}
      />
    </div>
  );
};

export default TempPage;
