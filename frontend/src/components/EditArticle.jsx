import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

 
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://blog-app-y9pg.onrender.com/api/articles/${id}`);
        const article = response.data;
        
        // Check if current user is the owner
        const isOwner = article.createdBy && 
          (article.createdBy._id === user?.id || article.createdBy === user?.id);
        
        if (!isOwner) {
          setUnauthorized(true);
          setError('You can only edit your own articles.');
          setLoading(false);
          return;
        }
        
        setTitle(article.title || '');
        setContent(article.content || '');
        setAuthor(article.author || '');
        setTags(article.tags ? article.tags.join(', ') : '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. It may have been deleted.');
        setLoading(false);
      }
    };

    if (id && user) {
      fetchArticle();
    }
  }, [id, user]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      setIsSubmitting(false);
      return;
    }

    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const article = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim() || 'Anonymous',
      tags: tagsArray
    };

    try {
      // Update article via REST API
      await axios.post(`https://blog-app-y9pg.onrender.com/api/articles/update/${id}`, article);
      // Navigate back to article list after successful update
      navigate('/');
    } catch (err) {
      console.error('Error updating article:', err);
      if (err.response?.status === 403) {
        setError('You can only edit your own articles.');
      } else {
        setError('Failed to update article. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  // Event handler for cancel button
  const handleCancel = () => {
    navigate('/');
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

  if (unauthorized || (error && !title && !loading)) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error || 'You are not authorized to edit this article.'}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2 className="mb-4">Edit Article</h2>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="author" className="form-label">
                Author
              </label>
              <input
                type="text"
                className="form-control"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                Content <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="content"
                rows="10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tags" className="form-label">
                Tags
              </label>
              <input
                type="text"
                className="form-control"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
              <div className="form-text">
                Separate multiple tags with commas
              </div>
            </div>

            <div className="action-buttons">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Article'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditArticle;

