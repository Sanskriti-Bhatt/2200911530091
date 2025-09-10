import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

const generateCode = () => Math.random().toString(36).substring(2, 7);


//PAGE1 : URLSHortenerPage- 
function URLShortenerPage() {
  const [inputs, setInputs] = useState([{ url: "", expiry: 30}]);//1. making default as 30 min
  const [urls, setUrls] = useState(() => JSON.parse(localStorage.getItem("urls")) || []);

  useEffect(() => {
    localStorage.setItem("urls", JSON.stringify(urls));
  }, [urls]);

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  //2. allows only 5 url at once (limit set)
  //error also handled
  const addInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: "", expiry: 30 }]);
    } else {
      alert("You can only shorten5 URL");
    }
  };

  const shortenUrls = () => {
    const newEntries = [];
    for (let i = 0; i < inputs.length; i++) {
      const { url, expiry } = inputs[i];

//3. unique url if not gives error - 
      let code =  generateCode();
      if (urls.find(u => u.code === code) || newEntries.find(u => u.code === code)) {
        alert(`Row ${i + 1}: Shortcode already exists`);
        return;
      }
      newEntries.push({
        code,
        longUrl: url,
        created: Date.now(),
        expiry: Date.now() + expiry * 60000,
        clicks: []
      });
    }
    setUrls([...urls, ...newEntries]);
    setInputs([{ url: "", expiry: 30}]); // reset form
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">URL Shortener Page</h2>
      {inputs.map((inp, idx) => (
        <div key={idx} className="flex gap-2 my-2">
          <input
            className="border p-2 flex-1"
            type="text"
            placeholder="Original URL"
            value={inp.url}
            onChange={e => handleChange(idx, "url", e.target.value)}
          />
          <input
            className="border p-2 w-32"
            type="number"
            placeholder="Expiry (min)"
            value={inp.expiry}
            onChange={e => handleChange(idx, "expiry", e.target.value)}
          />

        </div>
      ))}
      <button className="bg-gray-500 text-white px-3 py-1 mr-2" onClick={addInput}>
        Add URL
      </button>
      <button className="bg-blue-500 text-white px-3 py-1" onClick={shortenUrls}>
        Shorten
      </button>

      <h3 className="mt-4 font-semibold">Shortened Links</h3>
      <ul>
        {urls.map(u => (
          <li key={u.code}>
            <a href={`/${u.code}`} target="_blank" rel="noreferrer">
              {window.location.origin}/{u.code}
            </a>{" "}
            → {u.longUrl} <br />
            Expiry: {new Date(u.expiry).toLocaleString()}
          </li>
        ))}
      </ul>
      <Link className="text-blue-600 underline" to="/stats">
        Go to Stats Page 
      </Link>
    </div>
  );
}

//PAGE 2: STATS PAGE:
function StatisticsPage() {
  const [urls, setUrls] = useState(() => JSON.parse(localStorage.getItem("urls")) || []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">URL Shortener Statistics Page</h2>
      <Link className="text-blue-600 underline" to="/">
        Back to URL Shortening page
      </Link>
      <ul>
        {urls.map(u => (
          //adding elements like  short url , long url , creation time , expiry time , total number of clicks 
          <li key={u.code} className="border p-2 my-2">
            <p>
    
              Short: {window.location.origin}/{u.code} <br />
              Long: {u.longUrl} <br />
              Created: {new Date(u.created).toLocaleString()} <br />
              Expiry: {new Date(u.expiry).toLocaleString()} <br />
              Total Clicks: {u.clicks.length}
            </p>
            <h4 className="font-semibold">Click Logs:</h4>
            <ul>
              {u.clicks.map((c, idx) => (
                <li key={idx}>
                  {c.time}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLShortenerPage />} />
        <Route path="/stats" element={<StatisticsPage />} />

      </Routes>
    </Router>
  );
}

