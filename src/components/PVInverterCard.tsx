import React from 'react'
import styles from './PVInverterCard.module.css'

export type PVInverterCardProps = {
  id?: string | number
  title: string
  ratedPower?: string
  activePower?: string
  dailyEnergy?: string
  loadRatio?: string
  dailyEffective?: string
  // operational state
  status?: 'normal' | 'standby' | 'shutdown' | 'alarm' | 'fault' | 'communicationLoss'
  // branch-level status for connector indicators
  branchStatus?: 'normal' | 'low' | 'zero' | 'disconnected'
  connectors?: number
}

export default function PVInverterCard({
  id,
  title,
  ratedPower = '125kW',
  activePower = '0 kW',
  dailyEnergy = '0 kWh',
  loadRatio = '0 %',
  dailyEffective = '0 h',
  status = 'normal',
  branchStatus = 'normal',
  connectors = 8,
}: PVInverterCardProps) {
  return (
    <div className={styles.card} aria-labelledby={`inv-${id}-title`}>
      <div className={styles.header}>
        <div className={styles.icon} aria-hidden>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="7" width="20" height="10" rx="2" fill="#EAF6FF" />
            <path d="M6 7L10 3H14L18 7" stroke="#87D3FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className={styles.titleWrap}>
          <div id={`inv-${id}-title`} className={styles.title}>{title}</div>
          <div className={styles.subtitle}>Rated Power: <span className={styles.muted}>{ratedPower}</span></div>
        </div>
        <div className={styles.statusBadge + ' ' + styles[status]}>{status.toUpperCase()}</div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statBlock}>
          <div className={styles.statLabel}>ACTIVE POWER</div>
          <div className={styles.statValue}>{activePower}</div>
        </div>
        <div className={styles.statBlock}>
          <div className={styles.statLabel}>DAILY ENERGY</div>
          <div className={styles.statValue}>{dailyEnergy}</div>
        </div>
        <div className={styles.statBlock}>
          <div className={styles.statLabel}>LOAD RATIO</div>
          <div className={styles.statValue}>{loadRatio}</div>
        </div>
        <div className={styles.statBlock}>
          <div className={styles.statLabel}>DAILY EFFECTIVE D.</div>
          <div className={styles.statValue}>{dailyEffective}</div>
        </div>
      </div>

      <div className={styles.connectors} aria-hidden>
        {Array.from({ length: connectors }).map((_, i) => (
          <span
            key={i}
            className={styles.connector}
            style={{
              background:
                branchStatus === 'normal'
                  ? '#9FE3A6'
                  : branchStatus === 'low'
                  ? '#F5C97A'
                  : branchStatus === 'zero'
                  ? '#FF9E9E'
                  : '#C6CED6',
            }}
          />
        ))}
      </div>
    </div>
  )
}
