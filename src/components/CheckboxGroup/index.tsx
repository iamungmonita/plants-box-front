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
  { label: "Can View", value: "1000" },
  { label: "Can Edit", value: "1001" },
  { label: "Can Manage Stock", value: "1002" },
  { label: "Can Checkout", value: "1003" },
];

export default function CheckboxGroup() {
  const { control, watch } = useFormContext<FormValues>();

  const watchSelected = watch("codes", []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Select Permissions</h2>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 mb-3 text-lg cursor-pointer"
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
  );
}
