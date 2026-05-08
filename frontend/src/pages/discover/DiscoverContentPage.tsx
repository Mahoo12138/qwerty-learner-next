import { useState } from 'react'
import {
	BookOpen,
	Clock3,
	Compass,
	FileText,
	MessageSquareText,
	RefreshCw,
	ShieldCheck,
	Sparkles,
	Trash2,
	Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import {
	useCreateLibrarySubscription,
	useDeleteLibrarySubscription,
	useLibraryDiscovery,
} from '@/api/library'
import { Badge } from '@/components/core/Badge'
import { Button } from '@/components/core/Button'
import * as css from '@/styles/pages/discoverContent.css'
import type {
	ContentLibraryType,
	DiscoveryLibraryItem,
	DiscoverySubscriptionItem,
	LibraryDiscoveryPayload,
} from '@/types/api'

type DiscoveryFilter = 'all' | ContentLibraryType
type DiscoveryBadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'

const EMPTY_DISCOVERY_PAYLOAD: LibraryDiscoveryPayload = {
	system_libraries: [],
	community_libraries: [],
	subscriptions: [],
}

const LIBRARY_TYPE_META: Record<
	ContentLibraryType,
	{ label: string; countUnit: string; icon: LucideIcon }
> = {
	word_bank: { label: '词库', countUnit: '词条', icon: BookOpen },
	sentence_bank: { label: '句库', countUnit: '句子', icon: MessageSquareText },
	article_bank: { label: '文章库', countUnit: '文章', icon: FileText },
}

const FILTER_OPTIONS: Array<{ value: DiscoveryFilter; label: string; icon: LucideIcon }> = [
	{ value: 'all', label: '全部内容', icon: Compass },
	{ value: 'word_bank', label: '词库', icon: BookOpen },
	{ value: 'sentence_bank', label: '句库', icon: MessageSquareText },
	{ value: 'article_bank', label: '文章库', icon: FileText },
]

export function DiscoverContentPage() {
	const [activeFilter, setActiveFilter] = useState<DiscoveryFilter>('all')
	const discoveryQuery = useLibraryDiscovery()
	const subscribeMutation = useCreateLibrarySubscription()
	const unsubscribeMutation = useDeleteLibrarySubscription()
	const data = discoveryQuery.data ?? EMPTY_DISCOVERY_PAYLOAD

	const systemLibraries = filterDiscoveryItems(data.system_libraries, activeFilter)
	const communityLibraries = filterDiscoveryItems(data.community_libraries, activeFilter)
	const subscriptions = filterDiscoveryItems(data.subscriptions, activeFilter)

	const subscribeKey = subscribeMutation.isPending
		? libraryKey(subscribeMutation.variables?.library_type, subscribeMutation.variables?.library_id)
		: null
	const unsubscribeKey = unsubscribeMutation.isPending
		? libraryKey(unsubscribeMutation.variables?.libraryType, unsubscribeMutation.variables?.libraryId)
		: null

	const totalPublicLibraries = data.system_libraries.length + data.community_libraries.length
	const totalSystemLibraries = data.system_libraries.length
	const totalSubscriptions = data.subscriptions.length

	const handleSubscribe = (item: DiscoveryLibraryItem) => {
		subscribeMutation.mutate({
			library_type: item.library_type,
			library_id: item.id,
		})
	}

	const handleUnsubscribe = (item: DiscoverySubscriptionItem) => {
		unsubscribeMutation.mutate({
			libraryType: item.library_type,
			libraryId: item.id,
		})
	}

	return (
		<div className={css.pageRoot}>
			<section className={css.hero}>
				<div className={css.heroGrid}>
					<div className={css.heroCopy}>
						<div className={css.heroIntro}>
							<p className={css.heroEyebrow}>发现内容</p>
							<h1 className={css.heroTitle}>浏览系统默认与他人公开内容库</h1>
							<p className={css.heroDescription}>
								这里专门负责发现可订阅的词库、句库和文章库。你的内容管理页继续只处理自己创建的内容，这一页只展示系统默认和其他用户公开分享的内容。
							</p>
						</div>
						<div className={css.heroBadgeRow}>
							<Badge variant="default">系统默认</Badge>
							<Badge variant="secondary">用户共享公开</Badge>
							<Badge variant="outline">我的订阅</Badge>
							{discoveryQuery.isFetching && <Badge variant="secondary">同步中</Badge>}
						</div>
						<div className={css.filterRow} role="tablist" aria-label="内容类型筛选">
							{FILTER_OPTIONS.map(({ value, label, icon: Icon }) => (
								<button
									key={value}
									type="button"
									className={value === activeFilter ? css.filterButtonActive : css.filterButton}
									onClick={() => setActiveFilter(value)}
									aria-pressed={value === activeFilter}
								>
									<Icon size={16} />
									{label}
								</button>
							))}
						</div>
					</div>

					<div className={css.statsGrid}>
						<StatCard label="公开内容库" value={String(totalPublicLibraries)} hint="跨词库、句库、文章库统一浏览" icon={Sparkles} />
						<StatCard label="系统默认" value={String(totalSystemLibraries)} hint="优先展示官方预置内容" icon={ShieldCheck} />
						<StatCard label="我的订阅" value={String(totalSubscriptions)} hint="随时回看当前已订阅内容" icon={Users} />
					</div>
				</div>
			</section>

			{discoveryQuery.isError ? (
				<section className={css.statusCard}>
					<h2 className={css.statusTitle}>发现页数据加载失败</h2>
					<p className={css.statusDescription}>{formatQueryError(discoveryQuery.error)}</p>
					<Button type="button" variant="outline" onClick={() => void discoveryQuery.refetch()}>
						<RefreshCw size={16} />
						重新加载
					</Button>
				</section>
			) : (
				<div className={css.contentGrid}>
					<div className={css.browseStack}>
						<BrowseSection
							eyebrow="系统默认"
							title="官方预置内容库"
							description="适合作为开箱即用的练习素材，后续可以继续扩展更多系统内容。"
							items={systemLibraries}
							loading={discoveryQuery.isLoading}
							emptyText={activeFilter === 'all' ? '当前没有可展示的系统默认库。' : `当前筛选下没有系统默认${filterLabel(activeFilter)}。`}
							onSubscribe={handleSubscribe}
							pendingKey={subscribeKey}
						/>

						<BrowseSection
							eyebrow="用户共享"
							title="他人公开内容库"
							description="这里只显示其他用户公开分享的内容，自己创建的库仍然只在内容管理页维护。"
							items={communityLibraries}
							loading={discoveryQuery.isLoading}
							emptyText={activeFilter === 'all' ? '还没有其他用户公开内容库。' : `当前筛选下没有他人公开的${filterLabel(activeFilter)}。`}
							onSubscribe={handleSubscribe}
							pendingKey={subscribeKey}
						/>
					</div>

					<aside className={css.subscriptionPanel}>
						<div className={css.subscriptionHeader}>
							<div className={css.subscriptionIntro}>
								<p className={css.sectionEyebrow}>我的订阅</p>
								<h2 className={css.sectionTitle}>已订阅内容库</h2>
								<p className={css.sectionDescription}>这里保留你当前订阅的所有内容库，包括暂时不可用的订阅记录。</p>
							</div>
							<Button type="button" variant="ghost" size="sm" onClick={() => void discoveryQuery.refetch()}>
								<RefreshCw size={16} />
								刷新
							</Button>
						</div>

						{subscriptions.length > 0 ? (
							<div className={css.subscriptionList}>
								{subscriptions.map((item) => (
									<SubscriptionCard
										key={libraryKey(item.library_type, item.id)}
										item={item}
										onUnsubscribe={handleUnsubscribe}
										pending={unsubscribeKey === libraryKey(item.library_type, item.id)}
									/>
								))}
							</div>
						) : (
							<div className={css.emptyState}>
								<h3 className={css.emptyTitle}>还没有订阅内容</h3>
								<p className={css.emptyDescription}>从左侧先挑一个公开内容库开始订阅，这里会自动同步显示。</p>
							</div>
						)}
					</aside>
				</div>
			)}
		</div>
	)
}

function BrowseSection({
	eyebrow,
	title,
	description,
	items,
	loading,
	emptyText,
	onSubscribe,
	pendingKey,
}: {
	eyebrow: string
	title: string
	description: string
	items: DiscoveryLibraryItem[]
	loading: boolean
	emptyText: string
	onSubscribe: (item: DiscoveryLibraryItem) => void
	pendingKey: string | null
}) {
	return (
		<section className={css.sectionCard}>
			<div className={css.sectionHeader}>
				<div className={css.sectionIntro}>
					<p className={css.sectionEyebrow}>{eyebrow}</p>
					<h2 className={css.sectionTitle}>{title}</h2>
					<p className={css.sectionDescription}>{description}</p>
				</div>
				<span className={css.sectionCount}>{items.length}</span>
			</div>

			{items.length > 0 ? (
				<div className={css.libraryRail}>
					{items.map((item) => (
						<BrowseCard
							key={libraryKey(item.library_type, item.id)}
							item={item}
							onSubscribe={onSubscribe}
							pending={pendingKey === libraryKey(item.library_type, item.id)}
						/>
					))}
				</div>
			) : (
				<div className={css.emptyState}>
					<h3 className={css.emptyTitle}>{loading ? '正在加载内容' : '暂时没有内容'}</h3>
					<p className={css.emptyDescription}>{loading ? '发现页数据正在同步，请稍候。' : emptyText}</p>
				</div>
			)}
		</section>
	)
}

function BrowseCard({
	item,
	onSubscribe,
	pending,
}: {
	item: DiscoveryLibraryItem
	onSubscribe: (item: DiscoveryLibraryItem) => void
	pending: boolean
}) {
	const meta = LIBRARY_TYPE_META[item.library_type]
	const Icon = meta.icon
	const subscribed = item.is_subscribed === 1

	return (
		<article className={css.libraryCard}>
			<div className={css.libraryCardTop}>
				<div className={css.libraryIconWrap}>
					<Icon size={20} />
				</div>
				<div className={css.badgeWrap}>
					{libraryBadges(item).map((badge) => (
						<Badge key={`${item.id}-${badge.label}`} variant={badge.variant}>
							{badge.label}
						</Badge>
					))}
				</div>
			</div>

			<div className={css.libraryTitleBlock}>
				<h3 className={css.libraryTitle}>{item.name}</h3>
				<p className={css.libraryDescription}>{librarySummary(item)}</p>
			</div>

			<div className={css.libraryMetaRow}>
				<span>{formatItemCount(item)}</span>
				<span>{formatLibraryDate(item.updated_at, '更新')}</span>
			</div>

			<div className={css.cardFooter}>
				<p className={css.cardFootnote}>{item.is_system === 1 ? '系统默认内容，适合直接订阅使用。' : '用户公开分享内容，适合扩展练习来源。'}</p>
				<Button
					type="button"
					variant={subscribed ? 'outline' : 'default'}
					size="sm"
					onClick={() => onSubscribe(item)}
					disabled={subscribed || pending}
				>
					{pending ? '订阅中...' : subscribed ? '已订阅' : '订阅内容库'}
				</Button>
			</div>
		</article>
	)
}

function SubscriptionCard({
	item,
	onUnsubscribe,
	pending,
}: {
	item: DiscoverySubscriptionItem
	onUnsubscribe: (item: DiscoverySubscriptionItem) => void
	pending: boolean
}) {
	const meta = LIBRARY_TYPE_META[item.library_type]
	const Icon = meta.icon
	const unavailable = item.is_available !== 1

	return (
		<article className={unavailable ? css.subscriptionCardUnavailable : css.subscriptionCard}>
			<div className={css.subscriptionCardTop}>
				<div className={css.subscriptionIconWrap}>
					<Icon size={18} />
				</div>
				<div className={css.subscriptionTitleBlock}>
					<h3 className={css.subscriptionTitle}>{item.name}</h3>
					<div className={css.subscriptionMetaRow}>
						<Badge variant="secondary">{meta.label}</Badge>
						{item.is_system === 1 ? <Badge variant="default">系统</Badge> : <Badge variant="outline">公开</Badge>}
						{unavailable && <Badge variant="warning">不可用</Badge>}
					</div>
				</div>
			</div>

			<p className={css.subscriptionDescription}>
				{unavailable ? unavailableReasonLabel(item.unavailable_reason) : librarySummary(item)}
			</p>

			<div className={css.subscriptionDetailRow}>
				<span>{formatItemCount(item)}</span>
				<span>{formatLibraryDate(item.subscribed_at, '订阅')}</span>
			</div>

			<div className={css.subscriptionActions}>
				<span className={css.subscriptionStatus}>
					<Clock3 size={14} />
					{unavailable ? '保留订阅记录' : '订阅状态正常'}
				</span>
				<Button type="button" variant="outline" size="sm" onClick={() => onUnsubscribe(item)} disabled={pending}>
					<Trash2 size={14} />
					{pending ? '处理中...' : '取消订阅'}
				</Button>
			</div>
		</article>
	)
}

function StatCard({
	label,
	value,
	hint,
	icon: Icon,
}: {
	label: string
	value: string
	hint: string
	icon: LucideIcon
}) {
	return (
		<div className={css.statCard}>
			<div className={css.statCardTop}>
				<span className={css.statLabel}>{label}</span>
				<div className={css.statIconWrap}>
					<Icon size={16} />
				</div>
			</div>
			<strong className={css.statValue}>{value}</strong>
			<p className={css.statHint}>{hint}</p>
		</div>
	)
}

function filterDiscoveryItems<T extends { library_type: ContentLibraryType }>(items: T[], activeFilter: DiscoveryFilter) {
	if (activeFilter === 'all') {
		return items
	}
	return items.filter((item) => item.library_type === activeFilter)
}

function libraryKey(libraryType?: ContentLibraryType, libraryID?: string) {
	if (!libraryType || !libraryID) {
		return null
	}
	return `${libraryType}:${libraryID}`
}

function formatItemCount(item: { library_type: ContentLibraryType; item_count: number }) {
	const meta = LIBRARY_TYPE_META[item.library_type]
	return `${item.item_count.toLocaleString('zh-CN')} ${meta.countUnit}`
}

function formatLibraryDate(value: string | undefined, label: string) {
	if (!value || value.startsWith('0001-')) {
		return `${label}时间未知`
	}

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) {
		return `${label}时间未知`
	}

	return `${label}${new Intl.DateTimeFormat('zh-CN', {
		month: 'numeric',
		day: 'numeric',
	}).format(date)}`
}

