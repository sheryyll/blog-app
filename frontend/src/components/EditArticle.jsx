import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

/**
 * EditArticle Component
 * Functional Component using React Hooks (useState, useEffect)
 * Demonstrates: state management, side effects, event handling, URL parameters
 */
function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management using useState hooks
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect hook to fetch article data when component mounts
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://blog-app-y9pg.onrender.com/articles/${id}`);
        const article = response.data;
        
        // Update state with fetched article data
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

    if (id) {
      fetchArticle();
    }
  }, [id]);

  // Event handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate form
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      setIsSubmitting(false);
      return;
    }

    // Prepare tags array from comma-separated string
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
      await axios.post(`https://blog-app-y9pg.onrender.com/articles/update/${id}`, article);
      // Navigate back to article list after successful update
      navigate('/');
    } catch (err) {
      console.error('Error updating article:', err);
      setError('Failed to update article. Please try again.');
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

  if (error && !title) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
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

