import PageWrapper from '@/components/layout/PageWrapper'
import ClueForm from '@/components/clue-entry/ClueForm'
import HistoryList from '@/components/clue-entry/HistoryList'
import RelatedHint from '@/components/clue-entry/RelatedHint'

export default function ClueEntryPage() {
  return (
    <PageWrapper title="热点线索录入" subtitle="录入关键词、地点与首批链接，启动溯源分析">
      <div className="flex gap-8">
        <div className="w-72 shrink-0">
          <HistoryList />
        </div>
        <div className="flex-1 max-w-2xl">
          <ClueForm />
        </div>
      </div>
      <RelatedHint />
    </PageWrapper>
  )
}
