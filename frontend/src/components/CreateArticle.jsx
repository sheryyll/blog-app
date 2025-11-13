import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * CreateArticle Component
 * Functional Component using React Hooks for state management
 * Demonstrates: useState, event handling, form submission
 */
function CreateArticle() {
  // State management using useState hook
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

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
      // Create article via REST API
      await axios.post('https://blog-app-y9pg.onrender.com/articles', article);
      // Navigate back to article list after successful creation
      navigate('/');
    } catch (err) {
      console.error('Error creating article:', err);
      setError('Failed to create article. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Event handler for cancel button
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2 className="mb-4">Create New Article</h2>
          
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
                placeholder="Enter author name (optional)"
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
                placeholder="Enter tags separated by commas (e.g., tech, programming, web)"
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
                {isSubmitting ? 'Creating...' : 'Create Article'}
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

export default CreateArticle;

