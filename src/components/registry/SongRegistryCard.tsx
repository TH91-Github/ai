import React from 'react';
import type { SongRegistryItem } from '@/types';
import styles from './SongRegistryCard.module.scss';

interface Props {
  item: SongRegistryItem;
  onClick: (item: SongRegistryItem) => void;
}

const SongRegistryCard: React.FC<Props> = ({ item, onClick }) => {
  return (
    <button type="button" className={styles.card} onClick={() => onClick(item)}>
      <div className={styles.statusRow}>
        <span className={item.status === 'registered' ? styles.statusRegistered : styles.statusUnregistered}>
          {item.status === 'registered' ? '등록' : '미등록'}
        </span>
      </div>
      <div className={styles.content}>
        <strong className={styles.title}>{item.title}</strong>
      </div>
    </button>
  );
};

export default SongRegistryCard;
