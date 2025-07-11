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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  // Fonction pour rafraîchir la liste des images
  const refreshImages = () => {
    fetch("http://localhost:8080/api/upload/images")
      .then((res) => res.json())
      .then((data) => setImages(data || []));
  };

  return (
    <main style={{ maxWidth: 900, margin: "2em auto", fontFamily: "Segoe UI", background: "#f7fafc", borderRadius: 16, boxShadow: "0 4px 24px #0001", padding: 32, color: "#222" }}>
      <h1 style={{ textAlign: "center", color: "#183153", letterSpacing: 1 }}>PocImage : Upload & Modération</h1>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        {/* Colonne gauche : Upload */}
        <section style={{ flex: 1, minWidth: 320, background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 8px #e0e0e0" }}>
          <h2 style={{ color: "#2d5a88" }}>Upload d'image</h2>
          <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <label htmlFor="file-upload" style={{ fontWeight: 600, color: "#222", marginRight: 8 }}>Sélectionner une image :</label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                display: "none"
              }}
              aria-label="Sélectionner une image à uploader"
            />
            <label
              htmlFor="file-upload"
              tabIndex={0}
              style={{
                display: "inline-block",
                padding: "8px 18px",
                borderRadius: 6,
                border: "none",
                background: "#205081",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 1px 4px #20508133",
                outline: "none",
                marginRight: 10,
                transition: "background 0.2s"
              }}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
              aria-label="Ouvrir le sélecteur de fichier"
            >
              Choisir un fichier
            </label>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: loading ? "#bdbdbd" : "#205081", color: "#fff", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 1px 4px #20508133", transition: "background 0.2s", outline: "none" }}
              aria-label="Envoyer l'image"
              tabIndex={0}
              onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px #90caf9'}
              onBlur={e => e.currentTarget.style.boxShadow = '0 1px 4px #20508133'}
            >
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </form>
          {message && <div style={{ marginBottom: 10, color: thumbnailUrl ? "#205081" : "#b71c1c", fontWeight: 500 }}>{message}</div>}
          {(file || thumbnailUrl) && (
            <div style={{ border: "1px solid #e0e0e0", padding: 10, borderRadius: 8, maxWidth: 320, background: "#f7fafc" }}>
              <h3 style={{ color: "#2d5a88" }}>Informations sur l'image</h3>
              {originalName && <div style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}><b>Nom :</b> {originalName}</div>}
              {originalSize !== null && <div><b>Taille d'origine :</b> {Math.round(originalSize / 1024)} Ko</div>}
              {originalUrl && <div style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}><b>URL d'origine :</b> <a href={originalUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#205081", textDecoration: "underline" }}>{originalUrl}</a></div>}
              {publicId && (
                <>
                  <b>Thumbnail :</b>
                  <div style={{ marginTop: 10 }}>
                    <CldImage
                      src={publicId}
                      width={300}
                      height={300}
                      alt="Thumbnail généré Cloudinary"
                      style={{ maxWidth: "100%", height: "auto", borderRadius: 8, border: "1px solid #e0e0e0" }}
                    />
                  </div>
                </>
              )}
              {thumbnailSize !== null && thumbnailSize > 0 && <div><b>Taille du thumbnail :</b> {Math.round(thumbnailSize / 1024)} Ko</div>}
            </div>
          )}
        </section>
        {/* Colonne droite : Modération */}
        <section style={{ flex: 1, minWidth: 320, background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 8px #e0e0e0" }}>
          <h2 style={{ color: "#205081" }}>Modération des images Cloudinary</h2>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <button
              onClick={handleDelete}
              disabled={selected.length === 0}
              style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: selected.length === 0 ? "#bdbdbd" : "#b71c1c", color: "#fff", fontWeight: 600, cursor: selected.length === 0 ? "not-allowed" : "pointer", boxShadow: "0 1px 4px #b71c1c33", transition: "background 0.2s", outline: "none" }}
              aria-label="Supprimer la sélection"
              tabIndex={0}
              onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px #90caf9'}
              onBlur={e => e.currentTarget.style.boxShadow = '0 1px 4px #b71c1c33'}
            >
              Supprimer la sélection
            </button>
            <button
              type="button"
              onClick={refreshImages}
              style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: "#205081", color: "#fff", fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 4px #20508133", transition: "background 0.2s", outline: "none" }}
              aria-label="Rafraîchir la liste des images"
              tabIndex={0}
              onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px #90caf9'}
              onBlur={e => e.currentTarget.style.boxShadow = '0 1px 4px #20508133'}
            >
              Rafraîchir la liste
            </button>
          </div>
          {modMessage && <div style={{ color: modMessage.includes("Erreur") ? "#b71c1c" : "#205081", marginBottom: 10, fontWeight: 500 }}>{modMessage}</div>}
          <div style={{ maxHeight: 400, overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: 8, padding: 10, background: "#f7fafc" }}>
            {images.length === 0 ? (
              <div>Aucune image trouvée.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Nom (public_id)</th>
                    <th>Aperçu</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((img) => (
                    <tr key={img.publicId} style={{ borderBottom: "1px solid #e0e0e0" }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(img.publicId)}
                          onChange={() => handleSelect(img.publicId)}
                          aria-label={`Sélectionner l'image ${img.publicId}`}
                        />
                      </td>
                      <td style={{ fontSize: 14, color: "#222", wordBreak: "break-all", whiteSpace: "pre-wrap" }}>{img.publicId}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setPreviewUrl(img.url)}
                          style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: "#205081", color: "#fff", fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 4px #20508133", transition: "background 0.2s", outline: "none" }}
                          aria-label={`Aperçu de l'image ${img.publicId}`}
                          tabIndex={0}
                          onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px #90caf9'}
                          onBlur={e => e.currentTarget.style.boxShadow = '0 1px 4px #20508133'}
                        >
                          Aperçu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
        {/* Modale d'aperçu */}
        {previewUrl && (
          <div
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000
            }}
            onClick={() => setPreviewUrl(null)}
          >
            <div
              style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 4px 24px #0003", maxWidth: 600, maxHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center" }}
              onClick={e => e.stopPropagation()}
            >
              <img src={previewUrl} alt="Aperçu de l'image" style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8, marginBottom: 16 }} />
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: "#205081", color: "#fff", fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 4px #20508133", transition: "background 0.2s", outline: "none" }}
                aria-label="Fermer l'aperçu"
                tabIndex={0}
                autoFocus
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
