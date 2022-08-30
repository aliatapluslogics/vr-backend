import { useState, useEffect } from "react";
import axios from "axios";

export default function Viewer() {
    const [customers, setcustomers] = useState("");
    const [models, setModels] = useState([]);
    const [value, setValue] = useState(null)
    const [hash, setHash] = useState("")
    useEffect(() => {
        getcustomers();
    }, []);

    const getcustomers = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/customers/`);
        getInitialState(res.data.customers[0])
        setcustomers(res.data.customers);
    };

    const getIdentifier = async (customerId, modelId) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/query/get-hash`, {
                customerId: customerId,
                modelId: modelId
            })
            return res.data.identifier
        } catch (err) {
            console.log(err);
            return null
        }
    }

    const handleModel = async (e) => {
        const modelId = e.target.value
        setValue({ ...value, modelId })
        var iframe = document.getElementById('viewerFrame');
        const res = await getIdentifier(value.uniqueId, modelId);
        setHash(res)
        iframe.src = `${process.env.REACT_APP_VIEWER_URL}/?id=${hash}`;
    };

    const getInitialState = async (customer) => {
        if (customer.uniqueId) {
            if (customer.models.length) {
                const res = await getIdentifier(customer.uniqueId, customer.models[0]._id);
                setModels(customer.models)
                setValue({
                    uniqueId: customer.uniqueId || uniqueId,
                    modelId: customer.models[0]._id
                })
                setHash(res)
            } else{
                setValue({
                    uniqueId: customer.uniqueId || uniqueId,
                    modelId: null
                })

            }
        }
        else alert("Data Not Availabe")
    };

    const handleChange = async (e) => {
        const currentCustomer = customers.find((customer) => e.target.value === customer.uniqueId)
        const modelId = currentCustomer?.models[0] ? currentCustomer?.models[0]._id : null
        setValue({
            uniqueId: e.target.value,
            modelId
        })
        setModels(currentCustomer?.models)
        const res = await getIdentifier(e.target.value, modelId);
        var iframe = document.getElementById('viewerFrame');
        setHash(res)
        iframe.src = `${process.env.REACT_APP_VIEWER_URL}/?id=${hash}`;
        console.log(`${process.env.REACT_APP_VIEWER_URL}/?id=${hash}`)
    };

    return (
        <div>
            {value && <div className="d-sm-flex align-items-center justify-content-center mb-4">
                <select value={value.uniqueId} onChange={handleChange}>
                    {customers && customers.length > 0 ?
                        customers.map((customer, index) => (
                            <option key={index} value={customer.uniqueId}>Customer: {customer.email}</option>
                        )) : null
                    }
                </select>
                <div className="ml-1">{models && models.length > 0 ? <select value={value.modelId} onChange={handleModel}>
                    {
                        models.map((model, index) => (
                            <option key={index} value={model._id}>Model: {model._id}</option>
                        ))
                    }
                </select> : "No Model available"}
                </div>
            </div>}

            {value ? <iframe id="viewerFrame" src={`${process.env.REACT_APP_VIEWER_URL}/?id=${hash}`}>
                Your browser doesn't support iframes
            </iframe> : <div>Loading...</div>}
        </div>
    );
}