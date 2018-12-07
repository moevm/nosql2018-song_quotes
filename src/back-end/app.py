import itertools

from flask import Flask, request, jsonify
from flask_caching import Cache
from flask_pymongo import PyMongo
from flask_pymongo.wrappers import Collection

from .utils.words import is_word, language, convert, tokenize, ngram_lang, iter_ngrams

app = Flask(__name__)
app.config.from_json("config.json")
mongo = PyMongo(app)
cache = Cache(app, config={
    'CACHE_TYPE': 'redis',
    'CACHE_REDIS_HOST': 'localhost',
    'CACHE_REDIS_PORT': 6379
})


def get_collection():
    collection: Collection = mongo.db.songs
    return collection


@app.route('/ping', methods=['GET'])
def ping_handler():
    return jsonify({
        'from': str(request.url),
        'to': request.host,
        'status': 'ok'
    })


@app.route('/word/<string:word>')
def is_word_handler(word: str):
    result = {
        'word': word,
        'result': is_word(word)
    }
    if is_word(word):
        result['language'] = language(word)
        result['sound'] = convert(word)
    return jsonify(result)


@app.route('/ngram/<string:ngram>')
def is_ngram(ngram: str):
    result = {
        'ngram': ngram
    }
    words = tokenize(ngram)
    lang = ngram_lang(words)

    if all(map(is_word, words)) and lang:
        result['result'] = True
        result['language'] = lang
        result['sound'] = [convert(word) for word in words]
        return jsonify(result)
    result['result'] = False
    return jsonify(result)


@app.route('/song', methods=['POST'])
def create_song():
    song: dict = request.json

    response = {
        'status': True,
        'song': song
    }
    code = 200

    if is_enough_info_for_song(song):
        collection = get_collection()
        if collection:
            song['lang'] = ngram_lang(tokenize(song['text']))
            collection.insert_one(song)
            song['_id'] = str(song['_id'])
            response['song'] = song
        else:
            code = create_error_message(response, 'Cannot determine language')
    else:
        code = create_error_message(response, 'Not enough info for song')
    return jsonify(response), code


@app.route('/song/<string:id>', methods=['PUT'])
def update_song(id: str):
    song: dict = request.json
    response = {
        'status': True,
        'id': id,
        'song': song
    }
    code = 200

    if is_enough_info_for_song(song):
        collection: Collection = get_collection()
        if collection:
            song['lang'] = ngram_lang(tokenize(song['text']))
            result = collection.update_one({
                '_id': id
            }, {
                '$set': song
            })
            if not result.modified_count:
                code = create_error_message(response, 'No matches were found.')
            else:
                song['_id'] = str(song['_id'])
                response['song'] = song
        else:
            code = create_error_message(response, 'Cannot determine language')
    else:
        code = create_error_message(response, 'Not enough ino for song.')
    return jsonify(response), code


def create_error_message(response: dict, message: str):
    response['status'] = False
    response['error'] = message
    return 406


@app.route('/song/<string:id>', methods=['DELETE'])
def delete_song(id: str):
    response = {
        'status': True,
        'id': id,
    }
    code = 200

    filter = {'_id': id}
    deleted = get_collection().delete_one(filter).deleted_count
    if not deleted:
        code = 404
        response['status'] = False
    return jsonify(response), code


@app.route('/song/<string:id>', methods=['GET'])
def get_song(id: str):
    response = {
        'status': True,
        'id': id,
    }
    code = 200

    filter = {'_id': id}
    result: dict = get_collection().find_one(filter)
    if not result:
        code = 404
        response['status'] = False
    else:
        response['song'] = result
    return jsonify(response), code


@app.route('/song', methods=['GET'])
def get_songs():
    size = int(request.args.get('size', '10'))
    page = int(request.args.get('page', '1'))
    lang = str(request.args.get('lang', 'en')).lower()
    to_skip = (page - 1) * size

    response = {
        'status': True,
        'size': size,
        'page': page,
        'lang': lang
    }
    code = 200

    if lang not in ['en', 'ru']:
        code = create_error_message(response, 'Cannot determine language.')
        return jsonify(response), code

    collection: Collection = get_collection()
    count = collection.count_documents({})
    response['count'] = count
    if 5 < size < 50 and page > 0 and to_skip <= count:
        response['songs'] = []
        skip = collection.find({'lang': lang}).skip(to_skip)
        for _ in range(count - to_skip):
            item = skip.next()
            item['_id'] = str(item['_id'])
            response['songs'].append(item)
    else:
        code = create_error_message(response, 'Wrong size')

    return jsonify(response), code


@app.route('/rhyme/<ngram>', methods=['GET'])
@cache.cached(timeout=30, key_prefix='rhymes_')
def rhyme(ngram: str):
    limit = int(request.args.get('limit', '10'))
    words = tokenize(ngram)

    endings = []
    lang = ngram_lang(words)
    if lang == 'ru':
        endings += [convert(ending)[-1:] for ending in words]
    elif lang == 'en':
        endings += [convert(ending)[-2:] for ending in words]

    collection: Collection = get_collection()
    fetched_songs = collection.find({'lang': lang})
    found = 0
    result = []
    number_of_docs = collection.count_documents({})
    for _ in range(number_of_docs):
        song = fetched_songs.next()
        song['_id'] = str(song['_id'])
        ngrams_found = {}

        for ngram in iter_ngrams(tokenize(song['text']), len(endings)):
            try:
                converted = [convert(x) for x in ngram]
            except IndexError:
                pass  # Some words dont' work with this algorithm.
            filtered = list(map(lambda x: x[1].endswith(x[0]), zip(endings, converted)))
            filtered = all(filtered)
            if filtered:
                count = ngrams_found.get(ngram, 0)
                ngrams_found[ngram] = count + 1

        if ngrams_found:
            found += 1
            result.append({
                'song': song,
                'words': list(itertools.chain(*ngrams_found)),
                'statistics': [{'ngram': k, 'count': ngrams_found[k]} for k in ngrams_found]
            })

        if found == limit:
            break
    return jsonify({
        'result': result,
        'limit': limit,
        'found': found
    })


def is_enough_info_for_song(song):
    return 'text' in song.keys() and 'artist' in song.keys() and 'title' in song.keys()


def main():
    app.run()


if __name__ == '__main__':
    main()
