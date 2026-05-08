import React from 'react'
import styles from './BreadcrumbTags.module.css'

export default function BreadcrumbTags() {
  const tags = ['PV']
  return (
    <div className={styles.container}>
      {tags.map((t) => (
        <span key={t} className={styles.chip}>{t} <button className={styles.x}>×</button></span>
      ))}
    </div>
  )
}
