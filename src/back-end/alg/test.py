import unittest

from alg.phonetics import convert


class Test(unittest.TestCase):
    def test_convert(self):
        self.assertEqual(['ПРИФЕТ'], convert('Привет'))
