import { shallowMount } from '@vue/test-utils';
import EditCategory from '@/components/EditCategory.vue';
import CategoryInterface from '@/interfaces/category.interface';
import sinon from 'sinon';

describe('EditCategory.vue', () => {
  describe('Computed - isValidModelToSave', () => {
    it('should be valid by passing a valid payload and enabling the save button', () => {
      const payload: CategoryInterface = {
        id: '6029bb677fc44419044687a3',
        name: 'test',
      };

      const wrapper = shallowMount(EditCategory, {
        propsData: {
          payload,
        },
      });

      const $saveButton = wrapper.find('#saveButton').element as HTMLButtonElement;

      expect((wrapper.vm as any).isValidModelToSave).toBe(true);
      expect($saveButton.disabled).toBe(false);
    });

    it('should be invalid by passing an invalid payload and disabling the save button', () => {
      const payload: CategoryInterface = {
        id: '',
        name: 'test',
      };

      const wrapper = shallowMount(EditCategory, {
        propsData: {
          payload,
        },
      });
      const $saveButton = wrapper.find('button#saveButton').element as HTMLButtonElement;

      expect((wrapper.vm as any).isValidModelToSave).toBe(false);
      expect($saveButton.disabled).toBe(true);
    });
  });

  describe('Method - saveCategory', () => {
    const payload: CategoryInterface = {
      id: '6029bb677fc44419044687a3',
      name: 'test',
    };

    const wrapper = shallowMount(EditCategory, {
      propsData: {
        payload,
      },
    });

    it('should be invoked by pressing the save button', () => {
      const $saveButton = wrapper.find('button#saveButton').element as HTMLButtonElement;
      const saveCategoryStub = sinon.stub();
      wrapper.setMethods({ saveCategory: saveCategoryStub });
      $saveButton.click();

      expect(saveCategoryStub.called).toBe(true);
    });
  });
});
