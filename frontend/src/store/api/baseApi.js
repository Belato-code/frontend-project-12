// store/api/baseApi.js - УПРОЩЕННАЯ версия
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const getAuthHeader = () => {
  const token = localStorage.getItem('authToken')
  if (token) {
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers) => {
    const authHeader = getAuthHeader()
    if(authHeader.Authorization) {
      headers.set('Authorization', authHeader.Authorization)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Channel', 'Message'],
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '/channels',
      providesTags: ['Channel'],
    }),

    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Message'],
    }),

    addChannel: builder.mutation({
      query: (channelName) => ({
        url: '/channels',
        method: 'POST',
        body: { name: channelName },
      }),
      invalidatesTags: ['Channel'],
    }),

    addMessage: builder.mutation({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: ['Message'],
    }),

    editChannel: builder.mutation({
      query: ({ id, channelName }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: { name: channelName },
      }),
      invalidatesTags: ['Channel'],
    }),

    deleteChannel: builder.mutation({
      query: (id) => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Channel'],
    }),
  }),
})

export const {
  useGetChannelsQuery,
  useAddChannelMutation,
  useEditChannelMutation,
  useDeleteChannelMutation,
  useGetMessagesQuery,
  useAddMessageMutation,
} = baseApi

export default baseApi
