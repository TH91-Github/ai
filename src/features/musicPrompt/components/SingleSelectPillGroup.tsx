import React from 'react';
import styles from './OptionGroups.module.scss';

interface PillOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: PillOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
}

export const SingleSelectPillGroup = <T extends string>({
  options,
  value,
  onChange,
}: Props<T>) => (
  <div className={styles.pillGroup}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className={value === option.value ? styles.pillActive : styles.pill}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);
