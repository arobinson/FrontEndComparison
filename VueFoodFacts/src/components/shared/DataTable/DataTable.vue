<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue';
import { Button } from '../Button';
import './DataTable.css';

const {
  columns,
  value,
  totalPages,
  page,
  pageSize,
  pageSizes = [10, 25, 50],
  showFilterRow = false,
  emptyText = 'No data available',
} = defineProps<{
  columns: string[];
  value: T[];
  totalPages: number;
  page: number;
  pageSize: number;
  pageSizes?: number[];
  showFilterRow?: boolean;
  emptyText?: string;
}>();

const emit = defineEmits<{
  pageChange: [page: number];
  pageSizeChange: [pageSize: number];
}>();

defineSlots<{
  header?(props: { column: string }): any;
  filter?(props: { column: string }): any;
  cell?(props: { value: any; column: string; row: T }): any;
}>();

const hasData = computed(() => value && value.length > 0);

const isValidPageSize = computed(() => pageSizes.includes(pageSize));

const handlePageChange = (newPage: number) => {
  if (newPage >= 0 && newPage < totalPages) {
    emit('pageChange', newPage);
  }
};

const handleFirstPage = () => handlePageChange(0);
const handlePreviousPage = () => handlePageChange(page - 1);
const handleNextPage = () => handlePageChange(page + 1);
const handleLastPage = () => handlePageChange(totalPages - 1);

// v-model proxy: the parent owns pageSize, the select only reports changes
const selectedPageSize = computed({
  get: () => pageSize,
  set: (newSize: number) => emit('pageSizeChange', Number(newSize)),
});
</script>

<template>
  <div v-if="!hasData" class="data-table-container">
    <div class="empty-state">
      <p class="empty-text">{{ emptyText }}</p>
    </div>
  </div>

  <div v-else class="data-table-container">
    <div class="table-wrapper">
      <table class="data-table">
        <thead class="table-header">
          <tr class="header-row">
            <th v-for="column in columns" :key="column" class="header-cell" scope="col">
              <slot name="header" :column="column">{{ column }}</slot>
            </th>
          </tr>

          <tr v-if="showFilterRow" class="filter-row">
            <th v-for="column in columns" :key="column" class="filter-cell" scope="col">
              <slot name="filter" :column="column" />
            </th>
          </tr>
        </thead>

        <tbody class="table-body">
          <!-- Keyed by index to match the React implementation's row reconciliation -->
          <tr v-for="(row, rowIndex) in value" :key="rowIndex" class="data-row">
            <td v-for="column in columns" :key="column" class="data-cell">
              <slot name="cell" :value="row[column]" :column="column" :row="row">{{ row[column] }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-paginator">
      <div class="page-size-selector">
        <label for="pageSize">Items per page:</label>
        <select id="pageSize" v-model="selectedPageSize" :class="!isValidPageSize ? 'error' : ''">
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
        </select>
        <span v-if="!isValidPageSize" class="error-message">Invalid page size: {{ pageSize }}</span>
      </div>

      <div class="pagination-controls">
        <Button :disabled="page === 0" size="sm" @click="handleFirstPage">First</Button>

        <Button :disabled="page === 0" size="sm" @click="handlePreviousPage">Previous</Button>

        <span class="page-info">Page {{ page + 1 }} of {{ totalPages }}</span>

        <Button :disabled="page >= totalPages - 1" size="sm" @click="handleNextPage">Next</Button>

        <Button :disabled="page >= totalPages - 1" size="sm" @click="handleLastPage">Last</Button>
      </div>
    </div>
  </div>
</template>
