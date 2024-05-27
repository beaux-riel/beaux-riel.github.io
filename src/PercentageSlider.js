import React, { useState, useEffect } from "react";

function PercentageSlider({
  title,
  calculationType,
  appealType,
  initialValue,
  maxValue,
}) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [percentages, setPercentages] = useState([0, 0, 0]);
  const [baseOutputs, setBaseOutputs] = useState(
    getBaseOutputs(calculationType, appealType)
  );
  const [roundToFive, setRoundToFive] = useState(false);
  const [roundToTen, setRoundToTen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [formulas, setFormulas] = useState(["", "", ""]);

  function getBaseOutputs(calculationType, appealType) {
    const baseOutputs = {
      "Holiday Appeal": {
        "Major Donor": [0.9, 1.0, 1.45],
        OTG: [1.1, 1.4, 1.9],
        TBZ: [5, 6, 7.5],
      },
      Papers: {
        "Major Donor": [0.9, 1.0, 1.45],
        OTG: [0.65, 0.8, 0.9],
        TBZ: [3, 3.3, 3.8],
      },
      Monthly: {
        "Major Donor": [0.9, 1.0, 1.45],
        OTG: [0.09, 0.15, 0.2],
        TBZ: [1.11, 1.3, 1.4],
      },
    };

    return baseOutputs[appealType][calculationType] || [1, 1, 1];
  }

  // Update baseOutputs and formulas when calculationType or appealType changes
  useEffect(() => {
    setBaseOutputs(getBaseOutputs(calculationType, appealType));
  }, [calculationType, appealType]);

  useEffect(() => {
    updateFormulas();
  }, [inputValue, percentages, baseOutputs, roundToFive, roundToTen]);

  const updateFormulas = () => {
    const newFormulas = percentages.map((percentage, index) => {
      let output = inputValue * baseOutputs[index] * (1 + percentage / 100);
      let formula = `${inputValue} * ${baseOutputs[index]} * (1 + ${percentage} / 100)`;

      if (roundToFive) {
        output = Math.ceil(output / 5) * 5;
        formula = `ceil(${formula} / 5) * 5`;
      } else if (roundToTen) {
        output = Math.ceil(output / 10) * 10;
        formula = `ceil(${formula} / 10) * 10`;
      }

      return formula;
    });

    setFormulas(newFormulas);
  };

  const calculateOutput = (index) => {
    let output =
      inputValue * baseOutputs[index] * (1 + percentages[index] / 100);

    if (roundToFive) {
      output = Math.ceil(output / 5) * 5;
    } else if (roundToTen) {
      output = Math.ceil(output / 10) * 10;
    }

    return output;
  };

  const handleInputChange = (event) => {
    const newValue = Math.min(
      Math.max(Number(event.target.value), initialValue),
      maxValue
    );
    setInputValue(newValue);
  };

  const handlePercentageChange = (index, event) => {
    const newPercentages = [...percentages];
    newPercentages[index] = Number(event.target.value);
    setPercentages(newPercentages);
  };

  const handleBaseOutputChange = (index, event) => {
    const newBaseOutputs = [...baseOutputs];
    newBaseOutputs[index] = Number(event.target.value);
    setBaseOutputs(newBaseOutputs);
  };

  return (
    <div className="p-4 space-y-4">
      {title && <h1 className="text-lg font-semibold">{title}</h1>}
      <button
        onClick={() => setVisible(!visible)}
        className="mb-2 text-sm text-blue-500"
      >
        {visible ? "Minimize" : "Maximize"}
      </button>
      {visible && (
        <div className="flex-1 space-x-4 items-center">
          <div>
            <label
              htmlFor="inputValue"
              className="block text-sm font-medium text-gray-700"
            >
              Enter value:
            </label>
            <input
              type="range"
              min={initialValue}
              max={maxValue}
              value={inputValue}
              onChange={handleInputChange}
              className="slider"
            />
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              className="ml-2 w-20 p-1 border rounded"
            />
          </div>
          <div className="flex w-[80%] items-center justify-center space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Outputs:
            </label>
            {percentages.map((percentage, index) => (
              <div key={index} className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => handlePercentageChange(index, e)}
                  className="mt-1 w-full"
                />
                <div className="text-right">{percentage}%</div>
                <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm">
                  {calculateOutput(index).toFixed(2)}
                </div>
                <input
                  type="number"
                  value={baseOutputs[index]}
                  onChange={(e) => handleBaseOutputChange(index, e)}
                  className="mt-1 block w-full p-1 border rounded"
                />
                <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm">
                  {formulas[index]}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rounding Options:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={roundToFive}
                onChange={() => {
                  setRoundToFive(!roundToFive);
                  if (!roundToFive) setRoundToTen(false); // Ensure mutual exclusivity
                }}
                className="form-checkbox"
              />
              <span>Round to nearest $5</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={roundToTen}
                onChange={() => {
                  setRoundToTen(!roundToTen);
                  if (!roundToTen) setRoundToFive(false); // Ensure mutual exclusivity
                }}
                className="form-checkbox"
              />
              <span>Round to nearest $10</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PercentageSlider;
