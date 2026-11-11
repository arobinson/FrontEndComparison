<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  filterValuesEqual,
  listQuerySearch,
  parseListQuery,
  rememberedExpanded,
  rememberExpanded,
  type ListQuery,
  type MockProductViewModel,
} from 'shared-types';
import { useProducts } from '../composables/useProducts';
import { createFilterStore, type FilterValue, type RangeValue } from '../composables/useFilterStore';
import { allColumns, getColumnConfig } from '../config/columnConfig';
import { Button, DataTable, TextSearch, RangeSlider, MultiSelect } from '../components/controls';
import CellRenderer from '../components/table/CellRenderer.vue';
import './ProductList.css';

const columns = allColumns.map((col) => col.key);
const pageSizes = [10, 25, 50];

const route = useRoute();
const router = useRouter();

// Page, page size and applied filters live in the URL, so a reload, Back from a
// product, or a shared link shows the same list.
const query = computed(() => parseListQuery(new URLSearchParams(route.query as Record<string, string>)));
const search = computed(() => listQuerySearch(query.value));
const page = computed(() => query.value.page);
const pageSize = computed(() => query.value.pageSize);
const applied = computed(() => query.value.filters);

// Page-scoped filter drafts; the page wires them into the (store-agnostic) filter controls.
const filterStore = createFilterStore();

// What each control shows: its draft while being edited, otherwise the applied value
const shown = computed(() => ({ ...applied.value, ...filterStore.state.drafts }));
const shownValue = <T extends FilterValue>(column: string, fallback: T): T =>
  (shown.value[column] as T | undefined) ?? fallback;

// Products whose description is expanded on this list view. Still open after a
// visit to a product; a new page or filter starts with none (see showList).
const expandedCodes = ref<readonly string[]>(rememberedExpanded(search.value));

// Shows another list view. Replaces the history entry, so paging and filtering
// don't stack up Back steps, and Back from a product returns here.
const showList = (next: ListQuery) => {
  const nextSearch = listQuerySearch(next);
  if (nextSearch === search.value) {
    return;
  }
  // A list view starts with nothing expanded
  expandedCodes.value = [];
  rememberExpanded(nextSearch, []);
  router.replace(`/list${nextSearch}`);
};

const { products, total, loading, error } = useProducts({
  category: 'all',
  page: () => page.value + 1,
  pageSize,
});

const filteredProducts = computed(() => {
  let result = products.value;

  Object.entries(applied.value).forEach(([column, filterValue]) => {
    if (!filterValue) return;

    result = result.filter((product) => {
      const productValue = (product as Record<string, any>)[column];

      // Text search
      if (typeof filterValue === 'string') {
        return productValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
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
});

// Filter-cell wiring: each control shows the column's draft (or applied value), edits update the draft, commits apply it
const setDraft = (column: string, value: FilterValue) => {
  filterStore.setDraft(column, value);
};

// Applying a filter returns to the first page
const applyFilter = (column: string) => {
  const value = shown.value[column];
  // A commit that changes nothing (e.g. blur without an edit) is a no-op, like a native change event
  if (filterValuesEqual(value, applied.value[column])) return;
  showList({ ...query.value, page: 0, filters: { ...applied.value, [column]: value } });
};

// Multi-selects apply on every toggle
const setDraftAndApply = (column: string, value: string[]) => {
  filterStore.setDraft(column, value);
  applyFilter(column);
};

const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

const resetFilters = () => {
  filterStore.clear();
  showList({ ...query.value, page: 0, filters: {} });
};

const handlePageChange = (newPage: number) => {
  showList({ ...query.value, page: newPage });
};

// A new page size starts again from the first page
const handlePageSizeChange = (newSize: number) => {
  showList({ ...query.value, page: 0, pageSize: newSize });
};

const setExpanded = (code: string, expanded: boolean) => {
  const others = expandedCodes.value.filter((c) => c !== code);
  const codes = expanded ? [...others, code] : others;
  expandedCodes.value = codes;
  rememberExpanded(search.value, codes);
};

// Static per-column lookups (column config never changes): plain property reads in the template, no calls per render
const columnTypes: Record<string, string> = Object.fromEntries(
  allColumns.map((col) => [col.key, getColumnConfig(col.key as keyof MockProductViewModel)?.type ?? 'simple-text']),
);

const columnTitles: Record<string, string> = Object.fromEntries(
  allColumns.map((col) => [col.key, getColumnConfig(col.key as keyof MockProductViewModel)?.label ?? col.key]),
);

// Columns are derived from allColumns, so the lookup always succeeds
const findColumn = (column: string) => getColumnConfig(column as keyof MockProductViewModel)!;
</script>

<template>
  <div class="product-list-container">
    <div class="page-header-row">
      <h1>Products</h1>
      <Button class="reset-button" @click="resetFilters">Reset Filters</Button>
    </div>
    <p v-if="error">Error loading products: {{ error }}</p>
    <div v-else-if="products.length > 0" class="table-area">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-indicator">Loading...</div>
      </div>
      <DataTable
        :columns="columns"
        :value="filteredProducts"
        :total-pages="totalPages"
        :page="page"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        show-filter-row
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #header="{ column }">
          <strong>{{ columnTitles[column] }}</strong>
        </template>

        <template #filter="{ column }">
          <RangeSlider
            v-if="columnTypes[column] === 'progress-bar'"
            :model-value="shownValue<RangeValue>(column, {})"
            :min="0"
            :max="100"
            @update:model-value="setDraft(column, $event)"
            @commit="applyFilter(column)"
          />
          <MultiSelect
            v-else-if="columnTypes[column] === 'grade-badge'"
            :model-value="shownValue<string[]>(column, [])"
            :options="['A', 'B', 'C', 'D', 'F']"
            @update:model-value="setDraftAndApply(column, $event)"
          />
          <MultiSelect
            v-else-if="columnTypes[column] === 'nova-dots'"
            :model-value="shownValue<string[]>(column, [])"
            :options="['1', '2', '3', '4']"
            @update:model-value="setDraftAndApply(column, $event)"
          />
          <RangeSlider
            v-else-if="columnTypes[column] === 'large-counter'"
            :model-value="shownValue<RangeValue>(column, {})"
            @update:model-value="setDraft(column, $event)"
            @commit="applyFilter(column)"
          />
          <MultiSelect
            v-else-if="columnTypes[column] === 'boolean-yesno'"
            :model-value="shownValue<string[]>(column, [])"
            :options="['Yes', 'No']"
            @update:model-value="setDraftAndApply(column, $event)"
          />
          <TextSearch
            v-else-if="columnTypes[column] !== 'product-image'"
            :model-value="shownValue<string>(column, '')"
            @update:model-value="setDraft(column, $event)"
            @commit="applyFilter(column)"
          />
        </template>

        <template #cell="{ column, row }">
          <CellRenderer
            :column="findColumn(column)"
            :row="row"
            :expanded="expandedCodes.includes(row.code)"
            @update:expanded="setExpanded(row.code, $event)"
          />
        </template>
      </DataTable>
    </div>
    <div v-else-if="loading" class="loading-indicator">Loading products...</div>
    <p v-else>No products found.</p>
  </div>
</template>
