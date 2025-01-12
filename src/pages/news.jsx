import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingLogo from "../components/loading_logo";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener las noticias desde el backend
    axios
      .get("http://localhost:8000/news") // Ajusta la URL si está desplegado
      .then((response) => {
        setNews(response.data.news || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingLogo loading={true} logoSrc={null}/>;
  }

  return (
    <div className="news-container">
      {news.length === 0 ? (
        <>
        <div style={{height:'74vh'}}>
            <p>No se encontraron noticias.</p>
        </div>
        </>
      ) : (
        news.map((item, index) => (
          <div key={index} className="news-card">
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="news-image"
              />
            )}
            <div className="news-content">
              <h3 className="news-title">{item.title}</h3>
              <p className="news-description">{item.description}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-link"
              >
                Leer más
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default News;
