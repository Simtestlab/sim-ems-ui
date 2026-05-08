import React from 'react'
import styles from './SearchBar.module.css'

export default function SearchBar({ placeholder = 'Equipment Name' }: { placeholder?: string }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrap}>
        <svg className={styles.icon} viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4a7 7 0 1 0 4.9 12l4.1 4" stroke="#b7c6d1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input className={styles.input} placeholder={placeholder} />
      </div>
    </div>
  )
}
