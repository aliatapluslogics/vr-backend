import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerSnippet() {
  const [paramId, setparamId] = useState("");
  const [models, setmodels] = useState("");

  useEffect(() => {
    const paramId = window.location.hash.split("#/getSnippet/")[1];
    setparamId(paramId);
    isParamIDExist(paramId);
    getModels(paramId)
  }, []
  );


  //                       *******replacing bitly link with db hash link******


  // const shortLink = async (link) => {
  //     const resp = await fetch('https://api-ssl.bitly.com/v4/shorten', {
  //         method: 'POST',
  //         headers: {
  //             'Authorization': `Bearer ${process.env.REACT_APP_BITLY_TOKEN}`,
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({ "long_url": link.replace('localhost', '127.0.0.1') })
  //     });
  //     const data = await resp.json();
  //     return data.link   
  // }

  const getHashedLink = async (customerId, modelId) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/query/get-hash`, {
        customerId,
        modelId
      });
      return `${process.env.REACT_APP_VIEWER_URL}/?id=${res.data.identifier}`
    } catch (error) {
      console.log(error, "error")
      alert("UniqueId Does Not Exist");
    }
  }

  const getModels = async (paramId) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/customers/getModels`, {
      uniqueId: paramId,
    });
    const links = await Promise.all(
      res.data.map(async (model) => {
        return {
          id: model._id,
          link: await getHashedLink(paramId, model._id),
          url: model.url
        }
      }
      ));
    setmodels(links);
  };


  const isParamIDExist = async (paramId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/customers/uniqueId/${paramId}`);
    } catch (error) {
      alert("UniqueId Does Not Exist");
      window.location.href = "#/";
    }
  };

  const embedLink = `
        https://bit.ly/3oTrXve
    `;

  const codeTemplate = `
        <iframe src="https://bit.ly/3oTrXve" width="100%" height="100%">
            <p>Your browser does not support iframes.</p>
        </iframe>      

    `;

  return (
    <div>
      <div className="d-sm-flex align-items-c justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Customer Snippets</h1>
      </div>
      <h5 className="h5 mb-0 text-gray-800">Example customer embed link.</h5>
      <code>
        {embedLink}
      </code>

      <br></br>
      <h5 className="h5 mb-0 text-gray-800">Example usage of embed link within iframe.</h5>
      <code>
        {codeTemplate}
      </code>

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
                <th>Model Id</th>
                <th>Short Embed Link</th>
                <th>Full Embed Link</th>
                <th>Model Name</th>

              </tr>
            </thead>

            <tbody>
              {models && models.length > 0
                ? models.map((model, index) => (
                  <tr key={index}>
                    <td>{model.id}</td>
                    <td>{model.link}</td>
                    <td>{`${process.env.REACT_APP_VIEWER_URL}/?customerId=${paramId}&modelId=${model.id}`}</td>
                    {model.url ? <td>{model.url.split("/")[model.url.split("/").length - 1].split(".")[0]}</td> : <td>-</td>}
                  </tr>
                ))
                : null}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}