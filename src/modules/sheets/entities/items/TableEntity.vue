<script setup lang="ts">
import Table from '@d.malygin/UI_storybook/components/Table';
import type { ITable } from '@/app/interfaces/entities';
import { useDataStore } from '@/app/stores/data';
import type { TEntity } from '@/app/interfaces/environment';
import { editEntity } from '@/app/helpers/entities';
import TableSettings from '@/components/sheets/entities/settings/TableSettings.vue';
interface Props {
  entityData: ITable;
  isEditMode: boolean;
}
const props = defineProps<Props>();
const entityData = ref(props.entityData);

const entities = computed(() => useDataStore().entities);
const entitiesLength = computed(() => entities.value.length);
const entityIndex = computed(() =>
  entities.value.findIndex((entity: TEntity) => entity.entity_uuid === props.entityData.entity_uuid)
);

const saveChanges = async (newState: ITable) => {
  await editEntity(newState);
  entityData.value = newState;
};
</script>

<template>
  <section
    :class="[
      'entityContainer relative flex px-16',
      {
        'justify-start': entityData.entity_position === 'left',
        'justify-center': entityData.entity_position === 'center',
        'justify-end': entityData.entity_position === 'right'
      }
    ]"
  >
    <Table
      v-model:data="entityData.table_data"
      :columns="entityData.table_columns"
      :multipleSort="entityData.multipleSort"
      :gap="entityData.gap"
      :size="entityData.size"
      :showAllLines="entityData.showAllLines"
      :stripedRows="entityData.stripedRows"
      :center="entityData.center"
      :fontSize="entityData.fontSize"
      :theme="entityData.theme"
      :textColor="entityData.textColor"
      :darknessTheme="entityData.darknessTheme"
      :darknessTextColor="entityData.darknessTextColor"
      :paginator="entityData.paginator"
      :editable="entityData.editable"
      :noEditingSettings="entityData.noEditingSettings"
      :handlers="entityData.handlers"
    />
    <TableSettings v-if="isEditMode" :entityData="entityData" @saveChanges="saveChanges" />
    <EntityPositionSettings
      v-if="isEditMode && entitiesLength > 1"
      :entityUuid="entityData.entity_uuid"
      :entityIndex="entityIndex"
      :entitiesLength="entitiesLength"
    />
  </section>
</template>

<style scoped>
.entityContainer .settings {
  opacity: 0;
}
.entityContainer:hover .settings {
  opacity: 100;
}
</style>
