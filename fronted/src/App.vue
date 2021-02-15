<template>
  <div id="app">
    <div class="container-fluid py-3">
      <div
        v-if="chartSeries.length > 0"
        class="d-flex justify-content-center">
        <apexchart
          width="500"
          type="donut"
          :options="chartOptions" :series="chartSeries">
        </apexchart>
      </div>

      <div class="d-flex justify-content-end">
        <b-button
          variant="primary"
          @click="addItem()">
          Add expensive
        </b-button>
      </div>

      <b-modal
        v-model="activeModalCreateOrEdit"
        :title="modalTitle"
        hide-footer>
        <create-or-edit-expense
          :operation="operation"
          :payload="expensePayload"
          @close="activeModalCreateOrEdit=false"
          @saved="expenseSaved()"/>
      </b-modal>

      <ag-grid-vue
        style="height: 400px"
        class="ag-theme-alpine w-100 mt-3"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :gridOptions="gridOptions"
        :getRowNodeId="getRowNodeId"
        :components="components"
        :frameworkComponents="frameworkComponents"
        :animateRows="true"
        rowModelType="infinite"
        :pagination="true"
        :paginationPageSize="10"
        :suppressPaginationPanel="false"
        :maxConcurrentDatasourceRequests="1"
        :cacheBlockSize="100"
        :maxBlocksInCache="1"
        @grid-ready="onGridReady"
        @model-updated="onModelUpdate">
      </ag-grid-vue>
    </div>

    <loading :active.sync="isLoading"></loading>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { AgGridVue } from 'ag-grid-vue';
import {
  ColDef,
  ColumnApi,
  GetRowNodeIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import FetchParamsInterface from '@/interfaces/fetchParams.interface';
import CreateOrEditExpense from '@/components/CreateOrEditExpense.vue';
import CategoriesFilter from '@/components/CategoriesFilter';
import ExpenseService from '@/services/expense.service';
import CellRendererActions from '@/components/CellRendererActions.vue';
import Loading from 'vue-loading-overlay';
import { Operation } from '@/enums';
import ExpenseInterface from '@/interfaces/expense.interface.';
import ExpensesByCategoryInterface from '@/interfaces/expensesByCategory.interface';
import { ApexOptions } from 'apexcharts';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
@Component({
  components: {
    AgGridVue,
    CreateOrEditExpense,
    CategoriesFilter,
    CellRendererActions,
    Loading,
  },
})
export default class App extends Vue {
  readonly expenseService = ExpenseService.getInstance();

  isLoading = false;

  columnDefs: ColDef[] = [
    {
      colId: 'createdAt',
      headerName: 'Date',
      field: 'createdAt',
      minWidth: 200,
      maxWidth: 500,
      filter: 'agDateColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        alwaysShowBothConditions: false,
      },
      sort: 'desc',
      valueFormatter: (params) => this.$options.filters?.date(params.value),
    },
    {
      colId: 'amount',
      headerName: 'Amount',
      field: 'amount',
      filter: 'agNumberColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        alwaysShowBothConditions: false,
      },
      minWidth: 100,
      maxWidth: 400,
      valueFormatter: (params) => this.$options.filters?.dollar(params.value),
    },
    {
      colId: 'categoryId',
      headerName: 'Category',
      field: 'category.name',
      filter: 'agTextColumnFilter',
      floatingFilterComponent: 'CategoriesFilter',
      floatingFilterComponentParams: { suppressFilterButton: true },
      minWidth: 250,
      maxWidth: 600,
      sortable: false,
    },
    {
      colId: 'description',
      headerName: 'Description',
      field: 'description',
      filter: 'agTextColumnFilter',
      minWidth: 100,
      maxWidth: 800,
      sortable: false,
    },
    {
      colId: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      cellRendererFramework: 'CellRendererActions',
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    suppressMenu: true,
    unSortIcon: true,
    floatingFilter: true,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
      alwaysShowBothConditions: true,
    },
  };

  gridOptions: GridOptions = {
    context: {
      componentParent: this,
    },
  };

  gridApi: GridApi | null = null;

  columnApi: ColumnApi | null = null;

  getRowNodeId: GetRowNodeIdFunc = (data) => data.id;

  components = {
    CellRendererActions,
  };

  frameworkComponents = {
    CategoriesFilter,
  };

  chartSeries: number[] = [];

  chartOptions: ApexOptions = {
    labels: [],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
  };

  dataSource: IDatasource = {
    getRows: this.getRows,
  };

  activeModalCreateOrEdit = false;

  operation = Operation.Create;

  expensePayload: ExpenseInterface | null = null

  expensesByCategory: ExpensesByCategoryInterface[] = [];

  get modalTitle() {
    return `${this.operation === Operation.Create ? 'Create' : 'Edit'} expensive`;
  }

  get categoriesUpdateFlag() {
    return this.$store.state.categoriesUpdateFlag;
  }

  @Watch('expensesByCategory')
  onChildChanged(val: ExpensesByCategoryInterface[]) {
    this.chartSeries = val.map((e) => e.amount);
    this.chartOptions = {
      ...this.chartOptions,
      labels: val.map((e) => e.name),
    };
  }

  @Watch('categoriesUpdateFlag')
  async OnCategoriesChanged() {
    if (this.gridApi) {
      this.gridApi.setDatasource(this.dataSource);
      await this.fetchExpensesByCategories();
    }
  }

  created() {
    this.fetchExpensesByCategories();
  }

  async getRows(params: IGetRowsParams) {
    const filters = { ...params.filterModel };

    const { data } = await this.fetchExpenses({
      sortBy: params.sortModel,
      filters,
      skip: params.startRow,
      limit: params.endRow,
    });

    const rowsThisPage = data.data;
    let lastRow = -1;

    if (data.count <= params.endRow) {
      lastRow = data.count;
    }

    params.successCallback(rowsThisPage, lastRow);
  }

  async fetchExpenses(params: FetchParamsInterface) {
    return this.expenseService.getAll(params);
  }

  async fetchExpensesByCategories() {
    const resp = await this.expenseService.getExpensesByCategories();
    this.expensesByCategory = resp.data;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.setDatasource(this.dataSource);
    this.gridApi.sizeColumnsToFit();
  }

  onModelUpdate() {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  addItem() {
    this.activeModalCreateOrEdit = true;
    this.operation = Operation.Create;
  }

  editExpensive(payload: ExpenseInterface) {
    this.operation = Operation.Edit;
    this.activeModalCreateOrEdit = true;
    this.expensePayload = payload;
  }

  async deleteExpense(id: string) {
    if (this.gridApi) {
      this.isLoading = true;
      await this.expenseService.delete(id);
      this.gridApi.setDatasource(this.dataSource);
      this.isLoading = false;
      await this.fetchExpensesByCategories();
    }
  }

  async expenseSaved() {
    if (this.gridApi) {
      this.activeModalCreateOrEdit = false;
      this.gridApi.setDatasource(this.dataSource);
      await this.fetchExpensesByCategories();
    }
  }
}
</script>
