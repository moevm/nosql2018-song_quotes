import json
import logging
from functools import partial

import aiohttp_swagger
from aiohttp import web
from aiohttp.web_request import Request

from alg.phonetics import is_word, language, convert

logging.basicConfig(level=logging.INFO)
logger: logging.Logger = logging.getLogger('MAIN')


async def ping_handler(request: Request):
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


async def is_word_handler(request: Request):
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
    result = {
        'word': word,
        'result': is_word(word)
    }
    if is_word(word):
        result['language'] = language(word)
        result['sound'] = convert(word)
    return web.json_response(result, dumps=partial(json.dumps, ensure_ascii=False))


def config_routes(app):
    app.router.add_get('/ping', ping_handler)
    app.router.add_get('/word/{word}', is_word_handler)


def main():
    app = web.Application()

    config_routes(app)

    aiohttp_swagger.setup_swagger(app, swagger_url='/doc')

    web.run_app(app, host='0.0.0.0', port=5000)


if __name__ == '__main__':
    main()
