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


async def is_word(request: Request):
    """
    ---
    description: This end-point tests
    tags:
    - Health check
    produces:
    - application/json
    responses:
        "200":
            description: successful operation.
    """
    word: str = request.match_info['word']
    return web.json_response({
        'word': word,
        'result': word.isalpha()
    })


def main():
    app = web.Application()
    app.router.add_get('/ping', ping)
    app.router.add_get('/word/{word}', is_word)
    aiohttp_swagger.setup_swagger(app, swagger_url='/doc')
    web.run_app(app, host='0.0.0.0', port=5000)


if __name__ == '__main__':
    main()
