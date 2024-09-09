import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { AiOutlineUpload } from "react-icons/ai"; // Upload icon
import { MdCancel } from "react-icons/md"; // Cancel icon

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [image, setImage] = useState(user?.profileImage || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setShowConfirmation(true);
  };

  const confirmUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://gourmet-slice.onrender.com/api/user/profile-image",
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        updateUser({ ...user, profileImage: data.image });
        setImage(data.image);
        setSelectedFile(null);
        setShowConfirmation(false);
      } else {
        const errorData = await response.json();
        setError(errorData.msg || "Failed to update profile image");
        console.error("Failed to update profile image:", errorData);
      }
    } catch (error) {
      setError("Error uploading image: " + error.message);
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setShowConfirmation(false);
  };

  useEffect(() => {
    setImage(user?.profileImage || "");
  }, [user]);

  const imageUrl = image.startsWith("http")
    ? image
    : `https://gourmet-slice.onrender.com/${image.replace(/\\/g, "/")}`;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Profile Page</h1>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">User Information</h2>
        {user ? (
          <>
            <div className="flex items-center justify-center mb-6">
              <img
                src={imageUrl || "/path/to/default/image.jpg"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-green-500 shadow-md"
              />
              <div className="flex flex-col ml-4">
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <label className="flex items-center cursor-pointer mt-4">
              <span className="text-green-500 mr-2">
                <AiOutlineUpload size={24} />
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-green-600 underline">
                Change Profile Image
              </span>
            </label>
            {loading && <p className="text-green-500">Uploading image...</p>}
            {error && <p className="text-red-500">{error}</p>}
          </>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Confirm Image Upload</h3>
              <p className="mb-4">
                Are you sure you want to upload this image?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelUpload}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <MdCancel className="mr-2" />
                  Cancel
                </button>
                <button
                  onClick={confirmUpload}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
