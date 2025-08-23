import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import PostCard from "../feed/PostCard";

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalUsers, setModalUsers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (user) fetchUserPosts();
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(`/api/posts/user/${user.id}/`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowers = async () => {
    setModalLoading(true);
    try {
      const res = await axios.get(`/api/auth/users/${user.id}/followers/`);
      setModalUsers(res.data);
    } catch (err) {
      console.error(err);
      setModalUsers([]);
    } finally {
      setModalLoading(false);
    }
  };

  const fetchFollowing = async () => {
    setModalLoading(true);
    try {
      const res = await axios.get(`/api/auth/users/${user.id}/following/`);
      setModalUsers(res.data);
    } catch (err) {
      console.error(err);
      setModalUsers([]);
    } finally {
      setModalLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setModalUsers([]);
    type === "followers" ? fetchFollowers() : fetchFollowing();
  };

  const closeModal = () => {
    setShowModal(false);
    setModalUsers([]);
    setModalType("");
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/like/`);
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? { ...p, is_liked: res.data.is_liked, likes_count: res.data.likes_count }
            : p
        )
      );
    } catch (err) {
      console.error("Error liking:", err);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/comment/`, { content });
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, res.data] } : p
        )
      );
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 flex items-center gap-6 text-white">
        <div className="text-6xl">{user?.avatar || "👤"}</div>
        <div>
          <h1 className="text-3xl font-bold">@{user?.username}</h1>
          <p className="opacity-90">{user?.email}</p>
          <div className="flex gap-8 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{posts.length}</p>
              <p className="text-sm opacity-80">Posts</p>
            </div>
            <div
              onClick={() => openModal("followers")}
              className="text-center cursor-pointer hover:scale-105 transition"
            >
              <p className="text-2xl font-bold">{user?.followers_count || 0}</p>
              <p className="text-sm opacity-80">Followers</p>
            </div>
            <div
              onClick={() => openModal("following")}
              className="text-center cursor-pointer hover:scale-105 transition"
            >
              <p className="text-2xl font-bold">{user?.following_count || 0}</p>
              <p className="text-sm opacity-80">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">No posts yet</p>
            <p className="text-gray-400">Share your first post!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-semibold capitalize">{modalType}</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scroll">
              {modalLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : modalUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No {modalType} yet
                </div>
              ) : (
                <div className="space-y-3">
                  {modalUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="text-2xl">{u.avatar || "👤"}</div>
                      <div>
                        <p className="font-medium">@{u.username}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
