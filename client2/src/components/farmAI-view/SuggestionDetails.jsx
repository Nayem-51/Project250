import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { suggestions } from './AIGeneratedSuggestions'; // or move suggestions to separate file
// import { suggestions } from "./ai-generated-suggestions";
import { suggestions } from "../../lib/suggestions";
const SuggestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const suggestion = suggestions.find((item) => item.id === parseInt(id));

  if (!suggestion) {
    return <div className="text-center mt-20 text-red-500">Suggestion not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 border rounded text-sm hover:bg-gray-100"
      >
        ← Back
      </button>

      <img src={suggestion.image} alt={suggestion.title} className="w-full h-64 object-cover rounded mb-4" />
      <h2 className="text-3xl font-bold mb-4">{suggestion.title}</h2>
      <p className="whitespace-pre-wrap leading-7 text-gray-700">{suggestion.details}</p>
    </div>
  );
};

export default SuggestionDetails;



