import { useI18n } from 'vue-i18n';
import { formatEventDate, formatEventTime } from '@/services/eventData';

export function useEventFormatting() {
  const { t, te, locale } = useI18n();
  return {
    interestLabel: (value) => te(`interests.${value}`) ? t(`interests.${value}`) : value,
    eventDate: (timestamp) => formatEventDate(timestamp, locale.value),
    eventTime: (timestamp) => formatEventTime(timestamp, locale.value),
    eventPrice: (price) => price.trim().toLocaleLowerCase('da') === 'gratis' ? t('common.free') : price,
  };
}
