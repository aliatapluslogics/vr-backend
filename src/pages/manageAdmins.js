import { useState, useEffect } from "react";
import axios from "axios";

export default function Admins() {
  const [admins, setAdmins] = useState("");
  useEffect(() => {
    getAdmins();
  }, []);
  const getAdmins = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/getAll`);
      setAdmins(res.data.users);
    } catch (err) {
      console.log(err)
    }
  };
  const handleDelete = async (paramId) => {
    let confirmDelete = confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) {
      return;
    }
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/users/delete/${paramId}`);
      alert(res.data.message);
      window.location.reload();
    } catch (error) {
      console.log(error)
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-end mb-4">
        <a
          href="#/createAdmin"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <i className="fas fa-plus fa-sm text-white-50"></i> Add Admin
        </a>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Admins</h6>
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
                  <th>#Sr </th>
                  <th> Email</th>
                  <th>Created At</th>
                  <th>Action </th>
                </tr>
              </thead>

              <tbody>
                {admins && admins.length > 0
                  ? admins.map(
                    (
                      { _id, email, createdAt },
                      index
                    ) => (
                      <tr key={_id}>
                        <td>{index + 1}</td>
                        <td>{email}</td>
                        <td>{createdAt}</td>
                        <td>
                          <a
                            href="#"
                            onClick={() => handleDelete(_id)}
                            className="btn btn-danger btn-circle"
                          >
                            <i className="fas fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                    )
                  )
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
