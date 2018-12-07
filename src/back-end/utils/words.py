import re
from typing import List

from phonetics import nysiis

RUSSIAN_LETTERS = frozenset('АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯЙ')
RUSSIAN_VOWELS = frozenset('АЕЁИОУЭЮЯЫ')
RUSSIAN_CONSONANTS = RUSSIAN_LETTERS - RUSSIAN_VOWELS
ENGLISH_LETTERS = frozenset('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
ENGLISH_VOWELS = frozenset('AEIOUY')
ENGLISH_CONSONANTS = ENGLISH_LETTERS - ENGLISH_VOWELS

split_regex = re.compile(r'\W+')


def tokenize(text: str) -> List[str]:
    return [token for token in split_regex.split(text) if token and token.isalpha()]


def is_russian_letter(letter: str):
    return letter in RUSSIAN_LETTERS


def is_english_letter(letter: str):
    return letter in ENGLISH_LETTERS


def is_russian_word(word: str):
    return all(map(is_russian_letter, word.upper()))


def is_english_word(word: str):
    return all(map(is_english_letter, word.upper()))


def is_russian_text(text: str):
    return all(map(is_russian_word, tokenize(text)))


def is_english_text(text: str):
    return all(map(is_english_word, tokenize(text)))


def is_word(word: str):
    return is_english_word(word) or is_russian_word(word)


def language(word: str):
    if is_russian_word(word):
        return 'ru'
    elif is_english_word(word):
        return 'en'
    else:
        return None


def ngram_lang(ngram: List[str]):
    if not ngram:
        return None
    first = ngram[0]
    lang = language(first)
    for word in ngram[1:]:
        next_lang = language(word)
        if next_lang != lang:
            return None
    return lang


def iter_ngrams(words: List[str], n: int):
    for index, word in enumerate(words[:len(words) - n + 1]):
        ngram = []
        ngram.append(word)
        for i in range(1, n):
            ngram.append(words[index + i])
        yield tuple(ngram)


def convert(word: str) -> str:
    word = word.upper()
    if language(word) == 'en':
        return nysiis(word)
    elif language(word) == 'ru':
        word = word.replace('Ю', 'У')
        for letter in RUSSIAN_CONSONANTS - frozenset('Й'):
            word = word.replace(letter, '')
        return word[:-1] + 'ЙО' if word[-1:] == 'Ё' else word
