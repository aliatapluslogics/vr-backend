import { useState, useEffect } from "react";
import axios from "axios";

export default function Customer() {
  const [customers, setcustomers] = useState("");
  useEffect(() => {
    getCustomers();
  }, []);
  const getCustomers = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/customers`);
    setcustomers(res.data.customers);
  };
  const handleDelete = async (paramId) => {
    let confirmDelete = confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) {
      return;
    }
  
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/customers/${paramId}`);
      alert(res.data.message);
      window.location.reload();
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-end mb-4">
        <a
          href="#/createCustomer"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <i className="fas fa-plus fa-sm text-white-50"></i> Add Customer
        </a>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Customers</h6>
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

                  <th> Name</th>

                  <th>Email</th>
                  <th>Unique Id</th>
                  <th>Action Model</th>
                  <th>Action </th>
                </tr>
              </thead>

              <tbody>
                {customers && customers.length > 0
                  ? customers.map(
                      (
                        { _id, first_name, last_name, email, uniqueId },
                        index
                      ) => (
                        <tr key={_id}>
                          <td>{index + 1}</td>

                          <td>
                            {`${first_name} ${last_name}`}
                          </td>

                          <td>{email}</td>
                          <td>{uniqueId}</td>

                          <td>
                            <a
                              href={`/#/modelUrls/${uniqueId}`}
                              className="d-none d-sm-inline-block mr-2 btn btn-sm btn-primary shadow-sm"
                            >
                              <i className="fas fa-eye fa-sm text-white-50"></i>{" "}
                              See Models
                            </a>
                            <hr/>
                            <a
                              href={`/#/uploadModel/${uniqueId}`}
                              className="d-none d-sm-inline-block mr-2 btn btn-sm btn-primary shadow-sm"
                            >
                              <i className="fas fa-upload fa-sm text-white-50"></i>{" "}
                              Upload Model
                            </a>
                            <hr/>
                            <a
                              href={`/#/getSnippet/${uniqueId}`}
                              className="d-none d-sm-inline-block mr-2 btn btn-sm btn-primary shadow-sm"
                            >
                              <i className="fas fa-code fa-sm text-white-50"></i>{" "}
                              Get Customer Snippet
                            </a>

                          </td>
                          <td>
                            <a
                              href={`/#/editCustomer/${_id}`}
                              className="btn btn-danger btn-circle mr-2"
                            >
                              <i className="fas fa-edit"></i>
                            </a>
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
