<template>
  <div class="posts-wrapper" :class="{ 'dark-mode': props.isDarkMode }">
    <!-- Loading and Error States -->
    <div v-if="isLoading" class="loading-message">
      <i class="fas fa-spinner fa-spin"></i> Loading posts...
    </div>
    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-triangle"></i> {{ error }}
    </div>

    <!-- Heading and Toggle Button -->
    <div class="header-container">
      <h2 class="posts-title">Recent Posts</h2>
      <div class="toggle-container">
        <span class="view-label">View By</span>
        <button @click="toggleView" class="toggle-btn">
          <i :class="viewMode === 0 ? 'fas fa-th-large' : 'fas fa-list'"></i>
        </button>
      </div>
    </div>

    <!-- Message when no blogs are available -->
    <div v-if="!isLoading && filteredBlogs.length === 0" class="no-posts">
      <i class="far fa-newspaper"></i> No blogs available
    </div>

    <!-- Posts Container (scrollable) -->
    <div class="posts-container">
      <!-- Card View -->
      <div v-if="viewMode === 0" class="card-view">
        <div v-for="blog in filteredBlogs" :key="blog.id" class="post-card">
          <h3 class="post-title">{{ blog.title }}</h3>
          <p class="post-meta">
            <i class="fas fa-user"></i> {{ blog.author || 'Unknown' }} | 
            <i class="fas fa-tag"></i> {{ blog.category || "Uncategorized" }}
          </p>
          <button class="read-more-btn" @click="openModal(blog.id)">
            <i class="fas fa-book-open"></i> Read More
          </button>
        </div>
      </div>

      <!-- List View -->
      <div v-if="viewMode === 2" class="list-view">
        <div v-for="blog in filteredBlogs" :key="blog.id" class="post-list-item">
          <div class="list-content">
            <h3 class="post-title">{{ blog.title }}</h3>
            <p class="post-meta">
              <i class="fas fa-user"></i> {{ blog.author || 'Unknown' }} | 
              <i class="fas fa-tag"></i> {{ blog.category || "Uncategorized" }}
            </p>
          </div>
          <button class="read-more-btn" @click="openModal(blog.id)">
            <i class="fas fa-book-open"></i> Read More
          </button>
        </div>
      </div>
    </div>

    <!-- Search Box -->
    <div class="search-container">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search posts by title, author, or content..." 
          class="search-input"
          @keyup.enter="searchPosts"
        />
        <button @click="searchPosts" class="search-button">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>

    <!-- Modal for Expanded Post -->
    <div 
      :class="['modal-overlay', { active: expandedPost !== null }]" 
      @click.self="closeModal"
    >
      <div class="modal-content" v-if="currentPost">
        <button class="close-btn" @click="closeModal">&times;</button>
        <div class="modal-header">
          <h2 class="modal-title">{{ currentPost.title }}</h2>
          <p class="modal-meta">
            <i class="fas fa-user"></i> <strong>{{ currentPost.author || 'Unknown' }}</strong> | 
            <i class="fas fa-tag"></i> <strong>{{ currentPost.category || "Uncategorized" }}</strong>
          </p>
        </div>
        <div class="modal-body">
          <p>{{ currentPost.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { ref, onMounted, computed } from "vue";
import api from "@/api.js";
import '@fortawesome/fontawesome-free/css/all.min.css';

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
});

// State management
const blogs = ref([]);
const expandedPost = ref(null);
const viewMode = ref(0); // 0 = card view, 2 = list view
const searchQuery = ref('');
const isLoading = ref(false);
const error = ref(null);

// Computed properties
const filteredBlogs = computed(() => {
  if (!searchQuery.value) {
    return blogs.value;
  }
  const query = searchQuery.value.toLowerCase();
  return blogs.value.filter(blog => 
    (blog.title && blog.title.toLowerCase().includes(query)) ||
    (blog.author && blog.author.toLowerCase().includes(query)) ||
    (blog.content && blog.content.toLowerCase().includes(query))
  );
});

const currentPost = computed(() => {
  return expandedPost.value !== null ? 
    blogs.value.find(blog => blog.id === expandedPost.value) : 
    null;
});

