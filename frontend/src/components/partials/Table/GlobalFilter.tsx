import React, { useState } from "react";
import TextInput from "@/components/ui/TextInput";

const GlobalFilter = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);
  const onChange = (e) => {
    setValue(e.target.value);
    setFilter(e.target.value || undefined);
  };
  return (
    <div>
      <TextInput
        value={value || ""}
        onChange={onChange}
        placeholder="search..."
      />
    </div>
  );
};

export default GlobalFilter;
