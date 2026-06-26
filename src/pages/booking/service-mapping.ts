/** §5.1 service enum — mirrors haoshi-erp appointment-services.ts */

export type AppointmentService =
  | 'id_photo'
  | 'portrait'
  | 'group_photo'
  | 'id_photo_makeup'
  | 'portrait_makeup'
  | 'group_photo_makeup'
  | 'makeup_only';

const SERVICE_ID_TO_ENUM: Record<number, AppointmentService> = {
  3: 'id_photo',
  4: 'portrait',
  5: 'group_photo',
  16: 'id_photo_makeup',
  12: 'portrait_makeup',
  14: 'group_photo_makeup',
  17: 'makeup_only',
};

const SERVICE_DISPLAY: Record<
  AppointmentService,
  { shootType: string; makeupAddon: string }
> = {
  id_photo: { shootType: '證件照', makeupAddon: '不需加購' },
  portrait: { shootType: '形象照', makeupAddon: '不需加購' },
  group_photo: { shootType: '合照', makeupAddon: '不需加購' },
  id_photo_makeup: { shootType: '證件照', makeupAddon: '加購妝髮' },
  portrait_makeup: { shootType: '形象照', makeupAddon: '加購妝髮' },
  group_photo_makeup: { shootType: '合照', makeupAddon: '加購妝髮' },
  makeup_only: { shootType: '單妝髮', makeupAddon: '加購妝髮' },
};

export function serviceIdToEnum(serviceId: number): AppointmentService | undefined {
  return SERVICE_ID_TO_ENUM[serviceId];
}

export function displayFromServiceEnum(service: string): {
  shootType: string;
  makeupAddon: string;
} {
  return (
    SERVICE_DISPLAY[service as AppointmentService] ?? {
      shootType: '其他',
      makeupAddon: '不需加購',
    }
  );
}
