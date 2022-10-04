import moment from "moment";

export const convertTimestampToDate = (
  timestamp,
  format = "DD MMM YYYY HH:mm:ss"
) => {
  const time = timestamp * 1000;
  return moment(time).format(format);
};

export const convertBlockTimestampToDate = timestamp => {
  return moment(new Date(timestamp)).format("DD MMM YYYY HH:mm:ss");
};
