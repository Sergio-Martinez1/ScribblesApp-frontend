export const fetchPosts = async (url: string) => {
  let output = { data: null, status: 500 };
  const options = { method: 'GET' };
  const response = await fetch(url, options);
  try {
    if (response.ok) {
      const data = await response.json();
      output.status = data.status;
      output.data = data.data;
      return output;
    } else {
      output.status = response.status;
      return output;
    }
  } catch (error) {
    return output;
  }
};
