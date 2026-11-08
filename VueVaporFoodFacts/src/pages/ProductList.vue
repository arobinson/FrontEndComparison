<script setup lang="ts">
import { computed, ref } from 'vue';
import type { MockProductViewModel } from 'shared-types';
import { useProducts } from '../composables/useProducts';
import { createFilterStore, type FilterValue, type RangeValue } from '../composables/useFilterStore';
import { allColumns, getColumnConfig } from '../config/columnConfig';
import { Button, DataTable, TextSearch, RangeSlider, MultiSelect } from '../components/controls';
import CellRenderer from '../components/table/CellRenderer.vue';
import './ProductList.css';

const columns = allColumns.map((col) => col.key);
const pageSizes = [10, 25, 50];

const page = ref(0);
const pageSize = ref(50);

// Page-scoped filter store; the page wires it into the (store-agnostic) filter controls.
// Any apply/clear returns to the first page.
const filterStore = createFilterStore(() => {
  page.value = 0;
});

const { products, total, loading, error } = useProducts({
  category: 'all',
  page: () => page.value + 1,
  pageSize,
});

const filteredProducts = computed(() => {
  let result = products.value;

  Object.entries(filterStore.state.applied).forEach(([column, filterValue]) => {
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

// Filter-cell wiring: each control shows the column's draft, edits update the draft, commits apply it
const setDraft = (column: string, value: FilterValue) => {
  filterStore.setDraft(column, value);
};

const applyFilter = (column: string) => {
  filterStore.apply(column);
};

// Multi-selects apply on every toggle
const setDraftAndApply = (column: string, value: string[]) => {
  filterStore.setDraft(column, value);
  filterStore.apply(column);
};

const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

const resetFilters = () => {
  filterStore.clear();
};

const handlePageChange = (newPage: number) => {
  page.value = newPage;
};

const handlePageSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  page.value = 0;
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
        track-by="code"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #header="{ column }">
          <strong>{{ columnTitles[column] }}</strong>
        </template>

        <template #filter="{ column }">
          <RangeSlider
            v-if="columnTypes[column] === 'progress-bar'"
            :model-value="filterStore.getDraft<RangeValue>(column, {})"
            :min="0"
            :max="100"
            @update:model-value="setDraft(column, $event)"
            @commit="applyFilter(column)"
          />
          <MultiSelect
            v-else-if="columnTypes[column] === 'grade-badge'"
            :model-value="filterStore.getDraft<string[]>(column, [])"
            :options="['A', 'B', 'C', 'D', 'F']"
            @update:model-value="setDraftAndApply(column, $event)"
          />
          <MultiSelect
            v-else-if="columnTypes[column] === 'nova-dots'"
            :model-value="filterStore.getDraft<string[]>(column, [])"
            :options="['1', '2', '3', '4']"
            @update:model-value="setDraftAndApply(column, $event)"
          />
          <RangeSlider
            v-else-if="columnTypes[column] === 'large-counter'"
            :model-value="filterStore.getDraft<RangeValue>(column, {})"
            @update:model-value="setDraft(column, $event)"
            @commit="applyFilter(column)"
          />
          <MultiSelect
            v-else-if="columnTypes[column] === 'boolean-yesno'"
            :model-value="filterStore.getDraft<string[]>(column, [])"
            :options="['Yes', 'No']"
            @update:model-value="setDraftAndApply(column, $event)"
          />
          <TextSearch
            v-else-if="columnTypes[column] !== 'product-image'"
            :model-value="filterStore.getDraft<string>(column, '')"
            @update:model-value="setDraft(column, $event)"
            @commit="applyFilter(column)"
          />
        </template>

        <template #cell="{ column, row }">
          <CellRenderer :column="findColumn(column)" :row="row" />
        </template>
      </DataTable>
    </div>
    <div v-else-if="loading" class="loading-indicator">Loading products...</div>
    <p v-else>No products found.</p>
  </div>
</template>
