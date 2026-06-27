import type { AdditionalField } from './types';
import type { AppointmentService } from './service-mapping';
import { ADDON_MAKEUP_OPTIONS, STANDALONE_MAKEUP_OPTIONS } from './arrival-time';

/** 官網預約問卷（原 SimplyBook additional fields，改為靜態設定） */

function genderField(pos: number): AdditionalField {
  return {
    id: '1',
    name: 'data_field_1',
    title: '您的性別',
    type: 'select',
    values: '女生,男生,非二元性別',
    default: null,
    is_null: '1',
    pos: String(pos),
  };
}

function jobTitleField(pos: number): AdditionalField {
  return {
    id: '2',
    name: 'data_field_2',
    title: '您的職稱或專業領域 （若未畢業可填學校系級）',
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
    title: '請問是從何知道我們的服務呢？',
    type: 'select',
    values:
      'Google搜尋,IG/FB,朋友介紹,家人,公司同事,之前曾經來過,認識攝影師或造型師,其他',
    default: null,
    is_null: '0',
    pos: String(pos),
  };
}

function purposeField(pos: number): AdditionalField {
  return {
    id: '9',
    name: 'data_field_9',
    title: '您的拍攝目的或用途',
    type: 'text',
    values: null,
    default: null,
    is_null: '0',
    pos: String(pos),
  };
}

function marketingField(pos: number): AdditionalField {
  return {
    id: '10',
    name: 'data_field_10',
    title: '第一次聽到好時有影大約是多久之前呢',
    type: 'select',
    values: '一個月內,三個月內,半年,一年,兩年,三年以上',
    default: null,
    is_null: '0',
    pos: String(pos),
  };
}

function noteField(pos: number): AdditionalField {
  return {
    id: '5',
    name: 'data_field_5',
    title: '備註（全身照、急件、請在此備註）',
    type: 'textarea',
    values: null,
    default: null,
    is_null: '1',
    pos: String(pos),
  };
}

function makeupField(pos: number): AdditionalField {
  return {
    id: '4',
    name: 'data_field_4',
    title: '化妝服務確認',
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
    title: '原預約項目外是否再加購證件照（電子檔含精修，無沖印實體照片）*請多留30分鐘時間',
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
    purposeField(3),
    referralField(4),
    marketingField(5),
  ];
  if (opts.group) fields.splice(2, 0, groupSizeField(3));
  if (opts.idPhoto) fields.push(extraIdPhotoField(6));
  fields.push(noteField(7));
  return reindex(fields);
}

function buildMakeupFields(opts: {
  group?: boolean;
  idPhoto?: boolean;
}): AdditionalField[] {
  const fields: AdditionalField[] = [
    genderField(1),
    jobTitleField(2),
    purposeField(3),
    referralField(4),
    marketingField(5),
    makeupField(6),
  ];
  if (opts.group) fields.splice(2, 0, groupSizeField(3));
  if (opts.idPhoto) fields.push(extraIdPhotoField(7));
  fields.push(noteField(8));
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

const FIELDS_BY_SERVICE: Record<AppointmentService, AdditionalField[]> = {
  id_photo:           buildPhotoFields({ idPhoto: true }),
  portrait:           buildPhotoFields({ idPhoto: true }),
  group_photo:        buildPhotoFields({ group: true }),
  portrait_makeup:    buildMakeupFields({}),
  group_photo_makeup: buildMakeupFields({ group: true }),
  id_photo_makeup:    buildMakeupFields({ idPhoto: true }),
  makeup_only:        buildStandaloneMakeupFields(),
};

export function getBookingFormFields(service: AppointmentService): AdditionalField[] {
  return FIELDS_BY_SERVICE[service] ?? [];
}
