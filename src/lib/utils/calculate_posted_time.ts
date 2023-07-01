
export function calculate_posted_time(publication_date: string) {
  let time_now = new Date(Date.now());
  let time_now_splited = time_now.toISOString().slice(0, 10).split('-').map(Number);
  let publication_date_splited = publication_date.split('-').map(Number);
  let output: number;
  if (time_now_splited[0] - publication_date_splited[0] > 0) {
    output = time_now_splited[0] - publication_date_splited[0];
    return `${output}y`;
  }
  if (
    (time_now_splited[1] * 30 +
      time_now_splited[2]) -
    (publication_date_splited[1] * 30 +
      publication_date_splited[2]) >
    90
  ) {
    output =
      Math.round(((time_now_splited[1] * 30 +
        time_now_splited[2]) -
        (publication_date_splited[1] * 30 +
          publication_date_splited[2])) / 30);
    return `${output} months`;
  }
  output =
    (time_now_splited[1] * 30 +
      time_now_splited[2]) -
    (publication_date_splited[1] * 30 +
      publication_date_splited[2]);
  return `${output}d`;
}
