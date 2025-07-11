"use client";
import React, { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setThumbnailUrl("");
      setMessage("");
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
      } else {
        setMessage(data.message || "Erreur lors de l'upload.");
      }
    } catch (err) {
      setMessage("Erreur réseau ou serveur : " + (err as Error).message);
    } finally {
      setLoading(false);
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
      {thumbnailUrl && (
        <div style={{ border: "1px solid #ccc", padding: 10, borderRadius: 8, maxWidth: 320 }}>
          <img src={thumbnailUrl} alt="Thumbnail" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      )}
    </main>
  );
}
