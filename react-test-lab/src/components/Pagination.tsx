import { Button } from './Button'

type PaginationProps = {
  page: number
  pageCount: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, total, onPageChange }: PaginationProps) {
  if (pageCount <= 0) return null

  return (
    <div className="pagination" data-testid="pagination">
      <span data-testid="pagination-summary">
        Page {page} of {pageCount} · {total} items
      </span>
      <div className="pagination-pages">
        <Button
          variant="ghost"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          data-testid="pagination-prev"
          aria-label="Previous page"
        >
          Prev
        </Button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === page ? 'primary' : 'ghost'}
            onClick={() => onPageChange(p)}
            data-testid={`pagination-page-${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="ghost"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          data-testid="pagination-next"
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
