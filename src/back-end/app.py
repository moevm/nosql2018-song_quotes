import aiohttp_swagger
from aiohttp import web
from aiohttp.web_request import Request


async def ping(request: Request):
    """
    ---
    description: This end-point allow to test that service is up.
    tags:
    - Health check
    produces:
    - application/json
    responses:
        "200":
            description: successful operation.
    """
    return web.json_response({
        'from': str(request.url),
        'to': request.host,
        'status': 'ok'
    })


def main():
    app = web.Application()
    app.router.add_get('/ping', ping)
    aiohttp_swagger.setup_swagger(app)
    web.run_app(app, host='0.0.0.0', port=5000)


if __name__ == '__main__':
    main()
