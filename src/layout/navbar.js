import Profile from "../img/undraw_profile.svg";
import Modal from 'react-modal';
import { useState } from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom'; 


export default function NavBar() {
  let isAuthenticate = localStorage.getItem("user");
  const [resetPassModalIsOpen, setResetPassModalIsOpen] = useState(false)
  const [data, setData] = useState({})
  let navigate = useNavigate ();
  let user;
  if (isAuthenticate) {
    user = JSON.parse(isAuthenticate);
  }

  const openCloseResetPassModal = () => {
    setResetPassModalIsOpen(!resetPassModalIsOpen)
  };

  const onChange = async (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = data
    const isConfirm = confirmNewPassword === newPassword
    if(!isConfirm) {
      alert("Confirm password does not match")
      return;
    }

    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/users/resetPass`, {
        currentPassword,
        newPassword,
        userId: user._id
      });
      alert(res.data.message);
      openCloseResetPassModal()
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* Topbar Navbar */}
      <ul className="navbar-nav ml-auto">
        {/* Nav Item - Search Dropdown (Visible Only XS) */}
        {/* Nav Item - Alerts */}
        {/* Nav Item - Messages */}
        <div className="topbar-divider d-none d-sm-block" />
        {/* Nav Item - User Information */}
        <li className="nav-item dropdown no-arrow">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="userDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
              {user && user.email}
            </span>
            <img
              className="img-profile rounded-circle"
              src={Profile}
            />
          </a>
          {/* Dropdown - User Information */}
          <div
            className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="userDropdown"
          >
            <a
              href=""
              className="dropdown-item"
              onClick={openCloseResetPassModal}
              data-toggle="modal"
              data-target="#logoutModal"
            >
              <i className="fas fa-refresh fa-sm fa-fw mr-2 text-gray-400" />
              Reset Password
            </a>
            <a
              className="dropdown-item"
              onClick={() => {
                localStorage.clear();
                window.location.replace("/")
              }}
              data-toggle="modal"
              data-target="#logoutModal"
            >
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
              Logout
            </a>
          </div>
        </li>
      </ul>
      <Modal
        isOpen={resetPassModalIsOpen}
        onRequestClose={openCloseResetPassModal}
      >
        <div className="row justify-content-center">
          <h1 className="h4 text-gray-900 mb-4">Reset Password</h1>
        </div>
        <div className="d-sm-flex flex-column align-items-c justify-content-between h-50 p-3 m-5">
          <input
            type="password"
            required={true}
            name="currentPassword"
            onChange={onChange}
            className="form-control form-control-user"
            id="exampleInputFirstName"
            placeholder="Current password"
          />
          <input
            type="password"
            required={true}
            name="newPassword"
            onChange={onChange}
            className="form-control form-control-user"
            id="exampleInputFirstName"
            placeholder="New Password"
          />
          <input
            type="password"
            required={true}
            name="confirmNewPassword"
            onChange={onChange}
            className="form-control form-control-user"
            id="exampleInputFirstName"
            placeholder="Confirm new password"
          />
        </div>
        <div className="d-sm-flex flex-row justify-content-center">
          <a
            type="cancel"
            value="cancel"
            className="btn btn-lg btn-primary w-2 mr-3"
            onClick={onSubmit}
          >Submit</a>
          <a
            type="cancel"
            value="cancel"
            className="btn btn-lg btn-primary"
            onClick={openCloseResetPassModal}
          >Cancel</a>
        </div>
      </Modal>
    </nav>
  );
}
