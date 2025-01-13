import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingLogo from "../components/loading_logo";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(15);

  useEffect(() => {
    // Obtener las noticias desde el backend
    axios
      .get(`${process.env.REACT_APP_NEWS_URL}/news`) // Ajusta la URL si está desplegado
      .then((response) => {
        setNews(response.data.news || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        setLoading(false);
      });
  }, []);

  // Calcular el índice de inicio y fin de los artículos a mostrar
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);

  // Cambiar la página y hacer scroll hacia arriba
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll suave hacia la parte superior
  };

  if (loading) {
    return <LoadingLogo loading={true} logoSrc={null} />;
  }

  return (
    <div className="news-container">
      {currentArticles.length === 0 ? (
        <div style={{ height: "74vh", margin: "0px auto" }}>
          <p>No se encontraron noticias.</p>
        </div>
      ) : (
        currentArticles.map((item, index) => (
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
      {/* Paginación */}
      {news.length > articlesPerPage && (
        <div className="pagination">
          {Array.from({ length: Math.ceil(news.length / articlesPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={index + 1 === currentPage ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
