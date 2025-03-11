// Define an enum for Membership Types
export enum MembershipType {
  SILVER = "Silver",
  GOLD = "Gold",
  PLATINUM = "Platinum",
  POINT = "Point",
}

// Define an enum for Discount Values
export enum DiscountValue {
  SILVER = 5,
  GOLD = 7,
  PLATINUM = 10,
}

// Define the membership options using enums
export const optionsMembership = [
  {
    value: MembershipType.SILVER,
    label: `${MembershipType.SILVER} (${DiscountValue.SILVER}%)`,
  },
  {
    value: MembershipType.GOLD,
    label: `${MembershipType.GOLD} (${DiscountValue.GOLD}%)`,
  },
  {
    value: MembershipType.PLATINUM,
    label: `${MembershipType.PLATINUM} (${DiscountValue.PLATINUM}%)`,
  },
  { value: MembershipType.POINT, label: MembershipType.POINT },
];

// Updated getDiscountValue function
export const getDiscountValue = (value: string): number => {
  switch (value) {
    case MembershipType.SILVER:
      return DiscountValue.SILVER;
    case MembershipType.GOLD:
      return DiscountValue.GOLD;
    case MembershipType.PLATINUM:
      return DiscountValue.PLATINUM;
    default:
      return 0; // Default case for "Point" or unrecognized types
  }
};

type ToggleButtonOption = {
  label: string;
  value: string;
};

// Function to create options
export const getToggleButtonOptions = (
  member?: {
    type: string;
    points: number;
  } | null
): ToggleButtonOption[] => {
  if (!member) return [];

  switch (member.type) {
    case MembershipType.POINT:
      return [{ label: `${member.points} Pts`, value: `${member.type}` }];
    default:
      return [
        { label: `${getDiscountValue(member.type)}%`, value: `${member.type}` },
        { label: `${member.points} Pts`, value: `${member.type}` },
      ];
  }
};
