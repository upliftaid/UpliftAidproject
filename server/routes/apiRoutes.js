import express from "express";
import axios from "axios";
import { marked } from "marked";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import NodeCache from "node-cache";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
// Create a new cache instance with a default TTL (time-to-live) of 60 seconds
const cache = new NodeCache({ stdTTL: 60 });

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedData = cache.get(key);
  if (cachedData) {
    return res.json(cachedData);
  }
  res.sendResponse = res.json;
  res.json = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };
  next();
};

router.get("/posts", cacheMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.STRAPI_API_URL}/api/blogs?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    const modifiedData = response.data.data.map((post) => {
      // Access the first image in the images array
      const imageUrl =
        post.images?.length > 0 ? post.images[0].formats?.medium?.url : null;

      return {
        id: post.id,
        documentId: post.documentId,
        title: post.title,
        content: post.content,
        publishDate: post.date,
        images: imageUrl ? `${process.env.STRAPI_API_URL}${imageUrl}` : null,
        descriptionHtml: marked(post.description || ""),
        views: post.views,
      };
    });
    res.json({ data: modifiedData });
  } catch (error) {
    console.error(
      "Error fetching posts: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/posts/:id", cacheMiddleware, async (req, res) => {
  const postId = req.params.id;
  try {
    const response = await axios.get(
      `${process.env.STRAPI_API_URL}/api/blogs/${postId}?populate=*`,
      { headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } }
    );
    const post = response.data.data;

    // Access the first image in the images array
    const imageUrl =
      post.images?.length > 0 ? post.images[0].formats?.medium?.url : null;
    post.images = imageUrl ? `${process.env.STRAPI_API_URL}${imageUrl}` : null;
    post.descriptionHtml = marked(post.description || "");

    res.json({ data: post });
  } catch (error) {
    console.error(
      "Error fetching post: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/images", cacheMiddleware, async (req, res) => {
  const imagePath = req.query.path;
  try {
    const response = await axios.get(
      `${process.env.STRAPI_API_URL}${imagePath}`,
      {
        responseType: "stream",
        headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
      }
    );
    response.data.pipe(res);
  } catch (error) {
    console.error(
      "Error fetching image: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/posts/:id/view", async (req, res) => {
  const postId = req.params.id;
  try {
    const response = await axios.get(
      `${process.env.STRAPI_API_URL}/api/blogs/${postId}`,
      { headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } }
    );
    const post = response.data.data;
    const currentViews = post.views || 0;
    const updatedViews = currentViews + 1;
    await axios.put(
      `${process.env.STRAPI_API_URL}/api/blogs/${postId}`,
      { data: { views: updatedViews } },
      { headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } }
    );
    cache.del("/posts"); // Clear cache for list of posts
    cache.del(`/posts/${postId}`); // Clear cache for the specific post
    res.json({ views: updatedViews });
  } catch (error) {
    console.error(
      "Error updating views: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/story", cacheMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.STRAPI_API_URL}/api/success-stories?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    const modifiedData = response.data.data.map((story) => {
      // Access the first image in the images array
      const imageUrl =
        story.images?.length > 0 ? story.images[0].formats?.medium?.url : null;
      return {
        id: story.id,
        documentId: story.documentId,
        title: story.title,
        content: story.content,
        publishDate: story.date,
        images: imageUrl ? `${process.env.STRAPI_API_URL}${imageUrl}` : null,
        descriptionHtml: marked(story.description || ""),
        views: story.views,
      };
    });
    res.json({ data: modifiedData });
  } catch (error) {
    console.error(
      "Error fetching posts: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/story/:id", cacheMiddleware, async (req, res) => {
  const storyId = req.params.id;

  try {
    const response = await axios.get(
      `${process.env.STRAPI_API_URL}/api/success-stories/${storyId}?populate=*`,
      { headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } }
    );
    const post = response.data.data;

    // Access the first image in the images array
    const imageUrl =
      post.images?.length > 0 ? post.images[0].formats?.medium?.url : null;
    post.images = imageUrl ? `${process.env.STRAPI_API_URL}${imageUrl}` : null;
    post.descriptionHtml = marked(post.description || "");

    res.json({ data: post });
  } catch (error) {
    console.error(
      "Error fetching post: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/story/:id/view", cacheMiddleware, async (req, res) => {
  const storyId = req.params.id;
  try {
    const response = await axios.get(
      `${process.env.STRAPI_API_URL}/api/success-stories/${storyId}`,
      { headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } }
    );
    const post = response.data.data;
    const currentViews = post.views || 0;
    const updatedViews = currentViews + 1;
    await axios.put(
      `${process.env.STRAPI_API_URL}/api/success-stories/${storyId}`,
      { data: { views: updatedViews } },
      { headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } }
    );
    cache.del("/story"); // Clear cache for list of success stories
    cache.del(`/story/${storyId}`); // Clear cache for the specific story
    res.json({ views: updatedViews });
  } catch (error) {
    console.error(
      "Error updating views: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/fundraisers", cacheMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.STRAPI_API_URL}/api/fundraisers?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    const modifiedData = response.data.data.map((fundraiser) => {
      // Access the first image in the images array
      const imageUrl =
        fundraiser.images?.length > 0
          ? fundraiser.images[0].formats?.medium?.url
          : null;
      return {
        documentId: fundraiser.documentId,
        title: fundraiser.title,
        goalAmount: fundraiser.goalAmount,
        raisedAmount: fundraiser.raisedAmount,
        startDate: fundraiser.startDate,
        endDate: fundraiser.endDate,
        category: fundraiser.category,
        status: fundraiser.activeOrNot,
        images: imageUrl ? `${process.env.STRAPI_API_URL}${imageUrl}` : null,
        descriptionHtml: marked(fundraiser.description || ""),
      };
    });
    res.json({ data: modifiedData });
  } catch (error) {
    console.error(
      "Error fetching posts: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/fundraisers/:id", async (req, res) => {
  const fundraiserId = req.params.id;

  try {
    const response = await axios.get(
      `${process.env.STRAPI_API_URL}/api/fundraisers/${fundraiserId}?populate=*`,
      { headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } }
    );
    const post = response.data.data;

    // Access the first image in the images array
    const imageUrl =
      post.images?.length > 0 ? post.images[0].formats?.medium?.url : null;
    post.images = imageUrl ? `${process.env.STRAPI_API_URL}${imageUrl}` : null;
    post.descriptionHtml = marked(post.description || "");

    res.json({ data: post });
  } catch (error) {
    console.error(
      "Error fetching post: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/volunteer", async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.STRAPI_API_URL}/api/volunteers`,
      {
        data: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          message: req.body.message,
          availability: req.body.availability,
          preferredActivities: req.body.preferredActivities,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ data: response.data });
  } catch (error) {
    console.error(
      "Error submitting volunteer application: ",
      error.response ? error.response.data : error.message
    );
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.details
    ) {
      console.error("Validation details: ", error.response.data.error.details);
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/career", cacheMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.STRAPI_API_URL}/api/careers?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    const modifiedData = response.data.data.map((career) => {
      // Access the first image in the images array
      const imageUrl =
        career.images?.length > 0
          ? career.images[0].formats?.medium?.url
          : null;
      return {
        documentId: career.documentId,
        title: career.title,
        location: career.location,
        experience: career.experience,
        skills: career.skills,
        images: imageUrl ? `${process.env.STRAPI_API_URL}${imageUrl}` : null,
        descriptionHtml: marked(career.description || ""),
      };
    });
    res.json({ data: modifiedData });
  } catch (error) {
    console.error(
      "Error fetching posts: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/application", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, jobPosition, coverLetter } = req.body;
    const resumeFilePath = req.file.path;
    const resumeFileName = req.file.originalname;

    // Read the file
    const file = fs.createReadStream(resumeFilePath);

    // Create FormData for the file upload
    const form = new FormData();
    form.append("files", file, { filename: resumeFileName });

    // Upload resume to Strapi
    const fileUploadResponse = await axios.post(
      `${process.env.STRAPI_API_URL}/api/upload`,
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          ...form.getHeaders(),
        },
      }
    );

    const resumeId = fileUploadResponse.data[0].id;

    // Create the application entry
    const response = await axios.post(
      `${process.env.STRAPI_API_URL}/api/applications`,
      {
        data: {
          name,
          email,
          jobPosition,
          coverLetter,
          resume: resumeId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ data: response.data });
  } catch (error) {
    console.error(
      "Error submitting career application: ",
      error.response ? error.response.data : error.message
    );
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.details
    ) {
      console.error("Validation details: ", error.response.data.error.details);
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create the contact entry
    const response = await axios.post(
      `${process.env.STRAPI_API_URL}/api/contacts`,
      {
        data: {
          name,
          email,
          subject,
          message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ data: response.data });
  } catch (error) {
    console.error(
      "Error submitting contact form: ",
      error.response ? error.response.data : error.message
    );
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.details
    ) {
      console.error("Validation details: ", error.response.data.error.details);
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/leaderships", cacheMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.STRAPI_API_URL}/api/leaderships?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    const modifiedData = response.data.data.map((leader) => {
      const imageUrl =
        leader.images?.formats?.medium?.url
          ? `${process.env.STRAPI_API_URL}${leader.images.formats.medium.url}`
          : null;
      

      return {
        id: leader.id,
        images: imageUrl,
        name: leader.name,
        role: leader.position,
        about: leader.about,
      };
    });
    res.json({ data: modifiedData });
  } catch (error) {
    console.error(
      "Error fetching leadership data: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});





export default router;
