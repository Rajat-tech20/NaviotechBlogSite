// Blog Application with localStorage persistence

// Get DOM elements
const postForm = document.getElementById('postForm');
const postTitle = document.getElementById('postTitle');
const postContent = document.getElementById('postContent');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const postsContainer = document.getElementById('postsContainer');
const emptyState = document.getElementById('emptyState');

// State management
let posts = [];
let editingPostId = null;

// Initialize: Load posts from localStorage
function init() {
    loadPosts();
    renderPosts();
}

// Load posts from localStorage
function loadPosts() {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    }
}

// Save posts to localStorage
function savePosts() {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

// Generate unique ID for posts
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date for display
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Render all posts
function renderPosts() {
    if (posts.length === 0) {
        emptyState.style.display = 'block';
        postsContainer.innerHTML = '';
        return;
    }

    emptyState.style.display = 'none';
    postsContainer.innerHTML = '';

    // Sort posts by date (newest first)
    const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);

    sortedPosts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.setAttribute('data-id', post.id);

    const postHeader = document.createElement('div');
    postHeader.className = 'post-header';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'post-title';
    titleDiv.textContent = post.title;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'post-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editPost(post.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deletePost(post.id);

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    postHeader.appendChild(titleDiv);
    postHeader.appendChild(actionsDiv);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'post-content';
    contentDiv.textContent = post.content;

    const dateDiv = document.createElement('div');
    dateDiv.className = 'post-date';
    dateDiv.textContent = `Published: ${formatDate(post.timestamp)}`;

    postDiv.appendChild(postHeader);
    postDiv.appendChild(contentDiv);
    postDiv.appendChild(dateDiv);

    return postDiv;
}

// Handle form submission
postForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = postTitle.value.trim();
    const content = postContent.value.trim();

    if (!title || !content) {
        alert('Please fill in both title and content!');
        return;
    }

    if (editingPostId) {
        // Update existing post
        const postIndex = posts.findIndex(p => p.id === editingPostId);
        if (postIndex !== -1) {
            posts[postIndex].title = title;
            posts[postIndex].content = content;
            posts[postIndex].timestamp = Date.now(); // Update timestamp
            savePosts();
            renderPosts();
            resetForm();
        }
    } else {
        // Create new post
        const newPost = {
            id: generateId(),
            title: title,
            content: content,
            timestamp: Date.now()
        };
        posts.push(newPost);
        savePosts();
        renderPosts();
        resetForm();
    }
});

// Reset form
function resetForm() {
    postTitle.value = '';
    postContent.value = '';
    editingPostId = null;
    submitBtn.textContent = 'Publish Post';
    cancelBtn.style.display = 'none';
}

// Edit post
function editPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        postTitle.value = post.title;
        postContent.value = post.content;
        editingPostId = postId;
        submitBtn.textContent = 'Update Post';
        cancelBtn.style.display = 'inline-block';
        
        // Scroll to form
        document.querySelector('.post-form').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete post
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        posts = posts.filter(p => p.id !== postId);
        savePosts();
        renderPosts();
        
        // If we were editing this post, reset the form
        if (editingPostId === postId) {
            resetForm();
        }
    }
}

// Cancel editing
cancelBtn.addEventListener('click', () => {
    resetForm();
});

// Initialize the app when page loads
init();
