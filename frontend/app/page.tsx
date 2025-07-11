"use client";
import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [thumbnailSize, setThumbnailSize] = useState<number | null>(null);
  const [originalName, setOriginalName] = useState<string>("");
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [publicId, setPublicId] = useState<string>("");

  // Modération : liste des images Cloudinary
  const [images, setImages] = useState<{ publicId: string; url: string }[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [modMessage, setModMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOriginalName(e.target.files[0].name);
      setOriginalSize(e.target.files[0].size);
      setOriginalUrl("");
      setThumbnailUrl("");
      setMessage("");
      setThumbnailSize(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Veuillez sélectionner une image.");
      return;
    }
    setLoading(true);
    setMessage("");
    setThumbnailUrl("");
    setOriginalUrl("");
    setThumbnailSize(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.thumbnailUrl) {
        setThumbnailUrl(data.thumbnailUrl);
        setMessage(data.message || "Upload réussi !");
        setOriginalUrl(data.originalUrl || "");
        setOriginalSize(data.originalSize || file.size);
        setThumbnailSize(data.thumbnailSize !== undefined ? data.thumbnailSize : null);
        setPublicId(data.publicId || "");
      } else {
        setMessage(data.message || "Erreur lors de l'upload.");
      }
    } catch (err) {
      setMessage("Erreur réseau ou serveur : " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Charger la liste des images au montage
  useEffect(() => {
    fetch("http://localhost:8080/api/upload/images")
      .then((res) => res.json())
      .then((data) => setImages(data || []));
  }, []);

  const handleSelect = (publicId: string) => {
    setSelected((prev) =>
      prev.includes(publicId)
        ? prev.filter((id) => id !== publicId)
        : [...prev, publicId]
    );
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;
    setModMessage("");
    const res = await fetch("http://localhost:8080/api/upload/images/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicIds: selected }),
    });
    if (res.ok) {
      setImages((imgs) => imgs.filter((img) => !selected.includes(img.publicId)));
      setSelected([]);
      setModMessage("Suppression réussie.");
    } else {
      setModMessage("Erreur lors de la suppression.");
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: "2em auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Upload d'image (POC Next.js & Spring Boot)</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading} style={{ marginLeft: 10 }}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>
      {message && <div style={{ marginBottom: 10, color: thumbnailUrl ? "green" : "red" }}>{message}</div>}
      {(file || thumbnailUrl) && (
        <div style={{ border: "1px solid #ccc", padding: 10, borderRadius: 8, maxWidth: 320 }}>
          <h3>Informations sur l'image</h3>
          {originalName && <div><b>Nom :</b> {originalName}</div>}
          {originalSize !== null && <div><b>Taille d'origine :</b> {Math.round(originalSize / 1024)} Ko</div>}
          {originalUrl && <div><b>URL d'origine :</b> <a href={originalUrl} target="_blank" rel="noopener noreferrer">{originalUrl}</a></div>}
          {publicId && (
            <>
              <b>Thumbnail :</b>
              <div style={{ marginTop: 10 }}>
                <CldImage
                  src={publicId}
                  width={300}
                  height={300}
                  alt="Thumbnail"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            </>
          )}
          {thumbnailSize !== null && thumbnailSize > 0 && <div><b>Taille du thumbnail :</b> {Math.round(thumbnailSize / 1024)} Ko</div>}
        </div>
      )}
      <hr style={{ margin: "2em 0" }} />
      <section>
        <h2>Modération des images Cloudinary</h2>
        {modMessage && <div style={{ color: modMessage.includes("Erreur") ? "red" : "green" }}>{modMessage}</div>}
        <button onClick={handleDelete} disabled={selected.length === 0} style={{ marginBottom: 10 }}>
          Supprimer la sélection
        </button>
        <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ccc", borderRadius: 8, padding: 10 }}>
          {images.length === 0 ? (
            <div>Aucune image trouvée.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th></th>
                  <th>Nom (public_id)</th>
                </tr>
              </thead>
              <tbody>
                {images.map((img) => (
                  <tr key={img.publicId} style={{ borderBottom: "1px solid #eee" }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(img.publicId)}
                        onChange={() => handleSelect(img.publicId)}
                      />
                    </td>
                    <td style={{ fontSize: 12 }}>{img.publicId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
