import moment from "moment";

export const formattedTimeStamp = (value: string, timestamp?: string) => {
  const isValidDate = moment(value, moment.ISO_8601, true).isValid();
  return isValidDate
    ? moment(value).format(timestamp ? timestamp : "YYYY MMM DD")
    : "Invalid Date";
};
