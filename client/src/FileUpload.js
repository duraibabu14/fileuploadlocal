import React, { Fragment, useState } from "react";
import axios from "./axios";
import Message from "./Message";
import Progress from "./Progress";

function FileUpload() {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("Choose File");
  const [uploadFile, setuploadFile] = useState({});
  const [message, setMessage] = useState("");
  const [percent, setPrecent] = useState(0);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (ProgressEvent) => {
          setPrecent(
            parseInt(
              Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
            )
          );
          setTimeout(() => {
            setPrecent(0);
          }, 10000);
        },
      });
      const { fileName, filePath } = res.data;
      setuploadFile({ fileName, filePath });
      setMessage("File Uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("Oops Error in Server");
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={handleSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="custom-file"
            onChange={handleChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {fileName}
          </label>
        </div>

        <Progress percentage={percent} />

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
      {uploadFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">{uploadFile.fileName}</h3>
            <img style={{ width: "100%" }} src={uploadFile.filePath} alt="" />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
}

export default FileUpload;
