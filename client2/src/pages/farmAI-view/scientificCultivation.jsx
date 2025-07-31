import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getScmEntries } from "../../store/common-slice/index"; 


const ScientificCultivation = () => {
  const dispatch = useDispatch();
  const [selectedAdvice, setSelectedAdvice] = useState(null); 

  // Fetch expert advice from Redux store
  const { scmList } = useSelector((state) => state.commonFeature);

  // Fetch expert advice data when component mounts
  useEffect(() => {
    dispatch(getScmEntries());
  }, [dispatch]);

  useEffect(() => {
    if (scmList.length > 0) {
      setSelectedAdvice(scmList[0]); // Set the first advice as default
    }
  }, [scmList]);

  // Function to handle selection of an advice item (missing part)
  const handleSelectAdvice = (advice) => {
    setSelectedAdvice(advice);
  };

 // Function to format description without splitting by full stops
 const formatDescription = (description) => {
  // Split the description by numbered lists (e.g., 1., 2., etc.) and colons
  const descriptionParts = description.split(/(\d+\.\s.*?:)/g);

  return descriptionParts.map((part, index) => {
    // Check if the part starts with a numbered list and ends with a colon
    if (/^\d+\.\s.*?:$/.test(part)) {
      return (
        <div key={index} className="mt-2 block">
          <strong>{part.trim()}</strong> {/* Bold the number and text before the colon */}
          <br /> {/* Start a new line */}
        </div>
      );
    }

    // If not a numbered list with a colon, return the part as-is
    return (
      <React.Fragment key={index}>
        {part.trim()}
      </React.Fragment>
    );
  });
};

  return (
    <div className="flex h-screen mt-16">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto border-r border-gray-300">
  <h2 className="text-2xl font-bold mb-4">Scientific Cultivation System</h2>
  <hr className="border-t-2 border-gray-300 my-4" />
  <ul className="space-y-16 mt-10">
    {scmList.length > 0 ? (
      scmList.map((advice) => (
        <li
          key={advice._id}
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => handleSelectAdvice(advice)} // Handle the advice selection here
        >
          <img
            src={advice.path}
            alt={advice.crop_name}
            className="w-16 h-16 rounded object-cover"
          />
          <div className="flex-grow pr-4"> {/* Adjusted padding-right */}
            <h3 className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-[15rem]"> {/* Fixed width for the title */}
              {advice.crop_name}
            </h3>
            <button className="text-xs text-green-600 border border-green-600 rounded-full px-2 py-1 mt-2">
              Read
            </button>
          </div>
        </li>
      ))
    ) : (
      <p>No expert advice available.</p>
    )}
  </ul>
</div>

      {/* Right Main Content */}
      <div className="w-3/4 bg-white p-8 overflow-y-auto scrollbar-hide">
        {selectedAdvice ? (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-center">{selectedAdvice.crop_name}</h2>
            {selectedAdvice.path && (
              <img
                src={selectedAdvice.path}
                alt={selectedAdvice.crop_name}
                className="w-2/3 h-auto mb-4 mx-auto rounded-md my-10" // Adjusting image size
              />
            )}

            {/* Formatted description */}
            <div className="text-md mb-4 mt-8">{formatDescription(selectedAdvice.description)}</div>

          </div>
        ) : (
          <p className="text-lg text-gray-500">Please select an advice to view details.</p>
        )}
      </div>
    </div>
  );
};

export default ScientificCultivation;
