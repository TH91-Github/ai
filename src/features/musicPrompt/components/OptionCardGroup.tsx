import React from 'react';
import styles from './OptionGroups.module.scss';

interface CardOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

interface Props<T extends string> {
  options: CardOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const OptionCardGroup = <T extends string>({
  options,
  value,
  onChange,
}: Props<T>) => (
  <div className={styles.cardGroup}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className={value === option.value ? styles.cardActive : styles.card}
        onClick={() => onChange(option.value)}
      >
        <strong>{option.label}</strong>
        <small>{option.description}</small>
      </button>
    ))}
  </div>
);
