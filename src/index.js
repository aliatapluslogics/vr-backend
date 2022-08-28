import { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Login from './pages/login';
import Layout from './layout/layout';
import Customer from './pages/customer';
import CreateCustomer from './pages/createCustomer';
import EditCustomer from './pages/editCustomer';
import UploadModel from './pages/uploadModel';
import ModelUrls from './pages/modelUrls';
import Viewer from './pages/viewer';
import CustomerSnippet from './pages/customerSnippet';

const UserContext = createContext(null);

function Spa() {
  let isAuthenticate = localStorage.getItem("token");
  if (isAuthenticate) {
    return (
      <HashRouter>
        <Layout>
          <div>
            <UserContext.Provider
              value={{
                users: [{ name: "", email: "", password: "", balance: 0 }],
              }}
            >
              <div className="container-fluid fill-height" style={{ padding: "10px" }}>
              <Routes>
                <Route path="/" element={<Customer />} />

                <Route
                  path="/createCustomer"
                  element={<CreateCustomer />}
                />
                <Route
                  path="/editCustomer/:id"
                  element={<EditCustomer />}
                />
                <Route path="/uploadModel/:id" element={<UploadModel />} />
                <Route path="/modelUrls/:id" element={<ModelUrls />} />
                <Route path="/viewer" element={<Viewer />} />
                <Route path="/getSnippet/:id" element={<CustomerSnippet />} />
              </Routes>
              </div>
            </UserContext.Provider>
          </div>
        </Layout>
      </HashRouter>
    );
  } else {
    return (
      <HashRouter>
        
        <div>
          <UserContext.Provider
            value={{
              users: [{ name: "", email: "", password: "", balance: 0 }],
            }}
          >
            <div className="container" style={{ padding: "20px" }}>
            <Routes>
              <Route path="/" element={<Login />} />
            </Routes>
            </div>
          </UserContext.Provider>
        </div>
        
      </HashRouter>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<Spa />);
