import { json, type RequestHandler } from "@sveltejs/kit";
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const form = await request.formData();
    const profile_photo = form.get('profile_photo');
    const cover_photo = form.get('cover_photo');
    const is_there_profile_photo = profile_photo?.size > 0 ? true : false;
    const is_there_cover_photo = cover_photo?.size > 0 ? true : false;
    const base_api_url: string = env.API_URL;
    const update_url = `${base_api_url}/users/update`;
    const files_url = `${base_api_url}/files/`;
    const access_token = cookies.get('access_token');

    let image_url_request = async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const options = {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${access_token}`
        }),
        body: formData
      };
      let response = await fetch(files_url, options);
      if (response.ok) {
        let img = await response.json();
        return img.url;
      } else {
        return '';
      }
    };

    let profile_photo_url: string = '';
    let cover_photo_url: string = '';
    if (is_there_profile_photo) {
      profile_photo_url = await image_url_request(profile_photo);
    }
    if (is_there_cover_photo) {
      cover_photo_url = await image_url_request(cover_photo);
    }

    const body = {
      ...(is_there_profile_photo ? { profile_photo: profile_photo_url } : {}),
      ...(is_there_cover_photo ? { cover_photo: cover_photo_url } : {}),
    };

    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    const response = await fetch(update_url, options);

    return json({
      status: 200,
      body: 'File upload sucessfully'
    });

  } catch (error) {

    console.error('Error processing request')
    return json({
      status: 500,
      body: 'Error processing request'
    });

  }
};
