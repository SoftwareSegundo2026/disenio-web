import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { t } from '@/lib/i18n';
interface PaginationProps {
  page: number;
  totalCount: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}
export default function Pagination({ page, totalCount, rowsPerPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, page === 0 ? styles.buttonDisabled : null]}
        onPress={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        <Text style={[styles.buttonIcon, page === 0 ? styles.buttonTextDisabled : null]}>
          ◀️
        </Text>
      </TouchableOpacity>
      <Text style={styles.info}>
        {t('pagination.page', {
          page: page + 1,
          total: totalPages || 1,
          count: totalCount,
        })}
      </Text>
      <TouchableOpacity
        style={[styles.button, page >= totalPages - 1 ? styles.buttonDisabled : null]}
        onPress={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        <Text style={[styles.buttonIcon, page >= totalPages - 1 ? styles.buttonTextDisabled : null]}>
          ▶️
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#2a2a4a',
  },
  button: {
    width: 20,
    height: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    color: '#00d4ff',
    fontWeight: '700',
    fontSize: 8,
  },
  buttonTextDisabled: {
    color: '#2a2a4a',
  },
  info: {
    color: '#888',
    fontSize: 8
  },
});
