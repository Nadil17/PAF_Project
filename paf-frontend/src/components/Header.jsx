import React , {useState , useEffect}from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome } from 'react-icons/fa';


function Header({ user }) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch all users when component mounts
    axios.get('http://localhost:8080/api/getAllUsers')
      .then((res) => {
        setAllUsers(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch users', err);
      });
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== '') {
      const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow">
    {/* Left - Home + Buttons */}
    <div className="flex space-x-4 items-center">
      {/* Home Icon Button */}
      <button
        onClick={() => navigate('/home')}
        className="text-blue-600 hover:text-blue-800 transition duration-200 text-xl"
        title="Home"
      >
        <FaHome />
      </button>

      {/* Create Post Button */}
      <button
        onClick={() => navigate('/createPost')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Create Post
      </button>

      {/* Create Learning Plan Button */}
      <button
        onClick={() => navigate('/create_a_learning_plan')}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
      >
        Create Learning Plan
      </button>
    </div>

    {/* Center - Search */}
    <div className="relative w-1/3">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search users..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {showDropdown && filteredUsers.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow max-h-60 overflow-y-auto">
          {filteredUsers.map((u) => (
            <li
              key={u.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
              onClick={() => {
                setSearchTerm('');
                setShowDropdown(false);
                navigate(`/searchauser/${u.id}`); // navigate to user profile
              }}
            >
              <img src={u.imageUrl} alt={u.name} className="w-6 h-6 rounded-full" />
              <span>{u.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Right - User Avatar and Name */}
    <div
      className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
      onClick={() => navigate('/dashboard')}
      title="Go to Dashboard"
    >
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold">
        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </div>
      <span className="text-gray-700 font-medium">{user?.name || 'User'}</span>
    </div>
  </div>
  );
}

export default Header;
