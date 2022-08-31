import { useState, useEffect } from "react";
import Progressbar from '../common/progressBar';
import axios from "axios";

export default function UploadModel() {
  const [model, setModel] = useState("");
  const [paramId, setparamId] = useState("");
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(0);


  const handleChange = (e) => {
    const files = e.target.files;
    setModel(files);
  };

  useEffect(() => {
    const paramId = window.location.hash.split("#/uploadModel/")[1];
    setparamId(paramId);
    isParamIDExist(paramId);
  }, []);

  const isParamIDExist = async (paramId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/customers/uniqueId/${paramId}`);
    } catch (error) {
      alert("UniqueId Does Not Exist");
      window.location.href = "#/";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    for (let index = 0;index < model.length;index++) {
      const element = model[index];
      formData.append("models", element);
    }

    try {
      const options = {
        onUploadProgress: (progressEvent) => {
          console.log(progressEvent);
          const { loaded, total} = progressEvent;
          let percent = Math.floor (loaded * 100)/total
          setCompleted(percent)
        }
      }
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/customers/uploadModel/${paramId}`,
        formData,
        options
      );
      alert(res.data.message);
      window.location.href = "/#";
    } catch (error) {
      alert(error.response.data.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-sm-flex align-items-c justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Upload Model</h1>
      </div>
      <form className="user" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            required={true}
            value={paramId}
            accept="/application/octet-stream"
            readOnly={true}
            disabled={true}
            className="form-control form-control-user"
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            required={true}
            name="model"
            multiple
            onChange={handleChange}
            className="form-control "
          />
        </div>
        <input
          value="Upload"
          type="submit"
          className="btn btn-primary btn-user btn-block"
        />
        {loading && <div className="row">
          <Progressbar bgcolor="#ff00ff" progress={Math.floor(completed)} height={18} />
        </div>}
      </form>
    </div>
  );
}