// Fetch blogs from the posts API endpoint only
const fetchBlogs = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.get("http://127.0.0.1:8000/api/posts/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    blogs.value = response.data.map(post => ({
      id: post.id,
      title: post.title || 'Untitled Post',
      author: post.author || post.user?.username || 'Unknown',
      category: post.category || post.tags?.[0] || 'Uncategorized',
      content: post.content || post.body || '',
      ...post
    }));
    console.log('Posts fetched:', response.data.length);

    if (blogs.value.length === 0) {
      error.value = "No posts found";
    }
  } catch (err) {
    console.error("Error fetching blogs:", err);
    error.value = err.response?.data?.detail || 
                 err.message || 
                 "Failed to load posts. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};

// View methods
const openModal = (blogId) => {
  expandedPost.value = blogId;
  document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
};

const closeModal = () => {
  expandedPost.value = null;
  document.body.style.overflow = ''; // Re-enable scrolling
};

const searchPosts = () => {
  // Computed property handles the filtering
};

const toggleView = () => {
  viewMode.value = viewMode.value === 0 ? 2 : 0;
};

// Lifecycle hook
onMounted(() => {
  fetchBlogs();
});
</script>

<style scoped>
/* Base Styles */
.posts-wrapper {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  height: 80vh;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.posts-wrapper.dark-mode {
  background: #1e1e1e;
  color: #e0e0e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Loading and Error Messages */
.loading-message, .error-message {
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-message {
  background: #fff3cd;
  color: #856404;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
}

.dark-mode .loading-message {
  background: #332701;
  color: #ffd700;
}

.dark-mode .error-message {
  background: #3c0a0d;
  color: #ff6b6b;
}

/* Header */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.posts-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: inherit;
  margin: 0;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.view-label {
  font-size: 0.9rem;
  color: #666;
}

.dark-mode .view-label {
  color: #aaa;
}

.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: rgba(255, 102, 0, 0.1);
  transform: scale(1.1);
}

.toggle-btn i {
  font-size: 1.2rem;
  color: #ff6600;
}

.dark-mode .toggle-btn i {
  color: #ff8c00;
}

/* Posts Container */
.posts-container {
  overflow-y: auto;
  flex-grow: 1;
  margin-bottom: 15px;
  padding-right: 5px;
}

/* Scrollbar */
.posts-container::-webkit-scrollbar {
  width: 8px;
}

.posts-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dark-mode .posts-container::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.posts-container::-webkit-scrollbar-thumb {
  background: #ff6600;
  border-radius: 4px;
}

.dark-mode .posts-container::-webkit-scrollbar-thumb {
  background: #ff8c00;
}

.posts-container::-webkit-scrollbar-thumb:hover {
  background: #e55a00;
}

.dark-mode .posts-container::-webkit-scrollbar-thumb:hover {
  background: #ff7700;
}

/* Card View */
.card-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 5px;
}

.post-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}

.dark-mode .post-card {
  background: #2d2d2d;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.dark-mode .post-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

/* List View */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 5px;
}

.post-list-item {
  background: white;
  border-radius: 8px;
  padding: 15px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100px;
}

.dark-mode .post-list-item {
  background: #2d2d2d;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.post-list-item:hover {
  transform: translateX(3px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.dark-mode .post-list-item:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
}

/* Title Styling - Fixed Overflow */
.post-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: block;
  max-width: 100%;
}

.dark-mode .post-title {
  color: #f0f0f0;
}

/* Hide Author and Category */
.post-meta {
  display: none;
}

/* Read More Button */
.read-more-btn {
  background: #ff6600;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  margin-top: auto;
  align-self: flex-start;
  width: fit-content;
}

.read-more-btn:hover {
  background: #e55a00;
  transform: scale(1.03);
}

.read-more-btn i {
  font-size: 0.8rem;
}

/* Search Container */
.search-container {
  display: flex;
  justify-content: center;
  padding: 15px 0;
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 30px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.dark-mode .search-box {
  background: #2d2d2d;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.search-box:focus-within {
  box-shadow: 0 5px 15px rgba(255, 102, 0, 0.2);
  transform: scale(1.01);
}

.dark-mode .search-box:focus-within {
  box-shadow: 0 5px 15px rgba(255, 140, 0, 0.3);
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
}

.dark-mode .search-input {
  color: #e0e0e0;
}

.search-input::placeholder {
  color: #aaa;
}

.dark-mode .search-input::placeholder {
  color: #888;
}

.search-button {
  background: #ff6600;
  color: white;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  background: #e55a00;
}

.search-button i {
  font-size: 1rem;
}

/* No Posts Message */
.no-posts {
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.no-posts i {
  font-size: 2rem;
  opacity: 0.5;
}

.dark-mode .no-posts {
  color: #aaa;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.modal-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.modal-content {
  position: relative;
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 60%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.95);
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
}

.dark-mode .modal-content {
  background-color: #2d2d2d;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.4);
}

.modal-overlay.active .modal-content {
  transform: scale(1);
  opacity: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #ff6600;
  font-weight: bold;
  position: absolute;
  top: 15px;
  right: 20px;
  padding: 0;
  margin: 0;
  line-height: 1;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #e55a00;
  transform: scale(1.1);
}

.modal-header {
  margin-top: 20px;
  margin-bottom: 20px;
  padding-right: 30px;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.dark-mode .modal-title {
  color: #f0f0f0;
}

.modal-meta {
  font-size: 1rem;
  color: #777;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.dark-mode .modal-meta {
  color: #bbb;
}

.modal-meta i {
  font-size: 0.9rem;
  opacity: 0.8;
}

.modal-body {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.7;
  white-space: pre-line;
}

.dark-mode .modal-body {
  color: #ddd;
}

/* Responsive Design */
@media (max-width: 992px) {
  .modal-content {
    width: 75%;
  }
}

@media (max-width: 768px) {
  .modal-content {
    width: 90%;
    padding: 20px;
  }
  
  .card-view {
    grid-template-columns: 1fr;
  }

  .header-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .post-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 576px) {
  .posts-wrapper {
    padding: 15px;
    height: 85vh;
  }

  .post-list-item {
    padding: 12px 15px;
    min-height: auto;
  }

  .read-more-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .modal-header {
    margin-top: 10px;
  }
}
</style>



