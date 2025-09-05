const CleanNumberInput = ({
  value,
  onChange,
  placeholder = "",
  className = "",
}) => {
  const handleChange = (e) => {
    let val = e.target.value.replace(/,/g, ''); // Remove commas before parsing

    if (val === "") {
      onChange(0); // Return 0 instead of empty string
      return;
    }

    // Always allow numbers with optional decimal point
    if (/^(\d+\.?\d*|\.\d+)$/.test(val)) {
      if (val.endsWith('.') || val === '.') {
        // If user is typing a decimal, temporarily keep as string
        onChange(val);
      } else {
        // Convert to number for final value
        const numValue = Number(val);
        onChange(isNaN(numValue) ? 0 : numValue);
      }
    }
  };

  const formatIndianNumber = (num) => {
    // Handle both string and number inputs
    const numStr = typeof num === 'number' ? num.toString() : num || '';
    
    if (!numStr || isNaN(numStr)) return numStr;

    const [intPart, decPart] = numStr.split(".");

    let lastThree = intPart.slice(-3);
    let rest = intPart.slice(0, -3);

    if (rest !== "") {
      rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      lastThree = "," + lastThree;
    }

    const formatted = rest + lastThree;

    return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
  };

  // Determine display value
  const displayValue = (() => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' && (value.endsWith('.') || value === '.')) return value;
    return formatIndianNumber(value);
  })();

  return (
    <input
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200 ${className}`}
      onBlur={(e) => {
        // When field loses focus, ensure we save a number
        const val = e.target.value.replace(/,/g, '');
        if (val === "" || val === ".") {
          onChange(0);
        } else if (/^(\d+\.?\d*|\.\d+)$/.test(val)) {
          onChange(Number(val));
        }
      }}
    />
  );
};

export default CleanNumberInput;