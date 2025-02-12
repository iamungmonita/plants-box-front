import moment from "moment";

export const formattedTimeStamp = (timestamp: string) => {
  // Validate if timestamp is a valid date
  const isValidDate = moment(timestamp, moment.ISO_8601, true).isValid();
  return isValidDate
    ? moment(timestamp).format("YYYY/MM/DD - HH:mm:ss a")
    : "Invalid Date";
};
