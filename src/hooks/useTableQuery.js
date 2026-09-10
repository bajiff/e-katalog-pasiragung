import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useTableQuery(table, { defaultSort = 'newest', searchColumn = 'name', selectQuery = '*' } = {}) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(defaultSort);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 10 | 20 | 30 | 'all'
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const sortMap = {
    newest: ['created_at', { ascending: false }],
    oldest: ['created_at', { ascending: true }],
    highest: ['price', { ascending: false }], // For products
    lowest: ['price', { ascending: true }],
    name_asc: ['name', { ascending: true }],
    name_desc: ['name', { ascending: false }],
    number: ['id', { ascending: true }],
  };

  const fetchData = useCallback(async (opts = {}) => {
    const { exportMode = false } = opts;
    const [column, sortOpts] = sortMap[sort] || sortMap.newest;
    let query = supabase.from(table).select(selectQuery, { count: 'exact' });

    if (search) {
      query = query.ilike(searchColumn, `%${search}%`);
    }
    
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    query = query.order(column, sortOpts);

    if (pageSize !== 'all' && !exportMode) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;
    return { data, count, error };
  }, [table, searchColumn, search, sort, page, pageSize, statusFilter]);

  return {
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedIds,
    setSelectedIds,
    statusFilter,
    setStatusFilter,
    fetchData,
  };
}
