import { clsx } from 'clsx'
import type { ReactNode } from 'react'

import { Badge } from '@/components/core/Badge'
import * as css from '@/styles/pages/contentWorkspace.css'

import { CONTENT_STAGES, type ContentStage, type LibraryCardData } from './contentModel'

export function ContentWorkbench({
  stage,
  counts,
  onChange,
  children,
}: {
  stage: ContentStage
  counts: Record<ContentStage, number>
  onChange: (next: ContentStage) => void
  children: ReactNode
}) {
  return (
    <div className={css.workbenchStack}>
      <StageRail stage={stage} counts={counts} onChange={onChange} />
      <div className={css.workspaceGrid}>{children}</div>
    </div>
  )
}

export function StageRail({
  stage,
  counts,
  onChange,
}: {
  stage: ContentStage
  counts: Record<ContentStage, number>
  onChange: (next: ContentStage) => void
}) {
  return (
    <nav className={css.stageRail} aria-label="内容来源">
      {CONTENT_STAGES.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          className={clsx(css.stageCard, stage === key && css.stageCardActive)}
          onClick={() => onChange(key)}
        >
          <div className={css.stageCardIconWrap}>
            <Icon size={16} />
          </div>
          <div className={css.stageCardBody}>
              <div className={css.stageCardTopline}>
                <span className={css.stageCardLabel}>{label}</span>
                <Badge variant={stage === key ? 'default' : 'outline'}>{counts[key]}</Badge>
              </div>
            </div>
        </button>
      ))}
    </nav>
  )
}

export function LibraryListPane({
  title,
  description,
  items,
  selectedID,
  onSelect,
  empty,
  extra,
}: {
  title: string
  description: string
  items: LibraryCardData[]
  selectedID: string
  onSelect: (id: string) => void
  empty: string
  extra?: ReactNode
}) {
  return (
    <section className={css.listPane}>
      <header className={css.columnHeader}>
        <div>
          <p className={css.columnEyebrow}>来源书架</p>
          <h2 className={css.columnTitle}>{title}</h2>
          <p className={css.columnDescription}>{description}</p>
        </div>
        {extra}
      </header>

      <div className={css.libraryStack}>
        {items.length === 0 ? (
          <div className={css.emptyCard}>{empty}</div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(css.libraryCard, selectedID === item.id && css.libraryCardSelected)}
              onClick={() => onSelect(item.id)}
            >
              <div className={css.libraryCardTop}>
                <div>
                  <h3 className={css.libraryCardTitle}>{item.title}</h3>
                  <p className={css.libraryCardCaption}>{item.caption}</p>
                </div>
                <span className={css.libraryCardMeta}>{item.meta}</span>
              </div>
              <div className={css.libraryCardBadges}>
                {item.badges.map((badge) => (
                  <Badge key={`${item.id}-${badge.label}`} variant={badge.variant}>{badge.label}</Badge>
                ))}
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  )
}

export function DetailPane({
  kicker,
  title,
  description,
  meta,
  actions,
  children,
}: {
  kicker: string
  title: string
  description: string
  meta?: ReactNode
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className={css.detailPane}>
      <header className={css.detailHero}>
        <div className={css.detailHeroText}>
          <p className={css.detailEyebrow}>{kicker}</p>
          <h2 className={css.detailTitle}>{title}</h2>
          <p className={css.detailDescription}>{description}</p>
          {meta ? <div className={css.detailMetaRow}>{meta}</div> : null}
        </div>
        {actions ? <div className={css.detailActions}>{actions}</div> : null}
      </header>
      <div className={css.detailBody}>{children}</div>
    </section>
  )
}

export function SectionCard({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className={css.sectionCard}>
      <header className={css.sectionHeader}>
        <div>
          <h3 className={css.sectionTitle}>{title}</h3>
          {description ? <p className={css.sectionDescription}>{description}</p> : null}
        </div>
        {actions}
      </header>
      <div className={css.sectionBody}>{children}</div>
    </section>
  )
}

export function PermissionBanner({
  title,
  body,
  variant = 'warning',
}: {
  title: string
  body: string
  variant?: 'warning' | 'secondary' | 'default'
}) {
  return (
    <div className={css.permissionBanner}>
      <Badge variant={variant}>{title}</Badge>
      <p className={css.permissionText}>{body}</p>
    </div>
  )
}

export function UnavailableCard({
  title,
  body,
  actions,
}: {
  title: string
  body: string
  actions?: ReactNode
}) {
  return (
    <div className={css.unavailableCard}>
      <div>
        <h3 className={css.unavailableTitle}>{title}</h3>
        <p className={css.unavailableText}>{body}</p>
      </div>
      {actions ? <div className={css.unavailableActions}>{actions}</div> : null}
    </div>
  )
}

export function EmptyDetail({ title, body }: { title: string; body: string }) {
  return (
    <div className={css.emptyDetail}>
      <h3 className={css.emptyDetailTitle}>{title}</h3>
      <p className={css.emptyDetailText}>{body}</p>
    </div>
  )
}