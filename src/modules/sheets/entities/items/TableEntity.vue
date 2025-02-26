<script setup lang="ts">
import Table from '@d.malygin/UI_storybook/components/Table';
import type { ITable } from '@/app/interfaces/entities';
interface Props {
  entityData: ITable;
  isEditMode: boolean;
}
const props = defineProps<Props>();
const entityData = ref(props.entityData);
</script>

<template>
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
</template>

<style scoped></style>
