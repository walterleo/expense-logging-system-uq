<template>
  <div class="d-flex justify-content-around align-items-center h-100">
    <b-icon
      v-b-tooltip.hover
      title="Edit"
      icon="pencil-square"
      variant="secondary"
      class="cursor-pointer"
      font-scale="1.5"
      @click="edit()"></b-icon>
    <b-icon
      v-b-tooltip.hover
      title="Delete"
      icon="trash-fill"
      variant="danger"
      class="cursor-pointer"
      font-scale="1.5"
      @click="confirmDelete()"></b-icon>
  </div>

</template>

<script lang="ts">
import {
  Component, Vue,
} from 'vue-property-decorator';

@Component({
  name: 'CellRendererActions',
})
export default class CellRendererActions extends Vue {
  edit() {
    this.params.context.componentParent.editExpensive(this.params.node.data);
  }

  confirmDelete() {
    this.$bvModal.msgBoxConfirm('Delete expense', {
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
        this.delete();
      }
    });
  }

  async delete() {
    await this.params.context.componentParent.deleteExpense(this.params.node.data.id);
  }
}

</script>

<style scoped>

</style>
