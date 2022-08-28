import { useState, useEffect } from "react";
import axios from "axios";

export default function Viewer() {
    const [customers, setcustomers] = useState("");
    const [models, setModels] = useState();

    useEffect(() => {
        getcustomers();
    }, []);

    const getcustomers = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/customers/`);
        setcustomers(res.data.customers);
    };

    const handleModel = (e) => {
        setValue({ ...value, modelId: e.target.value })
        var iframe = document.getElementById('viewerFrame');
        iframe.src = `${process.env.REACT_APP_VIEWER_URL}?customerId=${value.uniqueId}&modelId=${e.target.value}`;

    };
    const getInitialState = () => {
        const uniqueId = "cb0d099e-def8-48bd-8a1e-07c7df8b6ace";
        setModels(customers[0] ? customers[0].models : [])
        if (customers.length > 0 && customers[0].models.length > 0) {
            return {
                uniqueId: customers[0].uniqueId || uniqueId,
                modelId: customers[0].models[0]._id
            }
        }
        else return {}
    };
    const [value, setValue] = useState(getInitialState);
    const handleChange = (e) => {
        const currentCustomer = customers.find((customer) => e.target.value === customer.uniqueId)
        const modelId = currentCustomer?.models[0] ? currentCustomer?.models[0]._id : null
        setValue({
            uniqueId: e.target.value,
            modelId
        })
        setModels(currentCustomer?.models)
        var iframe = document.getElementById('viewerFrame');
        iframe.src = `${process.env.REACT_APP_VIEWER_URL}?customerId=${e.target.value}&modelId=${modelId}`;
    };

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-center mb-4">
                <select value={value.uniqueId} onChange={handleChange}>
                    {customers && customers.length > 0 ?
                        customers.map((customer, index) => (
                            <option key={index} value={customer.uniqueId}>Customer: {customer.email}</option>
                        )) : null
                    }
                </select>
                <div className="ml-1">{models && models.length > 0 ? <select value={value} onChange={handleModel}>
                    {
                        models.map((model, index) => (
                            <option key={index} value={model._id}>Model: {model._id}</option>
                        ))
                    }
                </select> : "No Model available"}
                </div>
            </div>

            <iframe id="viewerFrame" src={`${process.env.REACT_APP_VIEWER_URL}?customerId=${value}`}>
                Your browser doesn't support iframes
            </iframe>
        </>
    );
}