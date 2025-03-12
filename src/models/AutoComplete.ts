export interface AutocompleteTypeProps {
  options: { label: string; value: string }[]; // Change options type to objects with label and value
  name: string;
  label: string;
  onChange?: (value: string) => void; // Optional onChange prop
}
