<script setup lang="ts">
import { computed, ref } from 'vue';
import type { MockProductViewModel } from 'shared-types';
import { useProducts } from '../composables/useProducts';
import { provideFilterStore } from '../composables/useFilterStore';
import { allColumns, getColumnConfig } from '../config/columnConfig';
import { DataTable, TextSearch, RangeSlider, MultiSelect } from '../components/shared';
import CellRenderer from '../components/table/CellRenderer.vue';
import './ProductList.css';

const columns = allColumns.map((col) => col.key);
const pageSizes = [10, 25, 50];

const page = ref(0);
const pageSize = ref(50);

// Page-scoped filter store, provided to the filter components; any apply/clear returns to the first page
const filterStore = provideFilterStore(() => {
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

const getColumnDataType = (column: string): string => {
  return getColumnConfig(column as keyof MockProductViewModel)?.type ?? 'simple-text';
};

const getColumnTitle = (column: string): string => {
  return getColumnConfig(column as keyof MockProductViewModel)?.label ?? column;
};

// Columns are derived from allColumns, so the lookup always succeeds
const findColumn = (column: string) => allColumns.find((col) => col.key === column)!;
</script>

<template>
  <div class="product-list-container">
    <div class="page-header-row">
      <h1>Products</h1>
      <button class="reset-button" type="button" @click="resetFilters">Reset Filters</button>
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
        :show-filter-row="true"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #header="{ column }">
          <strong>{{ getColumnTitle(column) }}</strong>
        </template>

        <template #filter="{ column }">
          <RangeSlider
            v-if="getColumnDataType(column) === 'progress-bar'"
            :column="column"
            :min="0"
            :max="100"
          />
          <MultiSelect
            v-else-if="getColumnDataType(column) === 'grade-badge'"
            :column="column"
            :options="['A', 'B', 'C', 'D', 'F']"
          />
          <MultiSelect
            v-else-if="getColumnDataType(column) === 'nova-dots'"
            :column="column"
            :options="['1', '2', '3', '4']"
          />
          <RangeSlider
            v-else-if="getColumnDataType(column) === 'large-counter'"
            :column="column"
          />
          <MultiSelect
            v-else-if="getColumnDataType(column) === 'boolean-yesno'"
            :column="column"
            :options="['Yes', 'No']"
          />
          <TextSearch
            v-else-if="getColumnDataType(column) !== 'product-image'"
            :column="column"
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