function filterLabel(value: DiscoveryFilter) {
	if (value === 'all') {
		return '内容'
	}
	return LIBRARY_TYPE_META[value].label
}

function formatQueryError(error: unknown) {
	if (error instanceof Error && error.message.trim()) {
		return error.message
	}
	return '发现页数据请求失败，请稍后重试。'
}

function librarySummary(item: Pick<DiscoveryLibraryItem, 'library_type' | 'description' | 'language' | 'category'>) {
	if (item.library_type === 'sentence_bank' && item.category) {
		return `分类：${item.category}`
	}
	if (item.description && item.description.trim()) {
		return item.description.trim()
	}
	if (item.language && item.language.trim()) {
		return `语言：${item.language.toUpperCase()}`
	}

	switch (item.library_type) {
	case 'word_bank':
		return '用于扩展单词练习与词汇积累。'
	case 'sentence_bank':
		return '用于短句练习、句型熟悉和节奏训练。'
	case 'article_bank':
		return '用于长文跟打、阅读理解和段落练习。'
	default:
		return '用于扩展练习内容。'
	}
}

function libraryBadges(item: DiscoveryLibraryItem): Array<{ label: string; variant: DiscoveryBadgeVariant }> {
	const badges: Array<{ label: string; variant: DiscoveryBadgeVariant }> = [
		{ label: LIBRARY_TYPE_META[item.library_type].label, variant: 'secondary' },
		item.is_system === 1
			? { label: '系统默认', variant: 'default' }
			: { label: '用户共享', variant: 'outline' },
	]

	if (item.library_type === 'sentence_bank' && item.category) {
		badges.push({ label: item.category, variant: 'outline' })
	} else if (item.language) {
		badges.push({ label: item.language.toUpperCase(), variant: 'outline' })
	}

	return badges
}

function unavailableReasonLabel(reason?: string) {
	switch (reason) {
	case 'library_deleted':
		return '这个内容库已经被删除，但订阅记录仍然保留，便于你手动清理。'
	case 'library_private':
		return '这个内容库目前已转为私有，当前账号已无法继续访问。'
	case 'library_missing':
		return '这个内容库已经不存在，建议取消订阅后重新选择新的内容。'
	default:
		return '当前无法读取这个订阅内容库。'
	}
}