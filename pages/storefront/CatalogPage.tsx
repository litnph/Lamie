import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '../../app/analytics';
import type { NavigateOptions } from '../../app/router';
import { Dialog } from '../../components/storefront/Dialog';
import { AppLink } from '../../components/storefront/AppLink';
import { ArrowIcon, CloseIcon, FilterIcon, SearchIcon } from '../../components/storefront/Icons';
import { ProductCard } from '../../components/storefront/ProductCard';
import { ProductVisual } from '../../components/storefront/ProductVisual';
import { activeFilterCount, EMPTY_FILTERS, filterAndSortProducts, parseCatalogSearch, serializeCatalogFilters } from '../../features/catalog/catalog.logic';
import { labelFor, TAXONOMY } from '../../features/catalog/catalog.taxonomy';
import type { CatalogFilters, CatalogProduct } from '../../features/catalog/catalog.types';
import { formatProductPrice, statusLabel } from '../../utils/storefront-formatters';

interface CatalogPageProps {
  products: CatalogProduct[];
  includeDemo: boolean;
  search: string;
  navigate: (to: string, options?: NavigateOptions) => void;
  onContact: (context?: { intent?: string; productName?: string; sku?: string; productUrl?: string }) => void;
}

type FilterArrayKey = 'occasions' | 'lines' | 'forms' | 'flowers' | 'colors' | 'palettes' | 'styles' | 'collections' | 'statuses';

interface FilterGroupProps {
  title: string;
  group: FilterArrayKey;
  options: { value: string; label: string }[];
  filters: CatalogFilters;
  products: CatalogProduct[];
  onToggle: (group: FilterArrayKey, value: string) => void;
  open?: boolean;
}

const productValues = (product: CatalogProduct, group: FilterArrayKey): string[] => {
  if (group === 'lines') return [product.line];
  if (group === 'forms') return [product.form];
  if (group === 'statuses') return [product.status];
  return product[group];
};

const FilterGroup = ({ title, group, options, filters, products, onToggle, open = false }: FilterGroupProps) => (
  <details className="filter-group" open={open}>
    <summary>{title}<span>{filters[group].length || ''}</span></summary>
    <div className="filter-options">
      {options.map((option) => {
        const count = products.filter((product) => productValues(product, group).includes(option.value)).length;
        if (!count) return null;
        return (
          <label key={option.value}>
            <input type="checkbox" checked={filters[group].includes(option.value)} onChange={() => onToggle(group, option.value)} />
            <span>{option.label}</span>
            <small>{count}</small>
          </label>
        );
      })}
    </div>
  </details>
);

interface FiltersPanelProps {
  filters: CatalogFilters;
  products: CatalogProduct[];
  includeDemo: boolean;
  onToggle: (group: FilterArrayKey, value: string) => void;
  onChange: (next: CatalogFilters) => void;
  onClear: () => void;
}

const FiltersPanel = ({ filters, products, includeDemo, onToggle, onChange, onClear }: FiltersPanelProps) => {
  const groups: Omit<FilterGroupProps, 'filters' | 'products' | 'onToggle'>[] = [
    { title: 'Dịp', group: 'occasions', options: TAXONOMY.occasions.map((value) => ({ value, label: value })), open: true },
    { title: 'Dòng sản phẩm', group: 'lines', options: TAXONOMY.lines.map(({ id, label }) => ({ value: id, label })), open: true },
    { title: 'Kiểu dáng', group: 'forms', options: TAXONOMY.forms.map(({ id, label }) => ({ value: id, label })), open: true },
    { title: 'Hoa chủ đạo', group: 'flowers', options: TAXONOMY.flowers.map((value) => ({ value, label: value })) },
    { title: 'Màu chính', group: 'colors', options: TAXONOMY.colors.map((value) => ({ value, label: value })) },
    { title: 'Bảng màu', group: 'palettes', options: TAXONOMY.palettes.map((value) => ({ value, label: value })) },
    { title: 'Phong cách', group: 'styles', options: TAXONOMY.styles.map((value) => ({ value, label: value })) },
    { title: 'Bộ sưu tập', group: 'collections', options: TAXONOMY.collections.map((value) => ({ value, label: value })) },
    { title: 'Trạng thái', group: 'statuses', options: TAXONOMY.statuses.map(({ id, label }) => ({ value: id, label })) },
  ];

  return (
    <div className="filters-panel">
      <div className="filters-panel__top"><h2>Lọc mẫu hoa</h2><button type="button" onClick={onClear}>Xóa tất cả</button></div>
      <div className="quote-filter">
        <label>
          <input type="checkbox" checked={filters.quoteOnly} onChange={(event) => onChange({ ...filters, quoteOnly: event.target.checked })} />
          <span>Chỉ mẫu liên hệ báo giá</span>
        </label>
      </div>
      {includeDemo ? (
        <details className="filter-group" open>
          <summary>Ngân sách <span>{filters.minPrice !== null || filters.maxPrice !== null ? '1' : ''}</span></summary>
          <div className="budget-demo-note">Chỉ dùng giá kiểm thử trong chế độ preview.</div>
          <div className="budget-inputs">
            <label>Từ<input type="number" min="0" step="50000" value={filters.minPrice ?? ''} onChange={(event) => onChange({ ...filters, minPrice: event.target.value ? Number(event.target.value) : null })} /></label>
            <label>Đến<input type="number" min="0" step="50000" value={filters.maxPrice ?? ''} onChange={(event) => onChange({ ...filters, maxPrice: event.target.value ? Number(event.target.value) : null })} /></label>
          </div>
        </details>
      ) : null}
      {groups.map((group) => <FilterGroup key={group.group} {...group} filters={filters} products={products} onToggle={onToggle} />)}
    </div>
  );
};

