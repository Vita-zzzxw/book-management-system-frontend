import { useState } from "react";

import { Button, message, Upload } from "antd";
import type { UploadFile } from "antd";
import axios from "axios";

interface Props {
  onChange: (name: string) => void;
}
export function MaxUpload(props: Props) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    const chunkSize = 500 * 1024;
    const file = fileList[0] as unknown as File;

    const chunks = [];
    let startPos = 0;
    while (startPos < file?.size) {
      const blob = new Blob([file]);
      chunks.push(blob.slice(startPos, startPos + chunkSize));
      startPos += chunkSize;
    }

    const random = Math.random().toString().slice(2, 8);

    const tasks = [] as Promise<unknown>[];
    chunks.map((chunk, index) => {
      const data = new FormData();
      data.set("name", random + file.name + "-" + index);
      data.append("files", chunk);
      tasks.push(axios.post("http://localhost:3001/book/maxUpload", data));
    });
    await Promise.all(tasks);
    axios
      .get("http://localhost:3001/book/merge?name=" + random + file.name)
      .then((res) => {
        message.success("Upload successfully");
        props.onChange(res.data);
        setUploading(false);
      });
  };

  return (
    <>
      <Upload
        onRemove={(file) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          setFileList(newFileList);
        }}
        beforeUpload={(file) => {
          setFileList([...fileList, file]);

          return false;
        }}
        fileList={fileList}
      >
        <Button>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
    </>
  );
}
