import React from 'react'
import styles from './SiteSelect.module.css'

export default function SiteSelect() {
  return (
    <div className={styles.wrapper}>
      <select className={styles.select} defaultValue="Demo (100kW / 215kWh)">
        <option>Demo (100kW / 215kWh)</option>
      </select>
    </div>
  )
}
