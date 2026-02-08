const blogModel = require("../models/blog.model");
const userModel = require("../models/user.model");

exports.createBlog = async (blogData, userId) => {
  try {
    // Verify user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return { error: true, statusCode: 404, message: "User not found" };
    }

    const newBlog = new blogModel({
      title: blogData.title,
      content: blogData.content,
      author: userId,
      published: blogData.published !== undefined ? blogData.published : true,
    });

    await newBlog.save();
    await newBlog.populate("author", "name email");

    return {
      success: true,
      statusCode: 201,
      message: "Blog post created successfully",
      data: {
        id: newBlog._id.toString(),
        title: newBlog.title,
        content: newBlog.content,
        author: {
          id: newBlog.author._id.toString(),
          name: newBlog.author.name,
          email: newBlog.author.email,
        },
        published: newBlog.published,
        createdAt: newBlog.createdAt,
        updatedAt: newBlog.updatedAt,
      },
    };
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error.message || "Internal server error",
    };
  }
};

exports.getAllBlogs = async () => {
  try {
    const blogs = await blogModel
      .find({ published: true })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    const blogList = blogs.map((blog) => ({
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      author: {
        id: blog.author._id.toString(),
        name: blog.author.name,
        email: blog.author.email,
      },
      published: blog.published,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    return {
      success: true,
      statusCode: 200,
      message: "Blogs retrieved successfully",
      data: blogList,
    };
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error.message || "Internal server error",
    };
  }
};

exports.getBlogById = async (blogId) => {
  try {
    const blog = await blogModel
      .findById(blogId)
      .populate("author", "name email");

    if (!blog) {
      return { error: true, statusCode: 404, message: "Blog post not found" };
    }

    return {
      success: true,
      statusCode: 200,
      message: "Blog retrieved successfully",
      data: {
        id: blog._id.toString(),
        title: blog.title,
        content: blog.content,
        author: {
          id: blog.author._id.toString(),
          name: blog.author.name,
          email: blog.author.email,
        },
        published: blog.published,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
      },
    };
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error.message || "Internal server error",
    };
  }
};

exports.updateBlog = async (blogId, updateData, userId) => {
  try {
    const blog = await blogModel.findById(blogId);

    if (!blog) {
      return { error: true, statusCode: 404, message: "Blog post not found" };
    }

    // Check if user is the author
    if (blog.author.toString() !== userId.toString()) {
      return {
        error: true,
        statusCode: 403,
        message: "You can only edit your own posts",
      };
    }

    // Update blog
    if (updateData.title) blog.title = updateData.title;
    if (updateData.content) blog.content = updateData.content;
    if (updateData.published !== undefined) blog.published = updateData.published;

    await blog.save();
    await blog.populate("author", "name email");

    return {
      success: true,
      statusCode: 200,
      message: "Blog post updated successfully",
      data: {
        id: blog._id.toString(),
        title: blog.title,
        content: blog.content,
        author: {
          id: blog.author._id.toString(),
          name: blog.author.name,
          email: blog.author.email,
        },
        published: blog.published,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
      },
    };
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error.message || "Internal server error",
    };
  }
};

exports.deleteBlog = async (blogId, userId) => {
  try {
    const blog = await blogModel.findById(blogId);

    if (!blog) {
      return { error: true, statusCode: 404, message: "Blog post not found" };
    }

    // Check if user is the author
    if (blog.author.toString() !== userId.toString()) {
      return {
        error: true,
        statusCode: 403,
        message: "You can only delete your own posts",
      };
    }

    await blogModel.findByIdAndDelete(blogId);

    return {
      success: true,
      statusCode: 200,
      message: "Blog post deleted successfully",
    };
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error.message || "Internal server error",
    };
  }
};

exports.getMyBlogs = async (userId) => {
  try {
    const blogs = await blogModel
      .find({ author: userId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    const blogList = blogs.map((blog) => ({
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      author: {
        id: blog.author._id.toString(),
        name: blog.author.name,
        email: blog.author.email,
      },
      published: blog.published,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    return {
      success: true,
      statusCode: 200,
      message: "Your blogs retrieved successfully",
      data: blogList,
    };
  } catch (error) {
    return {
      error: true,
      statusCode: 500,
      message: error.message || "Internal server error",
    };
  }
};

