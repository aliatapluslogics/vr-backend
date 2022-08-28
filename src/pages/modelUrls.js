import { useState, useEffect } from "react";
import axios from "axios";


export default function ModelUrls() {
  const [models, setmodels] = useState("");

  useEffect(() => {
    const paramId = window.location.hash.split("#/modelUrls/")[1];
    getModels(paramId);
  }, []);

  const getModels = async (paramId) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/customers/getModels`, {
      uniqueId: paramId,
    });
    setmodels(res.data);
  };

  const handleDelete = async (model) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/customers/deleteModel`, {
        model: model,
      });
      alert(res.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Models Url</h6>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered"
              id="dataTable"
              width="100%"
              cellSpacing={0}
            >
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Id</th>
                  <th>Url</th>
                  <th>Model Name</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {models && models.length > 0
                  ? models.map((model, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{model._id}</td>
                      <td>{model.url} <br /> {model.urlIOS}</td>
                      <td>{model.url ? model.url.substring(model.url.lastIndexOf('/') + 1).substring(0, model.url.substring(model.url.lastIndexOf('/') + 1).lastIndexOf('.')) || model.url.substring(model.url.lastIndexOf('/') + 1): null}</td>
                      <td>
                        <a
                          href="#"
                          onClick={() => handleDelete(model)}
                          className="btn btn-danger btn-circle"
                        >
                          <i className="fas fa-trash"></i>
                        </a>
                      </td>
                    </tr>
                  ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
