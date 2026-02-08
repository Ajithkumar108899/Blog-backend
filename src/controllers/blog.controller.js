const response = require("../utils/response.util");
const blogService = require("../services/blog.service");

exports.createBlog = async (req, res, next) => {
  const userId = req.user.id;
  const blogResponse = await blogService.createBlog(req.body, userId);
  if (blogResponse.error) {
    return response.error(res, blogResponse.statusCode, blogResponse.message);
  }
  return response.success(
    res,
    blogResponse.statusCode,
    blogResponse.message,
    blogResponse.data
  );
};

exports.getAllBlogs = async (req, res, next) => {
  const blogResponse = await blogService.getAllBlogs();
  if (blogResponse.error) {
    return response.error(res, blogResponse.statusCode, blogResponse.message);
  }
  return response.success(
    res,
    blogResponse.statusCode,
    blogResponse.message,
    blogResponse.data
  );
};

exports.getBlogById = async (req, res, next) => {
  const blogId = req.params.id;
  const blogResponse = await blogService.getBlogById(blogId);
  if (blogResponse.error) {
    return response.error(res, blogResponse.statusCode, blogResponse.message);
  }
  return response.success(
    res,
    blogResponse.statusCode,
    blogResponse.message,
    blogResponse.data
  );
};

exports.updateBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user.id;
  const blogResponse = await blogService.updateBlog(blogId, req.body, userId);
  if (blogResponse.error) {
    return response.error(res, blogResponse.statusCode, blogResponse.message);
  }
  return response.success(
    res,
    blogResponse.statusCode,
    blogResponse.message,
    blogResponse.data
  );
};

exports.deleteBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user.id;
  const blogResponse = await blogService.deleteBlog(blogId, userId);
  if (blogResponse.error) {
    return response.error(res, blogResponse.statusCode, blogResponse.message);
  }
  return response.success(res, blogResponse.statusCode, blogResponse.message);
};

exports.getMyBlogs = async (req, res, next) => {
  const userId = req.user.id;
  const blogResponse = await blogService.getMyBlogs(userId);
  if (blogResponse.error) {
    return response.error(res, blogResponse.statusCode, blogResponse.message);
  }
  return response.success(
    res,
    blogResponse.statusCode,
    blogResponse.message,
    blogResponse.data
  );
};

