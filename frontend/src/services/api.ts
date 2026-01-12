import axios from 'axios';

// O Token que você me mandou
const TEMPORARY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjU0NDk2MmQxZTA3NzFmYjEyMDRmNyIsImlhdCI6MTc2ODI0NjE0MywiZXhwIjoxNzY4ODUwOTQzfQ.X5BJncNDDnv7DH21EVJNSMZYBtUvVqpF5NFt4dQy3IA";

export const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: {
    Authorization: `Bearer ${TEMPORARY_TOKEN}` 
  }
});