interface ActiveChip { id: string; label: string; clear: () => void }

export default function CatalogPage({ products, includeDemo, search, navigate, onContact }: CatalogPageProps) {
  const filters = useMemo(() => parseCatalogSearch(search), [search]);
  const filtered = useMemo(() => filterAndSortProducts(products, filters), [filters, products]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickView, setQuickView] = useState<CatalogProduct | null>(null);

  useEffect(() => setVisibleCount(12), [search]);

  const commit = (next: CatalogFilters, replace = false) => {
    const query = serializeCatalogFilters(next);
    navigate(`/mau-hoa${query ? `?${query}` : ''}`, { replace, preserveScroll: true });
  };

  const toggle = (group: FilterArrayKey, value: string) => {
    const selected = filters[group].includes(value)
      ? filters[group].filter((item) => item !== value)
      : [...filters[group], value];
    trackEvent({ event: 'filter', label: group });
    commit({ ...filters, [group]: selected });
  };

  const activeChips: ActiveChip[] = [];
  if (filters.query) activeChips.push({ id: 'query', label: `Tìm: ${filters.query}`, clear: () => commit({ ...filters, query: '' }) });
  (['occasions', 'flowers', 'colors', 'palettes', 'styles', 'collections'] as FilterArrayKey[]).forEach((group) => {
    filters[group].forEach((value) => activeChips.push({ id: `${group}-${value}`, label: value, clear: () => toggle(group, value) }));
  });
  (['lines', 'forms', 'statuses'] as FilterArrayKey[]).forEach((group) => {
    filters[group].forEach((value) => activeChips.push({ id: `${group}-${value}`, label: labelFor(group as 'lines' | 'forms' | 'statuses', value), clear: () => toggle(group, value) }));
  });
  if (filters.quoteOnly) activeChips.push({ id: 'quote', label: 'Liên hệ báo giá', clear: () => commit({ ...filters, quoteOnly: false }) });
  if (filters.minPrice !== null || filters.maxPrice !== null) activeChips.push({ id: 'budget', label: 'Khoảng giá demo', clear: () => commit({ ...filters, minPrice: null, maxPrice: null }) });

  const shown = filtered.slice(0, visibleCount);
  const activeCount = activeFilterCount(filters);

  return (
    <main id="main-content" className="catalog-page">
      {includeDemo ? <div className="preview-notice" role="status"><span>Chế độ xem trước</span><p>24 mẫu và giá dưới đây là dữ liệu demo, không xuất hiện trong production.</p></div> : null}
      <header className="catalog-intro container-wide">
        <div>
          <h1>Mẫu hoa Lamie</h1>
          <p>Tìm theo dịp, dòng hoa, kiểu dáng hoặc cụm từ tự nhiên. Mọi mẫu vẫn cần Lamie xác nhận trước khi chuẩn bị.</p>
        </div>
        <button type="button" className="button button--outline" onClick={() => onContact({ intent: 'Mình chưa biết chọn mẫu nào' })}>Nhờ Lamie chọn giúp <ArrowIcon /></button>
      </header>

      <section className="catalog-tools container-wide" aria-label="Tìm kiếm và sắp xếp">
        <label className="search-field">
          <span className="sr-only">Tìm mẫu hoa</span>
          <SearchIcon />
          <input
            type="search"
            value={filters.query}
            placeholder="Tìm hoa hồng đỏ, bó tốt nghiệp, sao xanh…"
            onChange={(event) => {
              trackEvent({ event: 'search' });
              commit({ ...filters, query: event.target.value }, true);
            }}
          />
        </label>
        <button type="button" className="filter-trigger" onClick={() => setFiltersOpen(true)}>
          <FilterIcon /> Bộ lọc {activeCount ? <span>{activeCount}</span> : null}
        </button>
        <label className="sort-control">
          <span>Sắp xếp</span>
          <select value={filters.sort} onChange={(event) => commit({ ...filters, sort: event.target.value as CatalogFilters['sort'] })}>
            <option value="curated">Lamie đề xuất</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="name">Tên A–Z</option>
          </select>
        </label>
      </section>

      {activeChips.length ? (
        <div className="active-filters container-wide" aria-label="Bộ lọc đang áp dụng">
          {activeChips.map((chip) => <button type="button" key={chip.id} onClick={chip.clear}>{chip.label}<CloseIcon /></button>)}
          <button type="button" className="clear-filters" onClick={() => commit(EMPTY_FILTERS)}>Xóa tất cả</button>
        </div>
      ) : null}

      <div className="catalog-layout container-wide">
        <aside className="catalog-sidebar" aria-label="Bộ lọc catalog">
          <FiltersPanel filters={filters} products={products} includeDemo={includeDemo} onToggle={toggle} onChange={commit} onClear={() => commit(EMPTY_FILTERS)} />
        </aside>

        <div className="catalog-results">
          <div className="results-heading">
            <p aria-live="polite"><strong>{filtered.length}</strong> mẫu phù hợp</p>
            <p>{shown.length < filtered.length ? `Đang hiển thị ${shown.length}` : 'Đã hiển thị tất cả'}</p>
          </div>

          {!products.length ? (
            <div className="honest-empty">
              <h2>Catalog production đang chờ dữ liệu thật.</h2>
              <p>Không có sản phẩm được công bố thay vì âm thầm dùng dữ liệu demo hoặc giá thử nghiệm. Lamie vẫn có thể tư vấn trực tiếp.</p>
              <button type="button" className="button button--ink" onClick={() => onContact()}>Liên hệ Lamie</button>
            </div>
          ) : null}

          {products.length > 0 && filtered.length === 0 ? (
            <div className="honest-empty">
              <h2>Không có mẫu khớp với {activeCount} điều kiện đang chọn.</h2>
              <p>Hãy gỡ một điều kiện, xóa tất cả hoặc gửi nhu cầu để Lamie gợi ý trong phạm vi phù hợp.</p>
              <div className="empty-actions">
                <button type="button" className="button button--outline" onClick={() => commit(EMPTY_FILTERS)}>Xóa tất cả bộ lọc</button>
                <button type="button" className="button button--ink" onClick={() => onContact({ intent: 'Mình cần gợi ý vì chưa tìm thấy mẫu phù hợp' })}>Nhờ Lamie tư vấn</button>
              </div>
            </div>
          ) : null}

          {shown.length ? (
            <div className="product-grid catalog-product-grid">
              {shown.map((product, index) => <ProductCard key={product.id} product={product} navigate={navigate} onQuickView={setQuickView} priority={index < 4} />)}
            </div>
          ) : null}

          {visibleCount < filtered.length ? (
            <div className="load-more"><button type="button" className="button button--outline" onClick={() => setVisibleCount((count) => count + 12)}>Xem thêm {Math.min(12, filtered.length - visibleCount)} mẫu</button></div>
          ) : null}
        </div>
      </div>

      <Dialog open={filtersOpen} title={`Bộ lọc · ${filtered.length} mẫu`} onClose={() => setFiltersOpen(false)} variant="sheet" className="filter-sheet">
        <div className="filter-sheet__body">
          <FiltersPanel filters={filters} products={products} includeDemo={includeDemo} onToggle={toggle} onChange={commit} onClear={() => commit(EMPTY_FILTERS)} />
        </div>
        <div className="filter-sheet__footer">
          <button type="button" className="button button--text" onClick={() => commit(EMPTY_FILTERS)}>Xóa tất cả</button>
          <button type="button" className="button button--ink" onClick={() => setFiltersOpen(false)}>Xem {filtered.length} mẫu</button>
        </div>
      </Dialog>

      <Dialog open={Boolean(quickView)} title="Xem nhanh mẫu hoa" onClose={() => setQuickView(null)} className="quick-view-dialog">
        {quickView ? (
          <div className="quick-view">
            <ProductVisual image={quickView.images[0]} name={quickView.name} />
            <div>
              {quickView.isDemo ? <span className="inline-demo-note">Dữ liệu demo</span> : null}
              <p className="product-code">{quickView.sku}</p>
              <h3>{quickView.name}</h3>
              <p className="detail-price">{formatProductPrice(quickView)}</p>
              <p>{statusLabel(quickView.status)} · {labelFor('lines', quickView.line)} · {labelFor('forms', quickView.form)}</p>
              <div className="quick-view__actions">
                <AppLink href={`/mau-hoa/${quickView.slug}`} navigate={(to) => { setQuickView(null); navigate(to); }} className="button button--ink">Xem chi tiết <ArrowIcon /></AppLink>
                <button type="button" className="button button--outline" onClick={() => onContact({
                  productName: quickView.name,
                  sku: quickView.sku,
                  productUrl: `${window.location.origin}/mau-hoa/${quickView.slug}`,
                })}>Liên hệ mẫu này</button>
              </div>
            </div>
          </div>
        ) : null}
      </Dialog>
    </main>
  );
}
