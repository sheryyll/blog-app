import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/*
  This is a small, reusable Functional Component.
  It just displays a single row in the article table.
  Demonstrates: Functional components, props, event handling
*/
const Article = props => (
  <tr>
    <td>
      <Link 
        to={`/view/${props.article._id}`} 
        style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}
      >
        {props.article.title}
      </Link>
    </td>
    <td>{props.article.author || 'Anonymous'}</td>
    <td>{props.article.createdAt ? props.article.createdAt.substring(0,10) : 'N/A'}</td>
    <td>
      {props.article.tags && props.article.tags.length > 0 && (
        <div className="mb-2">
          {props.article.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag-badge">{tag}</span>
          ))}
          {props.article.tags.length > 3 && (
            <span className="tag-badge">+{props.article.tags.length - 3}</span>
          )}
        </div>
      )}
    </td>
    <td>
      <div className="action-buttons">
        <Link to={`/view/${props.article._id}`} className="btn btn-sm btn-accent me-2">
          View
        </Link>
        <Link to={`/edit/${props.article._id}`} className="btn btn-sm btn-primary me-2">
          Edit
        </Link>
        <button 
          onClick={() => { props.deleteArticle(props.article._id) }} 
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
)

/*
  This is the main Class Component.
  Demonstrates: Class components, state management, lifecycle methods, event handling
*/
export default class ArticleList extends Component {
  constructor(props) {
    super(props);

    // Bind the 'this' context for event handlers
    this.deleteArticle = this.deleteArticle.bind(this);
    this.handleTagFilter = this.handleTagFilter.bind(this);
    this.handleDateFilter = this.handleDateFilter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);

    // Initialize state with articles array and filters
    this.state = { 
      articles: [],
      filteredArticles: [],
      tagFilter: '',
      dateFilter: '',
      allTags: []
    };
  }

  // Lifecycle method - runs automatically when component is mounted
  componentDidMount() {
    this.fetchArticles();
  }

  // Method to fetch articles from the backend API
  fetchArticles = () => {
    // Send a GET request to our backend API (without filters)
    axios.get('https://blog-app-y9pg.onrender.com/articles')
      .then(response => {
        const articles = response.data;
        // Extract all unique tags from all articles
        const allTags = [...new Set(articles.flatMap(article => article.tags || []))];
        
        // Update the component's state
        this.setState({ 
          articles: articles,
          filteredArticles: articles,
          allTags: allTags.sort()
        });
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
        this.setState({ articles: [], filteredArticles: [] });
      });
  }

  // Event handler for tag filter change
  handleTagFilter(event) {
    const tagFilter = event.target.value;
    this.setState({ tagFilter }, () => {
      // Refetch with updated filter state
      this.fetchArticlesWithFilters();
    });
  }

  // Event handler for date filter change
  handleDateFilter(event) {
    const dateFilter = event.target.value;
    this.setState({ dateFilter }, () => {
      // Refetch with updated filter state
      this.fetchArticlesWithFilters();
    });
  }

  // Method to fetch articles with current filter state
  fetchArticlesWithFilters = () => {
    const params = {};
    if (this.state.tagFilter) {
      params.tag = this.state.tagFilter;
    }
    if (this.state.dateFilter) {
      params.date = this.state.dateFilter;
    }

    axios.get('https://blog-app-y9pg.onrender.com/articles', { params })
      .then(response => {
        const articles = response.data;
        // Get all unique tags from ALL articles (fetch once without filters for tags dropdown)
        this.fetchAllTags().then(allTags => {
          this.setState({ 
            articles: articles,
            filteredArticles: articles,
            allTags: allTags
          });
        });
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
        this.setState({ articles: [], filteredArticles: [] });
      });
  };

  // Helper method to fetch all tags from all articles
  fetchAllTags = () => {
    return axios.get('https://blog-app-y9pg.onrender.com/articles')
      .then(response => {
        const allTags = [...new Set(response.data.flatMap(article => article.tags || []))];
        return allTags.sort();
      })
      .catch(() => []);
  };

  // Event handler to clear all filters
  clearFilters() {
    this.setState({ tagFilter: '', dateFilter: '' }, () => {
      this.fetchArticles(); // Refetch without filters
    });
  }

  // Event handler for the delete button
  deleteArticle(id) {
    // Send a DELETE request to the backend
    axios.delete('https://blog-app-y9pg.onrender.com/articles' + id)
      .then(res => {
        console.log(res.data);
        // Refresh articles after deletion
        this.fetchArticles();
      })
      .catch((error) => {
        console.error('Error deleting article:', error);
        alert('Failed to delete article. Please try again.');
      });
  }

  // Helper method to map over the articles and render a row for each one
  articleList() {
    const articlesToDisplay = this.state.tagFilter || this.state.dateFilter 
      ? this.state.filteredArticles 
      : this.state.articles;

    if (articlesToDisplay.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center empty-state">
            <p>No articles found. {this.state.tagFilter || this.state.dateFilter ? 'Try clearing your filters.' : 'Create your first article!'}</p>
          </td>
        </tr>
      );
    }

    return articlesToDisplay.map(currentarticle => {
      return <Article 
                article={currentarticle} 
                deleteArticle={this.deleteArticle} 
                key={currentarticle._id}
              />;
    });
  }

  // The main render method that displays the component
  render() {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Blog Articles</h2>
          <Link to="/create" className="btn btn-primary">
            + Create New Article
          </Link>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <h5 className="mb-3">Filter Articles</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="tagFilter" className="form-label">Filter by Tag</label>
              <select 
                className="form-select" 
                id="tagFilter"
                value={this.state.tagFilter}
                onChange={this.handleTagFilter}
              >
                <option value="">All Tags</option>
                {this.state.allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="dateFilter" className="form-label">Filter by Date</label>
              <input
                type="date"
                className="form-control"
                id="dateFilter"
                value={this.state.dateFilter}
                onChange={this.handleDateFilter}
              />
            </div>
            <div className="col-md-4 mb-3 d-flex align-items-end">
              {(this.state.tagFilter || this.state.dateFilter) && (
                <button 
                  className="btn btn-secondary w-100"
                  onClick={this.clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          {(this.state.tagFilter || this.state.dateFilter) && (
            <div className="alert alert-info mt-2" style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--secondary)', color: 'var(--text)' }}>
              Showing {this.state.filteredArticles.length} article(s)
            </div>
          )}
        </div>

        {/* Articles Table */}
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.articleList()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

