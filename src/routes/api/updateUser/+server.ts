import { json, type RequestHandler } from "@sveltejs/kit";
import { env } from '$env/dynamic/private';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __route = __filename.slice(__filename.indexOf('src'));

export const PUT: RequestHandler = async ({ request, cookies }) => {
    const base_api_url: string = env.API_URL;
    const update_user_url = `${base_api_url}/users/update`;
    const access_token = cookies.get('access_token');
    const form = await request.formData();
    const dark_mode = form.get('dark_mode');
    const color_scheme = form.get('color_scheme');

    if (!base_api_url) {
        console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`)
        return json({
            status: 500,
            body: 'Error processing request'
        });
    }

    if (!access_token) {
        return json({
            status: 401,
            body: 'Please login'
        });
    }

    const body = {
        ...(dark_mode ? { dark_mode } : { dark_mode: '' }),
        ...(color_scheme ? { color_scheme } : { color_scheme: '' })
    };

    const options = {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    let response: Response;

    try {
        response = await fetch(update_user_url, options);
    } catch (error) {
        console.error(`Error(api): Error en [${__route}].\n\t- Error al intentar actualizar dark_mode y color_scheme\n\t- ${error}`)
        return json({
            status: 500,
            body: 'Error processing request'
        });
    }

    if (response.ok) {
        return json({
            status: 200,
            body: 'Color scheme updated'
        });
    } else if (response.status === 401) {
        return json({
            status: response.status,
            body: 'Please login'
        });
    } else {
        return json({
            status: response.status,
            body: 'Error processing request'
        });
    }

}