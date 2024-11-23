import { useDataStore } from '@/app/stores/data';
import type { ISheet } from '@/app/interfaces/environment';
import customFetch from '@/app/helpers/customFetch';
import type { ITreeItem } from '@/shared/ui/interfaces';
import cookies from '@/app/plugins/Cookie';

const convertSheetForTree = (sheet: ISheet, sheets: ISheet[]) => {
  const treeItem: ITreeItem = {
    label: sheet.sheet_title,
    link: '/' + sheet.sheet_uuid,
    color: 'white',
    iconBefore: sheet.sheet_icon,
    iconColor: 'white'
  };
  if (sheet.sheet_children.length) {
    treeItem.children = [];
    for (const uuid of sheet.sheet_children) {
      const child = sheets.find((item) => item.sheet_uuid === uuid);
      if (!child) continue;
      const newChild = convertSheetForTree(child, sheets);
      treeItem.children.push(newChild);
    }
  }
  return treeItem;
};

export const convertSheetsForTree = (sheets: ISheet[]) => {
  const uuidsPassed = new Set();
  const childrenUuids = new Set();
  const result: ITreeItem[] = [];
  for (const sheet of sheets) {
    if (sheet.sheet_children.length) {
      sheet.sheet_children.forEach((child) => {
        childrenUuids.add(child);
      });
    }
  }
  for (const sheet of sheets) {
    if (uuidsPassed.has(sheet.sheet_uuid) || childrenUuids.has(sheet.sheet_uuid)) continue;
    const item = convertSheetForTree(sheet, sheets);
    result.push(item);
    uuidsPassed.add(sheet.sheet_uuid);
  }
  return result;
};

export const createSheet = async (sheetName: string, parent?: string) => {
  const user_uuid = cookies.get('user_uuid');
  let sheets: ISheet[] = useDataStore().sheetsData;
  const newSheet = await customFetch('/sheets', 'POST', {
    user_uuid,
    sheet_title: sheetName
  });
  sheets.push(newSheet);

  if (parent) {
    const parentSheet = sheets.find((sheet) => sheet.sheet_title === parent);
    parentSheet.sheet_children.push(newSheet.sheet_uuid);
    sheets = sheets.map((sheet: ISheet) => {
      return sheet.sheet_uuid !== parentSheet.sheet_uuid ? sheet : parentSheet;
    });
    await customFetch(`/sheets/${parentSheet.sheet_uuid}`, 'PATCH', parentSheet);
  }

  useDataStore().setSheetsData(sheets);
  await customFetch(`/users/${user_uuid}`, 'PATCH', {
    user_sheets: sheets,
    user_uuid
  });
};

export const replaceSheet = async (sheetName: string, parent?: string) => {
  const user_uuid = cookies.get('user_uuid');
  const sheets: ISheet[] = useDataStore().sheetsData;

  const currentSheet = sheets.find((sheet) => sheet.sheet_title === sheetName);
  const parentSheet = sheets.find((sheet) =>
    sheet.sheet_children.includes(currentSheet.sheet_uuid)
  )!;
  if (parentSheet) {
    parentSheet.sheet_children = parentSheet.sheet_children.filter(
      (uuid) => uuid !== currentSheet.sheet_uuid
    );
    await customFetch(`/sheets/${parentSheet.sheet_uuid}`, 'PATCH', parentSheet);
  }

  if (parent) {
    const newParentSheet = sheets.find((sheet) => sheet.sheet_title === parent)!;
    newParentSheet.sheet_children.push(currentSheet.sheet_uuid);
    await customFetch(`/sheets/${newParentSheet.sheet_uuid}`, 'PATCH', newParentSheet);
  }

  useDataStore().setSheetsData(sheets);
  await customFetch(`/users/${user_uuid}`, 'PATCH', {
    user_sheets: sheets,
    user_uuid
  });
};

export const deleteSheet = async (sheetName: string) => {
  const user_uuid = cookies.get('user_uuid');
  let sheets: ISheet[] = useDataStore().sheetsData;

  const currentSheet = sheets.find((sheet) => sheet.sheet_title === sheetName);
  sheets = sheets.filter((sheet) => sheet.sheet_uuid !== currentSheet.sheet_uuid);
  await customFetch(`/sheets/${currentSheet.sheet_uuid}`, 'DELETE', currentSheet);

  const parentSheet = sheets.find((sheet) =>
    sheet.sheet_children.includes(currentSheet.sheet_uuid)
  )!;
  if (parentSheet) {
    parentSheet.sheet_children.filter((uuid) => uuid !== currentSheet.sheet_uuid);
    const currentSheetChildren = currentSheet.sheet_children;
    if (currentSheetChildren.length) {
      currentSheetChildren.forEach((child) => parentSheet.sheet_children.push(child));
    }
    await customFetch(`/sheets/${currentSheet.sheet_uuid}`, 'PATCH', parentSheet);
  }

  useDataStore().setSheetsData(sheets);
  await customFetch(`/users/${user_uuid}`, 'PATCH', {
    user_sheets: sheets,
    user_uuid
  });
};
