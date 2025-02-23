<script setup lang="ts">
import Divider from '@d.malygin/UI_storybook/components/Divider';
import type { IDivider } from '@/app/interfaces/entities';
import { editEntity } from '@/app/helpers/entities';
import { useDataStore } from '@/app/stores/data';
import type { IEntity } from '@/app/interfaces/environment';

interface Props {
  entityData: IDivider;
  isEditMode: boolean;
}
const props = defineProps<Props>();
const entityData = ref(props.entityData);

const entities = computed(() => useDataStore().entities);
const entityIndex = computed(() =>
  entities.value.findIndex((entity: IEntity) => entity.entity_uuid === props.entityData.entity_uuid)
);
const entitiesLength = computed(() => entities.value.length);

const saveChanges = async (newState: IDivider) => {
  await editEntity(newState);
  entityData.value = newState;
};
</script>

<template>
  <section class="entityContainer relative px-16 py-6">
    <Divider
      :type="entityData.divider_type"
      :height="entityData.divider_height"
      darknessColor="100"
    />
    <DividerSettings v-if="isEditMode" :entityData="entityData" @saveChanges="saveChanges" />
    <EntityPositionSettings
      v-if="isEditMode && entitiesLength > 1"
      :entityUuid="entityData.entity_uuid"
      :entityIndex="entityIndex"
      :entitiesLength="entitiesLength"
    />
  </section>
</template>

<style>
.entityContainer .speedDial {
  opacity: 0;
}
.entityContainer:hover .speedDial {
  opacity: 100;
}
</style>
