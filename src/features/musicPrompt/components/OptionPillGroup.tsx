import React from 'react';
import styles from './OptionGroups.module.scss';

interface PillOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: PillOption<T>[];
  values: T[];
  maxSelect?: number;
  onToggle: (value: T) => void;
}

export const OptionPillGroup = <T extends string>({
  options,
  values,
  onToggle,
}: Props<T>) => (
  <div className={styles.pillGroup}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className={values.includes(option.value) ? styles.pillActive : styles.pill}
        onClick={() => onToggle(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);
