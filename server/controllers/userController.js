import User from "../models/User.js";
import fs from "fs";
import imagekit from "../configs/imagekit.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
import { inngest } from "../inngest/index.js";

// -------------------------
// Get User Data
// -------------------------
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -------------------------
// Update User Data
// -------------------------
export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    let { username, bio, location, full_name } = req.body;

    const tempUser = await User.findById(userId);
    if (!tempUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // Keep old username if not provided
    if (!username) username = tempUser.username;

    // Check if username is changing and already taken
    if (tempUser.username !== username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        username = tempUser.username; // do not change if taken
      }
    }

    const updatedData = { username, bio, location, full_name };

    const profile = req.files?.profile?.[0];
    const cover = req.files?.cover?.[0];

    // Upload profile picture
    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });
      updatedData.profile_picture = url;
    }

    // Upload cover photo
    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname, // ✅ fixed bug
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
      updatedData.cover_photo = url;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -------------------------
// Discover Users
// -------------------------
export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input } = req.body;

    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });

    // Exclude self
    const filteredUsers = allUsers.filter((user) => user._id.toString() !== userId);

    res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -------------------------
// Follow User
// -------------------------
export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    if (userId === id) {
      return res.json({ success: false, message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const toUser = await User.findById(id);

    if (!user || !toUser) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.following.includes(id)) {
      return res.json({ success: false, message: "You are already following this user" });
    }

    user.following.push(id);
    toUser.followers.push(userId);

    await user.save();
    await toUser.save();

    res.json({ success: true, message: "Now you are following this user" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -------------------------
// Unfollow User
// -------------------------
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    if (userId === id) {
      return res.json({ success: false, message: "You cannot unfollow yourself" });
    }

    const user = await User.findById(userId);
    const toUser = await User.findById(id);

    if (!user || !toUser) {
      return res.json({ success: false, message: "User not found" });
    }

    user.following = user.following.filter((u) => u.toString() !== id);
    toUser.followers = toUser.followers.filter((u) => u.toString() !== userId);

    await user.save();
    await toUser.save();

    res.json({ success: true, message: "You are no longer following this user" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -------------------------
// Send Connection Request
// -------------------------
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    if (userId === id) {
      return res.json({ success: false, message: "You cannot connect with yourself" });
    }

    // Check last 24 hours limit
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionRequests = await Connection.find({
      from_user_id: userId,
      created_at: { $gt: last24Hours },
    });

    if (connectionRequests.length >= 20) {
      return res.json({
        success: false,
        message: "You have sent more than 20 connection requests in the last 24 hours",
      });
    }

    // Check existing connection
    const existingConnection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    if (!existingConnection) {
      const newConnection = await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      });

      await inngest.send({
        name: "app/connection-request",
        data: { connectionId: newConnection._id },
      });

      return res.json({ success: true, message: "Connection request sent successfully" });
    } else if (existingConnection.status === "accepted") {
      return res.json({ success: false, message: "You are already connected with this user" });
    }

    return res.json({ success: false, message: "Connection request pending" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -------------------------
// Get User Connections
// -------------------------
export const getUserConnections = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId).populate("connections followers following");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const pendingConnections = (
      await Connection.find({ to_user_id: userId, status: "pending" }).populate("from_user_id")
    ).map((connection) => connection.from_user_id);

    res.json({
      success: true,
      connections: user.connections,
      followers: user.followers,
      following: user.following,
      pendingConnections,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -------------------------
// Accept Connection Request
// -------------------------
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    if (userId === id) {
      return res.json({ success: false, message: "Invalid connection request" });
    }

    const connection = await Connection.findOne({ from_user_id: id, to_user_id: userId });
    if (!connection) {
      return res.json({ success: false, message: "Connection not found" });
    }

    if (connection.status === "accepted") {
      return res.json({ success: false, message: "Connection already accepted" });
    }

    const user = await User.findById(userId);
    const toUser = await User.findById(id);

    if (!user || !toUser) {
      return res.json({ success: false, message: "User not found" });
    }

    // Prevent duplicates
    if (!user.connections.includes(id)) user.connections.push(id);
    if (!toUser.connections.includes(userId)) toUser.connections.push(userId);

    await user.save();
    await toUser.save();

    connection.status = "accepted";
    await connection.save();

    res.json({ success: true, message: "Connection accepted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// -------------------------
// Get User Profiles
// -------------------------
export const getUserProfiles = async (req, res) => {
  try {
    const { profileId } = req.body;
    const profile = await User.findById(profileId);
    if (!profile) {
      return res.json({ success: false, message: "Profile not found" });
    }

    const posts = await Post.find({ user: profileId }).populate("user");

    res.json({ success: true, profile, posts });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
