from phonetics import nysiis

RUSSIAN_LETTERS = frozenset('АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ')
RUSSIAN_VOWELS = frozenset('АЕЁИОУЭЮЯ')
RUSSIAN_CONSONANTS = RUSSIAN_LETTERS - RUSSIAN_VOWELS
ENGLISH_LETTERS = frozenset('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
ENGLISH_VOWELS = frozenset('AEIOUY')
ENGLISH_CONSONANTS = ENGLISH_LETTERS - ENGLISH_VOWELS


def is_russian_letter(letter: str):
    return letter in RUSSIAN_LETTERS


def is_english_letter(letter: str):
    return letter in ENGLISH_LETTERS


def is_russian_word(word: str):
    return all(map(is_russian_letter, word.upper()))


def is_english_word(word: str):
    return all(map(is_english_letter, word.upper()))


def is_word(word: str):
    return is_english_word(word) or is_russian_word(word)


def language(word: str):
    if is_russian_word(word):
        return 'ru'
    elif is_english_word(word):
        return 'en'
    else:
        return None


def convert(word: str) -> str:
    if language(word) == 'en':
        return nysiis(word)
    elif language(word) == 'ru':
        word = word.upper() \
            .replace('Ю', 'У') \
            .replace('Б', 'П') \
            .replace('З', 'С') \
            .replace('Д', 'Т') \
            .replace('В', 'Ф') \
            .replace('Г', 'К') \
            .replace('ТС', 'Ц')
        return word[:-1] + 'ЙО' if word[-1:] == 'Ё' else word
