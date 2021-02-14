<template>
  <div>
    <form>
      <div class="mb-3">
        <label for="amount" class="form-label">
          Category*
        </label>
        <categories-filter
          :ag-grid-floating-filter="false"
          :selected-category.sync="selectedCategory">
        </categories-filter>
      </div>
      <div class="mb-3">
        <label
          for="amount"
          class="form-label">
          Amount*
        </label>
        <input
          v-model="model.amount"
          type="number"
          class="form-control"
          id="amount">
      </div>
      <div class="mb-3">
        <label
          for="description"
          class="form-label">Description</label>
        <textarea
          v-model="model.description"
          class="form-control"
          id="description"
          rows="3"></textarea>
      </div>

      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          @click.prevent="$emit('close')">Close</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!isValidModelToSave"
          @click.prevent="saveExpense()">Save</button>
      </div>

    </form>

    <loading :active.sync="isLoading"></loading>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import CategoryInterface from '@/interfaces/category.interface';
import { Operation } from '@/enums';
import ExpenseInterface from '@/interfaces/expense.interface.';
import ExpenseService from '@/services/expense.service';
import Loading from 'vue-loading-overlay';
import CategoriesFilter from '@/components/CategoriesFilter';

@Component({
  name: 'CreateOrEditExpenseModal',
  components: {
    vSelect,
    Loading,
    CategoriesFilter,
  },
})
export default class CreateOrEditExpenseModal extends Vue {
  @Prop({ default: Operation.Create }) private readonly operation!: Operation;

  @Prop({ default: null }) private readonly payload!: ExpenseInterface | null;

  readonly expenseService = ExpenseService.getInstance();

  model: ExpenseInterface | null = null;

  selectedCategory: CategoryInterface | null = null;

  isLoading = false;

  get isValidModelToSave() {
    return this.model && this.model.categoryId && this.model.amount > 0;
  }

  @Watch('selectedCategory')
  onChildChanged(val: CategoryInterface) {
    if (this.model) {
      this.model.categoryId = val?.id;
    }
  }

  created() {
    if (this.operation === Operation.Create) {
      this.model = {
        amount: 0,
        description: '',
        categoryId: '',
      };
    } else if (this.payload) {
      this.model = {
        categoryId: this.payload.categoryId,
        amount: this.payload.amount,
        description: this.payload.description,
      };
      this.selectedCategory = this.payload.category;
    }
  }

  async saveExpense() {
    this.isLoading = true;

    if (this.operation === Operation.Create) {
      await this.expenseService.create(this.model as ExpenseInterface);
    } else {
      await this.expenseService.edit(this.payload.id, this.model);
    }

    this.$emit('saved');
    this.isLoading = false;
  }
}
</script>
