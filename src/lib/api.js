import axios from 'axios';
import { AUTH } from './auth';

const ENDPOINTS = {
  popularPoems: `${process.env.REACT_APP_BASE_URL}/api/poems/`,
  poemIndex: (query) =>
    `${process.env.REACT_APP_BASE_URL}/api/poems/poem-index/?search=${query}`,
  singlePoem: (id) => `${process.env.REACT_APP_BASE_URL}/api/poems/${id}/`,
  searchPoemTitles: (query) =>
    `${process.env.REACT_APP_BASE_URL}/api/poems/search-titles?search=${query}`,
  searchPoemContent: (query) =>
    `${process.env.REACT_APP_BASE_URL}/api/poems/search-content?search=${query}`,
  allAuthors: `${process.env.REACT_APP_BASE_URL}/api/authors/`,
  popularAuthors: `${process.env.REACT_APP_BASE_URL}/api/authors/popular/`,
  authorIndex: (query) =>
    `${process.env.REACT_APP_BASE_URL}/api/authors/index/?search=${query}`,
  singleAuthor: (id) => `${process.env.REACT_APP_BASE_URL}/api/authors/${id}/`,
  searchAuthors: (query) =>
    `${process.env.REACT_APP_BASE_URL}/api/authors/search?search=${query}`,
  allPosts: `${process.env.REACT_APP_BASE_URL}/api/posts/`,
  recentPosts: `${process.env.REACT_APP_BASE_URL}/api/posts/recent/`,
  singlePost: (id) => `${process.env.REACT_APP_BASE_URL}/api/posts/${id}/`,
  searchPosts: (query) =>
    `${process.env.REACT_APP_BASE_URL}/api/posts/search?search=${query}`,
  allComments: `${process.env.REACT_APP_BASE_URL}/api/comments/`,
  singleComment: (id) =>
    `${process.env.REACT_APP_BASE_URL}/api/comments/${id}/`,
  allUsers: `${process.env.REACT_APP_BASE_URL}/api/auth/`,
  singleUser: (id) => `${process.env.REACT_APP_BASE_URL}/api/auth/${id}/`,
  searchUsers: (query) =>
    `${process.env.REACT_APP_BASE_URL}/api/auth/search?search=${query}`,
  login: `${process.env.REACT_APP_BASE_URL}/api/auth/login/`,
  register: `${process.env.REACT_APP_BASE_URL}/api/auth/register/`,
  cloudinary: `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`
};

const getHeaders = () => ({
  headers: {
    authorization: `Bearer ${AUTH.getToken()}`
  }
});

const GET = (endpoint) => axios.get(endpoint);

const POST = (endpoint, body, headers) =>
  headers ? axios.post(endpoint, body, headers) : axios.post(endpoint, body);
const PUT = (endpoint, body, headers) => axios.put(endpoint, body, headers);
const DELETE = (endpoint, headers) => axios.delete(endpoint, headers);

export const API = { GET, POST, PUT, DELETE, ENDPOINTS, getHeaders };
