<template>
  <div>
    <form>
      <div class="mb-3">
        <label
          for="name"
          class="form-label">
          Name*
        </label>
        <input
          v-model="model.name"
          type="text"
          class="form-control"
          id="name">
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
          @click.prevent="saveCategory()">Save</button>
      </div>

    </form>

    <loading :active.sync="isLoading"></loading>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import Loading from 'vue-loading-overlay';
import { Operation } from '@/enums';
import CategoryInterface from '@/interfaces/category.interface';
import CategoryService from '../services/category.service';

@Component({
  name: 'EditCategory',
  components: {
    Loading,
  },
})
export default class EditCategory extends Vue {
  @Prop({ default: Operation.Create }) private readonly operation!: Operation;

  @Prop({ default: null }) private readonly payload!: CategoryInterface | null;

  readonly categoryService = CategoryService.getInstance();

  model: CategoryInterface | null = null;

  isLoading = false;

  get isValidModelToSave() {
    return this.model && this.model.name;
  }

  created() {
    this.model = {
      id: this.payload?.id,
      name: this.payload?.name || '',
    };
  }

  async saveCategory() {
    this.isLoading = true;
    await this.categoryService.edit(this.model?.id || '', this.model as CategoryInterface);
    this.$emit('saved');
    this.isLoading = false;
  }
}
</script>
