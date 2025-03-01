const fetchBlogs = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/posts", {
      method: "GET",
    });

    const data = await response.json();
    const blogData = data.data;
    displayFetchBlogs(blogData);
  } catch (error) {
    console.error(error.message);
  }
};

let fetchPost = [];

const displayFetchBlogs = (postData) => {
  const blogContainer = document.getElementById("blog-container");
  blogContainer.innerHTML = ""; // Clear existing posts
  fetchPost = postData.map((post) => {
    const imageUrl = post.images || "images/default.jpg";
    const postElement = document.createElement("div");
    postElement.className = "col-12 col-sm-6 col-md-6 col-lg-4 mb-4 mb-lg-0";
    postElement.innerHTML = `
        <div class="post-entry">
          <a href="blog-single?id=${
            post.documentId
          }" class="mb-3 img-wrap">
            <img src="${imageUrl}" alt="blog_image" class="img-fluid" />
          </a>
          <h3><a href="blog-single?id=${post.documentId}">${
      post.title
    }</a></h3>
          <span class="date mb-4 d-block text-muted">${new Date(
            post.publishDate
          ).toLocaleDateString()}</span>
          <p>${post.descriptionHtml.substring(0, 100)}...</p>
          <p><a href="blog-single?id=${
            post.documentId
          }" class="link-underline">Read More</a></p>

        </div>
      `;

    blogContainer.appendChild(postElement);
    return { ...post, element: postElement };
  });
};

// Filter function
const filterBlogs = (criteria) => {
  let sortedPosts;
  switch (criteria) {
    case "recent":
      sortedPosts = fetchPost.sort(
        (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
      );
      break;
    case "old":
      sortedPosts = fetchPost.sort(
        (a, b) => new Date(a.publishDate) - new Date(b.publishDate)
      );
      break;
    case "viewed":
      sortedPosts = fetchPost.sort((a, b) => b.views - a.views);
      break;
    default:
      sortedPosts = fetchPost;
  }
  displayFetchBlogs(sortedPosts);
};

// Event listener for search input
document.getElementById("search-input").addEventListener("input", (e) => {
  const inputValue = e.target.value.toLowerCase();
  let postFound = false;
  fetchPost.forEach((blog) => {
    const isVisible = blog.title.toLowerCase().includes(inputValue);
    blog.element.style.display = isVisible ? "block" : "none";
    if (isVisible) {
      postFound = true;
    }
  });
  if (inputValue === "") {
    fetchBlogs();
  } else if (!postFound) {
    document.getElementById("blog-container").innerHTML =
      "<p>Sorry, no posts found.</p>";
  }
});

// Event listener for filter select
document.getElementById("sort-filter").addEventListener("change", (e) => {
  const filterCriteria = e.target.value;
  filterBlogs(filterCriteria);
});

// Fetch blogs when the page loads
fetchBlogs();
