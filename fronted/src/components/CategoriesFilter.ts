import Vue from 'vue';
import vSelect from 'vue-select';
import CategoryService from '@/services/category.service';
import EditCategory from '@/components/EditCategory.vue';
import CategoryInterface from '@/interfaces/category.interface';

export default Vue.extend({
  name: 'CategoriesFilter',
  template: `
    <div style="width: 100%; display: flex; align-items: center;background: white;">
    <v-select
      ref="vSelect"
      v-model="selectedCategoryLocal"
      class="w-100"
      label="name"
      placeholder="Select category or create new"
      :multiple="false"
      :closeOnSelect="!agGridFloatingFilter"
      :options="options"
      :filterable="false"
      :appendToBody="agGridFloatingFilter"
      @search="(query) => search = query"
      @search:blur="searchBlur()"
      @input="selectedCategoryChanged()">
      <template
        v-if="header"
        #header>
        <div style="opacity: .8">{{ header }}</div>
      </template>
      <template #list-header>
        <li>
          <div
              class="text-center">
              <div class="vue-select-pagination">
                <button
                  type="button"
                  class="btn btn-primary btn-sm mr-1"
                  :disabled="!isSearchActive"
                  @click="makeSearch(true)">
                  Clear
                </button>
                <button
                  type="button"
                  class="btn btn-primary btn-sm ml-1"
                  :disabled="search.length === 0"
                  @click="makeSearch()">
                  Search
                </button>
              </div>
            </div>
          <hr class="my-1">
        </li>
      </template>
      <template #option="{ name }">
        <span :title="name">{{ name }}</span>
      </template>
      <template #selected-option="{ name }">
        <span :title="name">{{ name }}</span>
      </template>
      <template #no-options="{ search, searching, loading }">
        Not found
      </template>
      <template #list-footer>
        <hr class="my-1">
        <div class="vue-select-pagination">
          <button
            type="button"
            class="btn btn-primary btn-sm mr-1"
            :disabled="!hasPrevPage"
            @click="prevPage()">
            Prev
          </button>
          <button
            type="button"
            class="btn btn-primary btn-sm ml-1"
            :disabled="!hasNextPage"
            @click="nextPage()">
            Next
          </button>
        </div>
        <div v-if="agGridFloatingFilter">
          <hr class="my-1">
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-outline-primary btn-sm mx-1"
              @click="resetFilter">
              Reset
            </button>
            <button
              type="button"
              class="btn btn-outline-primary btn-sm mx-1"
              @click="applyFilter">
              Apply
            </button>
          </div>
        </div>
        <template v-if="selectedCategoryLocal || $refs.vSelect.search.length > 0">
          <hr class="my-1">
          <div class="d-flex justify-content-around">
            <template v-if="$refs.vSelect.search.length > 0">
              <b-link
                href="#"
                @click.prevent="addCategory">Create</b-link>
            </template>
            <template v-else>
              <b-link
                href="#"
                @click.prevent="activeModelEdit=true">Edit</b-link>
              <b-link
                href="#"
                class="text-danger"
                @click.prevent="confirmDelete(selectedCategoryLocal)">Delete</b-link>
            </template>
          </div>
        </template>
      </template>
    </v-select>

    <b-modal
      v-model="activeModelEdit"
      title="Edit Category"
      hide-footer>
      <edit-category
        :payload="selectedCategoryLocal"
        @close="activeModelEdit=false"
        @saved="categoryUpdated"/>
    </b-modal>
    </div>`,
  components: {
    vSelect,
    EditCategory,
  },
  props: {
    selectedCategory: {
      type: Object,
      required: false,
      default() {
        return null;
      },
    },
    header: {
      type: String,
      required: false,
      default: null,
    },
    agGridFloatingFilter: {
      type: Boolean,
      required: false,
      default: true,
    },
    paginationPageSize: {
      type: Number,
      required: false,
      default: 5,
    },
  },
  data() {
    return {
      categoriesService: CategoryService.getInstance(),
      selectedCategoryLocal: this.selectedCategory,
      lastSelectedCategory: this.selectedCategory,
      options: [],
      count: 0,
      search: '',
      offset: 0,
      isSearchActive: false,
      limit: this.paginationPageSize,
      filterIsApplied: false,
      activeModelEdit: false,
    };
  },
  computed: {
    hasNextPage(): boolean {
      const nextOffset = this.offset + this.paginationPageSize;
      return this.count > nextOffset;
    },
    hasPrevPage(): boolean {
      const prevOffset = this.offset - this.paginationPageSize;
      return prevOffset >= 0;
    },
    filter(): object {
      return !this.isSearchActive ? {} : {
        name: {
          filterType: 'text',
          type: 'contains',
          filter: this.search,
        },
      };
    },
    categoriesUpdateFlag(): number {
      return this.$store.state.categoriesUpdateFlag;
    },
    categoryCreatedFlag(): number {
      return this.$store.state.categoryCreatedFlag;
    },
  },
  watch: {
    selectedCategoryLocal(newVal, oldVal) {
      if (!newVal && oldVal) {
        this.resetFilter();
      }
    },
    categoriesUpdateFlag() {
      this.makeSearch(true);
    },
    categoryCreatedFlag() {
      this.makeSearch(true);
    },
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories(filters = {}) {
      const { data } = await this.categoriesService.getAll({
        sortBy: [{ colId: 'createdAt', sort: 'desc' }],
        filters,
        skip: this.offset,
        limit: this.paginationPageSize,
      });

      this.count = data.count;
      this.options = data.data;
    },
    makeSearch(reset = false) {
      if (reset) {
        this.clearSearch();
      }

      this.isSearchActive = !reset;
      this.fetchCategories(this.filter);
    },
    nextPage() {
      this.offset += this.paginationPageSize;
      this.fetchCategories(this.filter);
    },
    prevPage() {
      this.offset -= this.paginationPageSize;
      this.fetchCategories(this.filter);
    },
    async addCategory() {
      await this.categoriesService.create({
        name: this.search as string,
      });
      this.$store.commit('categoryCreatedFlag');
    },
    async categoryUpdated(category: CategoryInterface) {
      this.selectedCategoryLocal = category;
      this.activeModelEdit = false;
      this.$store.commit('categoriesUpdated');
    },
    confirmDelete(category: CategoryInterface) {
      const categoryToDelete = { ...category };

      this.$bvModal.msgBoxConfirm('Delete category', {
        title: 'Are yo sure?',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true,
      }).then((value) => {
        if (value) {
          this.deleteCategory(categoryToDelete.id as string);
        }
      });
    },
    async deleteCategory(id: string) {
      await this.categoriesService.delete(id);
      this.selectedCategoryLocal = null;
      this.selectedCategoryChanged();
      this.makeSearch(true);
      this.$store.commit('categoriesUpdated');
    },
    clearSearch() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.$refs.vSelect.search = '';
    },
    selectedCategoryChanged() {
      this.$emit('update:selected-category', this.selectedCategoryLocal);
    },
    searchBlur() {
      if (this.agGridFloatingFilter) {
        if (this.filterIsApplied) {
          this.lastSelectedCategory = { ...this.selectedCategoryLocal };
        } else if (this.selectedCategoryLocal && this.lastSelectedCategory) {
          if (this.lastSelectedCategory.id !== this.selectedCategoryLocal) {
            this.selectedCategoryLocal = { ...this.lastSelectedCategory };
          }
        } else {
          this.selectedCategoryLocal = null;
          this.lastSelectedCategory = null;
        }

        this.filterIsApplied = false;
      }
    },
    applyFilter() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const { params } = this;

      if (params) {
        this.filterIsApplied = true;
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        params.parentFilterInstance((instance) => {
          instance.onFloatingFilterChanged('equals', this.selectedCategoryLocal.id);
        });
      }
    },
    resetFilter() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const { params } = this;

      if (params) {
        this.selectedCategoryLocal = null;
        this.lastSelectedCategory = null;
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        params.parentFilterInstance((instance) => {
          instance.onFloatingFilterChanged(null, null);
        });
      }
    },
  },
});
