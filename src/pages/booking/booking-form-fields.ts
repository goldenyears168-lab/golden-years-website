import type { AdditionalField } from './types';
import { ADDON_MAKEUP_OPTIONS, STANDALONE_MAKEUP_OPTIONS } from './arrival-time';

/** 官網預約問卷（原 SimplyBook additional fields，改為靜態設定） */

function genderField(pos: number): AdditionalField {
  return {
    id: '1',
    name: 'data_field_1',
    title: '您的性別',
    type: 'select',
    values: '男生,女生',
    default: null,
    is_null: '0',
    pos: String(pos),
  };
}

function jobTitleField(pos: number): AdditionalField {
  return {
    id: '2',
    name: 'data_field_2',
    title: '職稱或專業',
    type: 'text',
    values: null,
    default: null,
    is_null: '0',
    pos: String(pos),
  };
}

function referralField(pos: number): AdditionalField {
  return {
    id: '3',
    name: 'data_field_3',
    title: '從何知道好時有影',
    type: 'select',
    values: 'Instagram,Google 搜尋,朋友介紹,以前拍過,其他',
    default: null,
    is_null: '0',
    pos: String(pos),
  };
}

function purposeField(pos: number): AdditionalField {
  return {
    id: '9',
    name: 'data_field_9',
    title: '拍攝目的',
    type: 'text',
    values: null,
    default: null,
    is_null: '1',
    pos: String(pos),
  };
}

function marketingField(pos: number): AdditionalField {
  return {
    id: '10',
    name: 'data_field_10',
    title: '距離上次拍攝多久',
    type: 'select',
    values: '第一次拍攝,1 年內,1-3 年前,3 年以上',
    default: null,
    is_null: '1',
    pos: String(pos),
  };
}

function noteField(pos: number): AdditionalField {
  return {
    id: '5',
    name: 'data_field_5',
    title: '備註（選填）',
    type: 'text',
    values: null,
    default: '請勿在此問問題，如有疑問或特殊需求，歡迎直接撥打電話或私訊 LINE',
    is_null: '1',
    pos: String(pos),
  };
}

function makeupField(pos: number): AdditionalField {
  return {
    id: '4',
    name: 'data_field_4',
    title: '化妝服務',
    type: 'select',
    values: ADDON_MAKEUP_OPTIONS.join(','),
    default: null,
    is_null: '0',
    pos: String(pos),
  };
}

function standaloneMakeupField(pos: number): AdditionalField {
  return {
    id: '4',
    name: 'data_field_4',
    title: '妝髮方案',
    type: 'select',
    values: STANDALONE_MAKEUP_OPTIONS.join(','),
    default: null,
    is_null: '0',
    pos: String(pos),
  };
}

function groupSizeField(pos: number): AdditionalField {
  return {
    id: '8',
    name: 'data_field_8',
    title: '合照的人數',
    type: 'select',
    values: '2,3,4,5,6',
    default: null,
    is_null: '0',
    pos: String(pos),
  };
}

function extraIdPhotoField(pos: number): AdditionalField {
  return {
    id: '7',
    name: 'data_field_7',
    title: '再加購證件照',
    type: 'select',
    values:
      '不需再加購,同一人，額外再加購一張證件照(+399/張),不同人，也要拍證件照(限不含妝髮，+399/張)',
    default: '不需再加購',
    is_null: '0',
    pos: String(pos),
  };
}

function reindex(fields: AdditionalField[]): AdditionalField[] {
  return fields.map((f, i) => ({ ...f, pos: String(i + 1) }));
}

function buildPhotoFields(opts: { idPhoto?: boolean; group?: boolean }): AdditionalField[] {
  const fields: AdditionalField[] = [
    genderField(1),
    jobTitleField(2),
    referralField(3),
    purposeField(4),
    marketingField(5),
    noteField(6),
  ];
  if (opts.idPhoto) fields.splice(3, 0, extraIdPhotoField(4));
  if (opts.group) fields.splice(3, 0, groupSizeField(4));
  return reindex(fields);
}

function buildMakeupFields(opts: {
  group?: boolean;
  idPhoto?: boolean;
}): AdditionalField[] {
  const fields: AdditionalField[] = [
    genderField(1),
    jobTitleField(2),
    makeupField(3),
    referralField(4),
    purposeField(5),
    marketingField(6),
    noteField(7),
  ];
  if (opts.idPhoto) fields.splice(4, 0, extraIdPhotoField(5));
  if (opts.group) fields.splice(4, 0, groupSizeField(5));
  return reindex(fields);
}

function buildStandaloneMakeupFields(): AdditionalField[] {
  return reindex([
    genderField(1),
    standaloneMakeupField(2),
    referralField(3),
    noteField(4),
  ]);
}

const FIELDS_BY_SERVICE: Record<number, AdditionalField[]> = {
  3: buildPhotoFields({ idPhoto: true }),
  4: buildPhotoFields({}),
  5: buildPhotoFields({ group: true }),
  12: buildMakeupFields({}),
  14: buildMakeupFields({ group: true }),
  16: buildMakeupFields({ idPhoto: true }),
  17: buildStandaloneMakeupFields(),
};

export function getBookingFormFields(serviceId: number): AdditionalField[] {
  return FIELDS_BY_SERVICE[serviceId] ?? [];
}
