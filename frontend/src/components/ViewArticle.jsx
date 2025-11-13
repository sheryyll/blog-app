import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

/**
 * ViewArticle Component
 * Functional Component for displaying a single article
 * Demonstrates: useState, useEffect, event handling
 */
function ViewArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://blog-app-y9pg.onrender.com/articles/${id}`);
        setArticle(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. It may have been deleted.');
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(`https://blog-app-y9pg.onrender.com/articles/${id}`);
        navigate('/');
      } catch (err) {
        console.error('Error deleting article:', err);
        setError('Failed to delete article. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error || 'Article not found'}
        </div>
        <Link to="/" className="btn btn-primary">
          Back to Articles
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <Link to="/" className="btn btn-secondary mb-3">
            ← Back to Articles
          </Link>

          <div className="article-card">
            <h1 className="mb-3">{article.title}</h1>
            
            <div className="mb-3">
              <strong>Author:</strong> {article.author || 'Anonymous'} | 
              <strong className="ms-2">Published:</strong> {formatDate(article.createdAt)}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mb-3">
                {article.tags.map((tag, index) => (
                  <span key={index} className="tag-badge">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <hr />

            <div className="article-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
              {article.content}
            </div>

            <hr className="mt-4" />

            <div className="action-buttons mt-3">
              <Link to={`/edit/${article._id}`} className="btn btn-primary">
                Edit Article
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewArticle;

