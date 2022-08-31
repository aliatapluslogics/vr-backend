import { useState } from "react";
import axios from "axios";

export default function CreateAdmin() {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/userRegister`, formData);
      alert(res.data.message);
      window.location.href = "/#";
    } catch (error) {
        console.log(error);
      alert(error.response.data.message);
    }
  };
  return (
    <div>
      <div className="d-sm-flex align-items-c justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Add Admin</h1>
      </div>
      <form className="user" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            required={true}
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="form-control form-control-user"
            id="exampleInputFirstName"
            placeholder=" First Name..."
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="last_name"
            required={true}
            value={formData.last_name}
            onChange={handleChange}
            className="form-control form-control-user"
            id="exampleInputLastName"
            aria-describedby="emailHelp"
            placeholder=" Last Name..."
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            required={true}
            value={formData.email}
            onChange={handleChange}
            className="form-control form-control-user"
            id="exampleInputEmail"
            aria-describedby="emailHelp"
            placeholder=" Email Address..."
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            required={true}
            value={formData.password}
            onChange={handleChange}
            className="form-control form-control-user"
            id="exampleInputEmail"
            aria-describedby="password"
            placeholder="New Password..."
          />
        </div>
        <input
          value="Create"
          type="submit"
          className="btn btn-primary btn-user btn-block"
        />
      </form>
    </div>
  );
}
