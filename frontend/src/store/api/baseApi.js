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
  reducerPath: 'channelsApi',
  baseQuery,
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '/channels',
    }),
    addChannel: builder.mutation({
      query: (channelName) => ({
        url: '/channels',
        method: 'POST',
        body: { name: channelName },
      }),
    }),
    editChannel: builder.mutation({
      query: ({ id, channelName }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: { name: channelName },
      }),
    }),
    deleteChannel: builder.mutation({
      query: (id) => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
    }),
    getMesages: builder.query({
      query: () => '/messages',
    }),
    addMessage: builder.mutation({
      query: ( message ) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      })
    })
  }),
})

export const {
  useGetChannelsQuery,
  useAddChannelMutation,
  useEditChannelMutation,
  useDeleteChannelMutation,
  useGetMesagesQuery,
  useAddMessageMutation,
} = baseApi

export default baseApi