// SYNC: haoshi-erp/src/lib/appointment-services.ts — keep AppointmentService type aligned

export type AppointmentService =
  | 'id_photo'
  | 'portrait'
  | 'group_photo'
  | 'id_photo_makeup'
  | 'portrait_makeup'
  | 'group_photo_makeup'
  | 'makeup_only';

const SERVICE_DISPLAY: Record<
  AppointmentService,
  { shootType: string; makeupAddon: string }
> = {
  id_photo:          { shootType: '證件照', makeupAddon: '不需加購' },
  portrait:          { shootType: '形象照', makeupAddon: '不需加購' },
  group_photo:       { shootType: '合照',   makeupAddon: '不需加購' },
  id_photo_makeup:   { shootType: '證件照', makeupAddon: '加購妝髮' },
  portrait_makeup:   { shootType: '形象照', makeupAddon: '加購妝髮' },
  group_photo_makeup:{ shootType: '合照',   makeupAddon: '加購妝髮' },
  makeup_only:       { shootType: '單妝髮', makeupAddon: '加購妝髮' },
};

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
