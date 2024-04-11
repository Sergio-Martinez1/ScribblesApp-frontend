import { env } from "$env/dynamic/private";
import { error, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request, cookies, url }) => {

  const api_url: string | undefined = env.API_URL;
  const access_token = cookies.get('access_token');
  const offset = url.searchParams.get('offset') ?? '0';
  const limit = url.searchParams.get('limit') ?? '10';
  let data: Array<any> | null = null;


  if (access_token) {
    const endpoint = `${api_url}/posts/home?offset=${offset}&limit=${limit}`;
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`
      }
    };

    const response = await fetch(endpoint, options);
    if (response.ok) {
      data = await response.json();
    } else {
      throw error(response.status, response.statusText);
    }
  } else {
    const endpoint = `${api_url}/posts/pagination?offset=${offset}&limit=${limit}`;
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    };
    const response = await fetch(endpoint, options);
    if (response.ok) {
      data = await response.json();
    } else {
      throw error(response.status, response.statusText);
    }
  }

  return new Response(JSON.stringify(data), { status: 200 })
}
