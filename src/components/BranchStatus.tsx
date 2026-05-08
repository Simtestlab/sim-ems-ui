import React from 'react'
import styles from './BranchStatus.module.css'

const items = [
  { label: 'Normal', color: '#4cd964' },
  { label: 'Low Output', color: '#f5a623' },
  { label: 'Zero Output', color: '#ff3b30' },
  { label: 'Disconnected', color: '#b7c6d1' },
]

export default function BranchStatus() {
  return (
    <div className={styles.row}>
      <div className={styles.label}>Branch Status :</div>
      <div className={styles.items}>
        {items.map((it) => (
          <div key={it.label} className={styles.item}><span className={styles.dot} style={{ background: it.color }} /> {it.label}</div>
        ))}
      </div>
    </div>
  )
}
