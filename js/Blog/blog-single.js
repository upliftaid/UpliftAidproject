const fetchPost = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  try {
    await fetch(`http://localhost:3000/posts/${postId}/view`, {
      method: "POST",
    });

    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "GET",
    });
    const data = await response.json();
    const post = data.data;
    displayPost(post);

    // Fetch top 5 most viewed posts for the sidebar
    fetchMostViewedPosts();
  } catch (error) {
    console.error(error);
  }
};

const displayPost = (post) => {
  const blockContainer = document.getElementById("blockContainer");
  const postContainer = document.getElementById("blog");
  const imageUrl = post.images || "images/default.jpg"; // Use a default image URL if undefined

  postContainer.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-md-8">
        <h2 class="mb-3 mt-5">${post.title}</h2>
        <p class="mb-4">
        <img src="${imageUrl}" alt="${post.title}" class="img-fluid" />
        </p>
       <span class="date mb-4 d-block text-muted">${new Date(
         post.date
       ).toLocaleDateString()}</span>
          <p>${post.descriptionHtml}</p>
          <div class="author-info mt-5">
            <h4>About the Author</h4>
            <h5><strong>${post.author.name}</strong></h5>
            <p><i>"${post.author.about}"</i></p>
          </div>
        </div>
        <div class="col-md-4 sidebar side-block">
          <h3>Trending Posts</h3>
          <div class="sidebar-box" id="most-viewed-posts"></div>
        </div>
      </div>
    </div>
  `;

  blockContainer.innerHTML = `
     <div
        class="block-30 block-30-sm item"
        style="background-image: url(${imageUrl})"
        data-stellar-background-ratio="0.5"
      >
        <div class="container">
          <div
            class="row align-items-center justify-content-center text-center"
          >
            <div class="col-md-12">
              <span class="text-white text-uppercase">${post.date}</span>
              <h2 class="heading mb-5">
                ${post.title}
              </h2>
            </div>
          </div>
        </div>
      </div>
    `;
};

const fetchMostViewedPosts = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/posts?sort=-views&limit=5`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const data = await response.json();
      displayMostViewedPosts(data.data);
    } else {
      throw new Error(
        `Failed to fetch most viewed posts: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(error.message);
  }
};

const displayMostViewedPosts = (posts) => {
  const mostViewedContainer = document.getElementById("most-viewed-posts");
  mostViewedContainer.innerHTML = "";

  // Sort posts by views in descending order
  posts.sort((a, b) => b.views - a.views);

  posts.forEach((post) => {
    const imageUrl = post.images || "images/default.jpg";
    const postElement = document.createElement("div");
    postElement.className = "most-viewed-post";
    postElement.innerHTML = `
      <div class="post-entry ">
        <a href="blog-single.html?id=${post.documentId}" class="mb-3 img-wrap">
          <img src="${imageUrl}" alt="blog_image" class="img-fluid" />
        </a>
        <h4 class='mb-5'><a href="blog-single.html?id=${post.documentId}">${post.title}</a></h4>
      </div>
    `;

    mostViewedContainer.appendChild(postElement);
  });
};

fetchPost();
