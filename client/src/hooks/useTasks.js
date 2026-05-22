import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import useFilterStore from '../store/filterStore.js';

export const useTasksQuery = (extraParams = {}) => {
  const { activeTags, activeStatus, activePriority, searchQuery } = useFilterStore();

  const params = {
    ...(activeTags.length && { tags: activeTags.join(',') }),
    ...(activeStatus && { status: activeStatus }),
    ...(activePriority && { priority: activePriority }),
    ...(searchQuery && { search: searchQuery }),
    ...extraParams,
  };

  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const res = await api.get('/tasks', { params });
      return res.data;
    },
  });
};

export const useTask = (id) =>
  useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const res = await api.get(`/tasks/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/tasks', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created');
    },
    onError: () => toast.error('Failed to create task'),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/tasks/${id}`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated');
    },
    onError: () => toast.error('Failed to update task'),
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  const filters = useFilterStore();

  return useMutation({
    mutationFn: ({ id, status }) => api.patch(`/tasks/${id}/status`, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const keys = queryClient.getQueriesData({ queryKey: ['tasks'] });
      const snapshots = [];

      keys.forEach(([key, data]) => {
        if (data?.data) {
          snapshots.push({ key, data });
          queryClient.setQueryData(key, (old) => ({
            ...old,
            data: old.data.map((t) => (t._id === id ? { ...t, status } : t)),
          }));
        }
      });

      return { snapshots };
    },
    onError: (err, vars, ctx) => {
      ctx?.snapshots?.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });
      toast.error('Failed to move task');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
    onError: () => toast.error('Failed to delete task'),
  });
};
