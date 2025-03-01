import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFiles = {
  "home": "index.html",  // Updated from "home" to "index"
  "about": "about.html",
  "contact": "contact.html",
  "how-it-works": "how-it-works.html",
  "blogs": "blog.html",  // Updated from "blogs" to "blog"
  "donate": "donate.html",
  "gallery": "gallery.html",
  "careers": "career.html",  // Updated from "careers" to "career"
  "volunteers": "volunteer.html",
  "success-stories": "success-story.html",
  "blog-single": "blog-single.html",
  "fundraisers-single": "fundraisers-single.html",
  "success-story-single": "success-story-single.html"
};

Object.keys(htmlFiles).forEach((key) => {
  router.get(`/${key}`, (req, res) => {
    const filePath = path.join(__dirname, `../../${htmlFiles[key]}`);
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send('File not found');
      }
    });
  });
});

export default router;
