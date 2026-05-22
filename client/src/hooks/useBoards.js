import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api.js';

export const useBoards = () =>
  useQuery({
    queryKey: ['boards'],
    queryFn: () => api.get('/boards').then((r) => r.data.data),
  });

export const useCreateBoard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/boards', data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['boards'] }),
  });
};

export const useUpdateBoard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/boards/${id}`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['boards'] }),
  });
};

export const useDeleteBoard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/boards/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['boards'] });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useAddColumn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, name }) =>
      api.post(`/boards/${boardId}/columns`, { name }).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['boards'] }),
  });
};

export const useUpdateColumn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, colId, name }) =>
      api.patch(`/boards/${boardId}/columns/${colId}`, { name }).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['boards'] }),
  });
};

export const useDeleteColumn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, colId }) =>
      api.delete(`/boards/${boardId}/columns/${colId}`).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['boards'] });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
