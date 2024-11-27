import { Button, Card, Form, Input, Popconfirm, message } from "antd";
import "./index.css";
import { useEffect, useState } from "react";
import { list, deleteBook } from "../../interfaces";
import { CreateBookModal } from "./CreateBookModal";
import { UpdateBookModal } from "./UpdateBookModal";

interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
  cover: string;
}

export function BookManage() {
  const [bookList, setBookList] = useState<Array<Book>>([]);
  const [name, setName] = useState("");

  const [isCreateBookModalOpen, setCreateBookModalOpen] = useState(false);

  const [isUpdateBookModalOpen, setUpdateBookModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(0);

  async function fetchData() {
    const data = await list(name);

    if (data.status === 201 || data.status === 200) {
      setBookList(data.data);
    }
  }

  async function handleDelete(id: number) {
    await deleteBook(id);
    message.success("删除成功");
    fetchData();
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  async function searchBook(values: { name: string }) {
    setName(values.name);
  }

  return (
    <div id="bookManage">
      <h1>图书管理系统</h1>
      <div className="content">
        <div className="book-search">
          <Form
            onFinish={searchBook}
            name="search"
            layout="inline"
            colon={false}
          >
            <Form.Item label="图书名称" name="name">
              <Input />
            </Form.Item>
            <Form.Item label=" ">
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: "10px" }}
              >
                搜索图书
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ background: "green" }}
                onClick={() => {
                  setCreateBookModalOpen(true);
                }}
              >
                添加图书
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="book-list">
          {bookList.map((book) => {
            return (
              <Card
                key={book.id}
                className="card"
                hoverable
                style={{ width: 300 }}
                cover={
                  <img
                    alt="example"
                    src={`http://localhost:3001/${book.cover}`}
                  />
                }
              >
                <h2>{book.name}</h2>
                <div>{book.author}</div>
                <div className="links">
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      setUpdateId(book.id);
                      setUpdateBookModalOpen(true);
                    }}
                  >
                    编辑
                  </a>
                  <Popconfirm
                    title="图书删除"
                    description="确认删除吗？"
                    onConfirm={() => handleDelete(book.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <a>删除</a>
                  </Popconfirm>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <CreateBookModal
        isOpen={isCreateBookModalOpen}
        handleClose={() => {
          setCreateBookModalOpen(false);
          fetchData();
        }}
      ></CreateBookModal>

      <UpdateBookModal
        id={updateId}
        isOpen={isUpdateBookModalOpen}
        handleClose={() => {
          setUpdateBookModalOpen(false);
          setName("");
        }}
      ></UpdateBookModal>
    </div>
  );
}
