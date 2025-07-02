import { Link } from 'react-router-dom';

function ModuleCard({ title, description, icon, link }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <Link
        to={link}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Explore
      </Link>
    </div>
  );
}

export default ModuleCard;