import { useFetchData } from "../../Utils/Hooks/useFetchData";
import { UserContext } from "../UseContexts/UseContexts";
import { ENDPONITS } from "../../../url";
import axios from "axios";

const UserProvider = ({ children }) => {
  const { fetchResults, refetch } = useFetchData(ENDPONITS.usersList);

  // Transform API data for UI usage
  const transformedUsers = fetchResults?.results?.map((user) => ({
    id: user.id,
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    full_name: user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim(),
    email: user.email || "",
    phone: user.phone || "",
    date_joined: user.date_joined ? user.date_joined.split("T")[0] : "", // ISO date to YYYY-MM-DD
    notification: user.notification ? "On" : "Off", // boolean
    totalTasks: user.total_tasks, // Placeholder
    pending: user.pending_tasks,         // Placeholder
  })) || [];



  // Create new user with file support
 const createNewUser = async (formData) => {
  const token = localStorage.getItem("authToken");

  console.log("formdata",formData)

  const payload = {
    first_name: formData.first_name,
    last_name: formData.last_name,
    is_active: formData.is_active,
    password: formData.password,
    date_joined: formData.date_joined,
    phone: formData.phone,
    email: formData.email,
  }

  console.log("payload",payload)

  try {
    await axios.post(ENDPONITS.usersList, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Do not set 'Content-Type' manually; Axios will set it automatically
      },
    });
    await refetch();
  } catch (err) {
  console.error("Error creating user:", err);

  const errors = err.response?.data?.message;

  if (errors) {
    const messages = Object.entries(errors)
      .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
      .join("\n");

    alert("Failed to create user:\n" + messages);
  } else {
    alert("An unexpected error occurred.");
  }
}

};







  // Update user (image update not handled here but can be added if needed)
  const updateUser = async (data) => {
    console.log("data",data)
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        // email: data.email,
        is_active: data.is_active,
        // phone: data.phone,
        // notification: data.notification,
        full_name: data.full_name,
        date_joined: data.date_joined,

      };

      console.log("payload",payload)
      

      await axios.patch(`${ENDPONITS.usersList}/${data.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await refetch();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // Delete user
  const deleteUser = async (user) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${ENDPONITS.usersList}/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      await refetch();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const value = {
    usersList: transformedUsers,
    createNewUser,
    updateUser,
    deleteUser,
    refetchUsers: refetch,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
