import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getImages() {
      const result = await axios.get("/api/images");
      setImages(result.data);
    }
    getImages();
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);

    setLoading(true);
    await axios.post("/api/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setLoading(false);

    const result = await axios.get("/api/images");
    setImages(result.data);
  };

  console.log(images);

  return (
    <div className="App">
      <h1>Upload Your Images</h1>
      <form onSubmit={submit}>
        <input
          filename={file}
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          accept="image/"
        ></input>
        <input
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Description!"
        ></input>
        <button type="submit">Submit</button>
      </form>

      <div>{loading ? <h1>Please Wait While We Load Your Images!</h1> : ""}</div>

      <div className="img-list">
        {images ? (
          images.map((x) => (
            <div key={x.id} className="img-item">
              <img src={`/api/${x.file_name}`} alt={`${x.description}`} />
            </div>
          ))
        ) : (
          <>Please Wait While We Load Your Images!</>
        )}
      </div>
    </div>
  );
}

export default App;
