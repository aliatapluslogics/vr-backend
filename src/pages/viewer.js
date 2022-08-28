import { useState, useEffect } from "react";
import axios from "axios";

export default function Viewer() {
    const [customers, setcustomers] = useState("");
    useEffect(() => {
      getcustomers();
    }, []);
  
    const getcustomers = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/customers/`);
      setcustomers(res.data.customers);
    };

    const getInitialState = () => {
        const value = "cb0d099e-def8-48bd-8a1e-07c7df8b6ace";
        if (customers.length > 0) {
            value = customers[0].uniqueId;
        }
        return value;
    };
    const [value, setValue] = useState(getInitialState);
    
    const handleChange = (e) => {
        setValue(e.target.value);
        var iframe = document.getElementById('viewerFrame');
        iframe.src = `${process.env.REACT_APP_VIEWER_URL}?customerId=${e.target.value}`;        
    };    
  
    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-start mb-4">
                <select value={value} onChange={handleChange}>
                    {customers && customers.length > 0 ? 
                        customers.map((customer, index) => (
                            <option key={index} value={customer.uniqueId}>Customer: {customer.email}</option>    
                        )) : null
                    }
                </select>
                       
            </div>
            
            <iframe id="viewerFrame" src={`${process.env.REACT_APP_VIEWER_URL}?customerId=${value}`}>
                Your browser doesn't support iframes
            </iframe>                             
        </>
    );
}