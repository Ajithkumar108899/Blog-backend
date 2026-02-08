const router = require("express").Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} = require("../controllers/blog.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  validateCreateBlog,
  validateUpdateBlog,
} = require("../validations/blog.validation");

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// Protected routes (require authentication)
router.post("/", authenticate, validateCreateBlog, createBlog);
router.get("/my/posts", authenticate, getMyBlogs);
router.put("/:id", authenticate, validateUpdateBlog, updateBlog);
router.delete("/:id", authenticate, deleteBlog);

module.exports = router;

