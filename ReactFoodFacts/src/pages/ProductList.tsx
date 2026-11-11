import { useState, useReducer } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useProducts } from '../hooks/useProducts';
import { allColumns, getColumnConfig } from '../config/columnConfig';
import { Button, DataTable, TextSearch, RangeSlider, MultiSelect, type RangeValue } from '../components/controls';
import { draftsReducer, type FilterValue } from '../components/filters/filterStore';
import { CellRenderer } from '../components/table/CellRenderer';
import './ProductList.css';
import {
  filterValuesEqual,
  listQuerySearch,
  parseListQuery,
  rememberedExpanded,
  rememberExpanded,
  type ListQuery,
  type MockProductViewModel,
} from 'shared-types';

const GRADE_OPTIONS = ['A', 'B', 'C', 'D', 'F'];
const NOVA_OPTIONS = ['1', '2', '3', '4'];
const YES_NO_OPTIONS = ['Yes', 'No'];
// Draft fallbacks for untouched filters (empty inputs, no selection).
const NO_RANGE: RangeValue = {};
const NO_SELECTION: string[] = [];

function filterProducts(products: MockProductViewModel[], filters: Record<string, FilterValue | undefined>) {
  let result = products;

  Object.entries(filters).forEach(([column, filterValue]) => {
    if (!filterValue) return;

    result = result.filter((product) => {
      const productValue = (product as Record<string, any>)[column];

      // Text search
      if (typeof filterValue === 'string') {
        return productValue
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }
      // Range filter
      if (typeof filterValue === 'object' && !Array.isArray(filterValue)) {
        const numValue = Number(productValue);
        if (filterValue.min !== undefined && numValue < filterValue.min) {
          return false;
        }
        if (filterValue.max !== undefined && numValue > filterValue.max) {
          return false;
        }
        return true;
      }
      // Multi-select
      if (Array.isArray(filterValue)) {
        if (filterValue.length === 0) return true;
        // Handle boolean yes/no filters
        if (typeof productValue === 'boolean') {
          const boolStrings = filterValue.map((v) => {
            if (v === 'Yes') return true;
            if (v === 'No') return false;
            return v;
          });
          return boolStrings.includes(productValue);
        }
        return filterValue.includes(productValue);
      }
      return true;
    });
  });

  return result;
}

