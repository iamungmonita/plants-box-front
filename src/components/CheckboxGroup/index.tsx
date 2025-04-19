import { useFormContext, Controller } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

type FormValues = {
  codes: string[]; // Store only values
};

// Updated options with labels & values
const options: Option[] = [
  { label: "Can View Products", value: "1017" },
  { label: "Can Create Product", value: "1000" },
  { label: "Can Edit Product", value: "1001" },
  { label: "Can Cancel & Retrieve Order", value: "1002" },
  { label: "Can Download Sales", value: "1003" },
  { label: "Can Edit Log", value: "1004" },
  { label: "Can Create Expense", value: "1005" },
  { label: "Can Create Users", value: "1006" },
  { label: "Can Create Roles", value: "1007" },
  { label: "Can Create Membership", value: "1008" },
  { label: "Can Create Voucher", value: "1009" },
  { label: "Can Edit Expense", value: "1010" },
  { label: "Can Edit Users", value: "1011" },
  { label: "Can Edit Roles", value: "1012" },
  { label: "Can Edit Membership", value: "1013" },
  { label: "Can Edit Voucher", value: "1014" },
  { label: "Can Sell", value: "1015" },
  { label: "Can Update Exchange Rate", value: "1016" },
  { label: "Is Owner", value: "9999" },
];

export default function CheckboxGroup() {
  const { control } = useFormContext<FormValues>();
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Select Permissions</h2>
      <div className="grid grid-cols-3 gap-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 mb-3 cursor-pointer"
          >
            <Controller
              name="codes"
              control={control}
              render={({ field }) => {
                // Ensure field.value is always an array of strings
                const currentValues = field.value || [];

                return (
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={currentValues.includes(option.value)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;

                      const updatedValues = isChecked
                        ? [...currentValues, option.value] // Store only `value`
                        : currentValues.filter((val) => val !== option.value); // Remove if unchecked

                      field.onChange(updatedValues);
                    }}
                    className="w-6 h-6"
                  />
                );
              }}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
