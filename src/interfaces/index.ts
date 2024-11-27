import axios from "axios";

interface Book {
  id?: number;
  name: string;
  author: string;
  description: string;
  cover: string;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 3000,
});

export async function register(username: string, password: string) {
  return await axiosInstance.post("/user/register", {
    username,
    password,
  });
}

export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/login", {
    username,
    password,
  });
}

export async function list(name: string) {
  return await axiosInstance.get(`/book/list?name=${name}`);
}

export async function create(book: Book) {
  return await axiosInstance.post("/book/create", {
    name: book.name,
    author: book.author,
    description: book.description,
    cover: book.cover,
  });
}

export async function detail(id: number) {
  return await axiosInstance.get(`/book/${id}`);
}

export async function update(book: Book) {
  return await axiosInstance.put("/book/update", {
    id: book.id,
    name: book.name,
    author: book.author,
    description: book.description,
    cover: book.cover,
  });
}

export async function deleteBook(id: number) {
  return await axiosInstance.delete(`/book/delete/${id}`);
}
