interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  showInfo?: boolean;
  infoText?: string;
  onPageChange?: (page: number) => void;
}

const Pagination = ({ currentPage = 1, totalPages = 3, showInfo, infoText, onPageChange }: PaginationProps) => {
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
    if (totalPages <= 3) return i + 1;
    if (currentPage <= 2) return i + 1;
    if (currentPage >= totalPages - 1) return totalPages - 2 + i;
    return currentPage - 1 + i;
  });
  const showEllipsis = totalPages > 4 && currentPage < totalPages - 2;
  const showLastPage = totalPages > 3 && !pages.includes(totalPages);

  const goTo = (p: number) => {
    if (p >= 1 && p <= totalPages && onPageChange) onPageChange(p);
  };

  return (
    <div className={showInfo ? "bg-muted/30 px-6 py-4 border-t border-border flex items-center justify-between" : "mt-12 flex justify-center"}>
      {showInfo && infoText && <p className="text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: infoText }} />}
      <nav className="flex items-center gap-1">
        <button
          onClick={() => goTo(currentPage - 1)}
          className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg border border-border bg-surface text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
          disabled={currentPage === 1}
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        {pages.map((n) => (
          <button
            key={n}
            onClick={() => goTo(n)}
            className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs font-medium transition-colors ${
              n === currentPage
                ? "bg-primary text-primary-foreground shadow-sm font-bold"
                : "border border-border bg-surface text-foreground hover:bg-muted"
            }`}
          >
            {n}
          </button>
        ))}
        {showEllipsis && <span className="text-muted-foreground px-1">...</span>}
        {showLastPage && (
          <button
            onClick={() => goTo(totalPages)}
            className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors bg-surface"
          >
            {totalPages}
          </button>
        )}
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg border border-border bg-surface text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
