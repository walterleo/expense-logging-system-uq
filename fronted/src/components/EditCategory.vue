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
        <button @click.prevent="$emit('close')"
          type="button" class="btn btn-secondary" >Close</button>
        <button
          id="saveButton"
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

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
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

  public get isValidModelToSave(): boolean {
    return !!this.model && !!this.model.name && !!this.model.id;
  }

  created() {
    this.model = {
      id: this.payload?.id,
      name: this.payload?.name || '',
    };
  }

  async saveCategory() {
    this.isLoading = true;
    const resp = await this.categoryService.edit(this.model?.id || '', this.model as CategoryInterface);
    this.$emit('saved', resp.data);
    this.isLoading = false;
  }
}
</script>
