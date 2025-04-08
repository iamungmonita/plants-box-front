export const routePermissions: Record<string, string[]> = {
  "/admin/settings/voucher/create": ["1009"],
  "/admin/settings/voucher/:voucherId": ["1014"],
  "/admin/settings/role/create": ["1007"],
  "/admin/settings/role/:roleId": ["1012"],
  "/admin/settings/users/create": ["1006"],
  "/admin/settings/users/:userId": ["1011"],
  "/admin/expense/create": ["1005"],
  "/admin/expense/:expenseId": ["1010"],
  "/admin/products/create": ["1000", "1001"],
  // Add more as needed
};
