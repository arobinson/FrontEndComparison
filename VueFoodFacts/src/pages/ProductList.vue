<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import type { MockProductViewModel } from 'shared-types';
import { useProducts } from '../composables/useProducts';
import { allColumns, getColumnConfig } from '../config/columnConfig';
import { DataTable, TextSearch, RangeSlider, MultiSelect } from '../components/shared';
import CellRenderer from '../components/table/CellRenderer.vue';
import './ProductList.css';

type FilterValue = string | { min?: number; max?: number } | string[];

const columns = allColumns.map((col) => col.key);
const pageSizes = [10, 25, 50];

const page = ref(0);
const pageSize = ref(50);
// Replaced (never mutated) on every update, so a shallowRef is enough
const filters = shallowRef<Record<string, FilterValue>>({});
const filterResetTrigger = ref(0);

const { products, total, loading, error } = useProducts({
  category: 'all',
  page: () => page.value + 1,
  pageSize,
});

const filteredProducts = computed(() => {
  let result = products.value;

  Object.entries(filters.value).forEach(([column, filterValue]) => {
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

const updateFilter = (column: string, value: FilterValue) => {
  filters.value = {
    ...filters.value,
    [column]: value,
  };
  page.value = 0;
};

const resetFilters = () => {
  filters.value = {};
  page.value = 0;
  filterResetTrigger.value++;
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
            :min="0"
            :max="100"
            :reset-trigger="filterResetTrigger"
            @value-change="updateFilter(column, $event)"
          />
          <MultiSelect
            v-else-if="getColumnDataType(column) === 'grade-badge'"
            :options="['A', 'B', 'C', 'D', 'F']"
            :reset-trigger="filterResetTrigger"
            @value-change="updateFilter(column, $event)"
          />
          <MultiSelect
            v-else-if="getColumnDataType(column) === 'nova-dots'"
            :options="['1', '2', '3', '4']"
            :reset-trigger="filterResetTrigger"
            @value-change="updateFilter(column, $event)"
          />
          <RangeSlider
            v-else-if="getColumnDataType(column) === 'large-counter'"
            :reset-trigger="filterResetTrigger"
            @value-change="updateFilter(column, $event)"
          />
          <MultiSelect
            v-else-if="getColumnDataType(column) === 'boolean-yesno'"
            :options="['Yes', 'No']"
            :reset-trigger="filterResetTrigger"
            @value-change="updateFilter(column, $event)"
          />
          <TextSearch
            v-else-if="getColumnDataType(column) !== 'product-image'"
            :reset-trigger="filterResetTrigger"
            @value-change="updateFilter(column, $event)"
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