const ProductList = () => {
  const navigate = useNavigate();
  // Page, page size and applied filters live in the URL, so a reload, Back from a
  // product, or a shared link shows the same list.
  const [searchParams] = useSearchParams();
  const query = parseListQuery(searchParams);
  const search = listQuerySearch(query);
  const { page, pageSize, filters } = query;
  // Page-scoped filter drafts (live and die with this page); the filter controls
  // are wired to them in renderFilterCell.
  const [drafts, dispatchDraft] = useReducer(draftsReducer, {});
  // What each control shows: its draft while being edited, otherwise the applied value
  const shown = { ...filters, ...drafts };
  // Products whose description is expanded on this list view. Still open after a
  // visit to a product; a new page or filter starts with none (see showList).
  const [expandedCodes, setExpandedCodes] = useState(() => rememberedExpanded(search));

  const { products, total, loading, error } = useProducts({
    category: 'all',
    page: page + 1,
    pageSize
  });

  const filteredProducts = filterProducts(products, filters);

  // Shows another list view. Replaces the history entry, so paging and filtering
  // don't stack up Back steps, and Back from a product returns here.
  const showList = (next: ListQuery) => {
    const nextSearch = listQuerySearch(next);
    if (nextSearch === search) {
      return;
    }
    // A list view starts with nothing expanded
    setExpandedCodes([]);
    rememberExpanded(nextSearch, []);
    navigate(`/list${nextSearch}`, { replace: true });
  };

  // Applying a filter returns to the first page
  const applyFilter = (column: string, value: FilterValue | undefined) => {
    showList({ ...query, page: 0, filters: { ...filters, [column]: value } });
  };

  const resetFilters = () => {
    dispatchDraft({ type: 'clear' });
    showList({ ...query, page: 0, filters: {} });
  };

  const handlePageChange = (newPage: number) => {
    showList({ ...query, page: newPage });
  };

  // A new page size starts again from the first page
  const handlePageSizeChange = (newSize: number) => {
    showList({ ...query, page: 0, pageSize: newSize });
  };

  const setExpanded = (code: string, expanded: boolean) => {
    const others = expandedCodes.filter((c) => c !== code);
    const codes = expanded ? [...others, code] : others;
    setExpandedCodes(codes);
    rememberExpanded(search, codes);
  };

  const totalPages = Math.ceil(total / pageSize);
  const columns = allColumns.map((col) => col.key);

  const getColumnDataType = (column: string): string => {
    return getColumnConfig(column as keyof MockProductViewModel)?.type ?? 'simple-text';
  };

  const getColumnTitle = (column: string): string => {
    return getColumnConfig(column as keyof MockProductViewModel)?.label ?? column;
  };

  const renderHeader = (column: string) => {
    return <strong>{getColumnTitle(column)}</strong>;
  };

  // Each control shows its column's draft (or applied value); edits update the
  // draft, and a commit (blur/Enter, or every MultiSelect toggle) applies it.
  const renderFilterCell = (column: string) => {
    const dataType = getColumnDataType(column);
    const draft = shown[column];
    const setDraft = (value: FilterValue) => dispatchDraft({ type: 'setDraft', column, value });
    const applyIfChanged = () => {
      // A commit that changes nothing (e.g. blur without an edit) is a no-op, like a native change event
      if (!filterValuesEqual(draft, filters[column])) {
        applyFilter(column, draft);
      }
    };
    // A toggle always changes the selection
    const setDraftAndApply = (value: string[]) => {
      setDraft(value);
      applyFilter(column, value);
    };

    switch (dataType) {
      case 'progress-bar':
        return (
          <RangeSlider
            value={(draft as RangeValue | undefined) ?? NO_RANGE}
            min={0}
            max={100}
            onValueChange={setDraft}
            onCommit={applyIfChanged}
          />
        );
      case 'grade-badge':
        return (
          <MultiSelect
            options={GRADE_OPTIONS}
            value={(draft as string[] | undefined) ?? NO_SELECTION}
            onValueChange={setDraftAndApply}
          />
        );
      case 'nova-dots':
        return (
          <MultiSelect
            options={NOVA_OPTIONS}
            value={(draft as string[] | undefined) ?? NO_SELECTION}
            onValueChange={setDraftAndApply}
          />
        );
      case 'large-counter':
        return (
          <RangeSlider
            value={(draft as RangeValue | undefined) ?? NO_RANGE}
            onValueChange={setDraft}
            onCommit={applyIfChanged}
          />
        );
      case 'boolean-yesno':
        return (
          <MultiSelect
            options={YES_NO_OPTIONS}
            value={(draft as string[] | undefined) ?? NO_SELECTION}
            onValueChange={setDraftAndApply}
          />
        );
      case 'product-image':
        return null;
      default:
        return (
          <TextSearch
            value={(draft as string | undefined) ?? ''}
            onValueChange={setDraft}
            onCommit={applyIfChanged}
          />
        );
    }
  };

  const renderCell = (value: any, column: string, row: Record<string, any>) => {
    const columnConfig = getColumnConfig(column as keyof MockProductViewModel);
    if (!columnConfig) return value ?? '';
    return (
      <CellRenderer
        column={columnConfig}
        row={row}
        expanded={expandedCodes.includes(row.code)}
        onExpandedChange={(expanded) => setExpanded(row.code, expanded)}
      />
    );
  };

  let content;
  if (error) {
    content = <p>Error loading products: {error}</p>;
  } else if (products.length > 0) {
    content = (
      <div className="table-area">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-indicator">Loading...</div>
          </div>
        )}
        <DataTable
          columns={columns}
          value={filteredProducts}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          pageSizes={[10, 25, 50]}
          showFilterRow
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          renderHeader={renderHeader}
          renderFilterCell={renderFilterCell}
          renderCell={renderCell}
        />
      </div>
    );
  } else if (loading) {
    content = <div className="loading-indicator">Loading products...</div>;
  } else {
    content = <p>No products found.</p>;
  }

  return (
    <div className="product-list-container">
      <div className="page-header-row">
        <h1>Products</h1>
        <Button className="reset-button" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
      {content}
    </div>
  );
};

export default ProductList;
