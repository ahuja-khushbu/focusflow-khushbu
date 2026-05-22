import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../lib/api.js';

export const useComments = (taskId) =>
  useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const res = await api.get(`/tasks/${taskId}/comments`);
      return res.data.data;
    },
    enabled: !!taskId,
  });

export const useCreateComment = (taskId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post(`/tasks/${taskId}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
    onError: () => toast.error('Failed to post comment'),
  });
};

export const useUpdateComment = (taskId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, body }) => api.patch(`/tasks/${taskId}/comments/${commentId}`, { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    },
    onError: () => toast.error('Failed to update comment'),
  });
};

export const useDeleteComment = (taskId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => api.delete(`/tasks/${taskId}/comments/${commentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete comment'),
  });
};
