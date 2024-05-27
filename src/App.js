import React, { useState } from "react";
import "./App.css";
import PercentageSlider from "./PercentageSlider";

function App() {
  const [selectedDonor, setSelectedDonor] = useState("Major Donor");
  const [selectedAppeal, setSelectedAppeal] = useState("Holiday Appeal");

  const sliderTitles = [
    "$0-$1000",
    "$1000-$5000",
    "$5000-$10000",
    "$10000-$20000",
    "$20000-$25000",
    "$25000-$50000",
  ];

  // Function to parse values from the title string
  const parseValuesFromTitle = (title) => {
    const numbers = title.match(/\d+/g).map(Number);
    return { initialValue: numbers[0], maxValue: numbers[1] };
  };

  return (
    <div className="App">
      <header className="App-header">
        Wilderness Committee Array Calculation Tool
      </header>
      <div>
        <select
          value={selectedDonor}
          onChange={(e) => setSelectedDonor(e.target.value)}
          className="block w-60 p-2 m-4 text-lg rounded shadow border-gray-300"
        >
          <option value="Major Donor">Major Donor</option>
          <option value="OTG">OTG</option>
          <option value="TBZ">TBZ</option>
        </select>
        <select
          value={selectedAppeal}
          onChange={(e) => setSelectedAppeal(e.target.value)}
          className="block w-60 p-2 m-4 text-lg rounded shadow border-gray-300"
        >
          <option value="Holiday Appeal">Holiday Appeal</option>
          <option value="Papers">Papers and Mailouts</option>
          <option value="Monthly">Monthly Donations</option>
        </select>
      </div>
      <div>
        {sliderTitles.map((title, index) => {
          const { initialValue, maxValue } = parseValuesFromTitle(title);
          return (
            <PercentageSlider
              key={index}
              title={title}
              calculationType={selectedDonor}
              appealType={selectedAppeal}
              initialValue={initialValue}
              maxValue={maxValue}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
