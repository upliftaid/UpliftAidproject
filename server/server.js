import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import { marked } from "marked";
import bodyParser from "body-parser";
import FormData from "form-data";
import multer from "multer";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: "uploads/" });

app.use(cors())

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/posts", async (req, res) => {
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

app.get("/posts/:id", async (req, res) => {
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

app.get("/images", async (req, res) => {
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

app.post("/posts/:id/view", async (req, res) => {
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
    res.json({ views: updatedViews });
  } catch (error) {
    console.error(
      "Error updating views: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/story", async (req, res) => {
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

app.get("/story/:id", async (req, res) => {
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

app.post("/story/:id/view", async (req, res) => {
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
    res.json({ views: updatedViews });
  } catch (error) {
    console.error(
      "Error updating views: ",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/fundraisers", async (req, res) => {
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

app.get("/fundraisers/:id", async (req, res) => {
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

app.post("/volunteer", async (req, res) => {
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

app.get("/career", async (req, res) => {
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

app.post("/application", upload.single("resume"), async (req, res) => {
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

app.post("/contact", async (req, res) => {
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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
