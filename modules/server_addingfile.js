const express = require('express');
var router = express.Router();


router.post('/AddFiles', function(req, res) {
    console.log("rządanie o dadanie plików...");
    /*
    1. Sprawdzenie rozszerzen i wysłanie błędu gdy to się nie zgadza
    2. Przekierowanie pliku jeden po drugim do algorytmu bo nie mogę zapisywać pliku o 3Mb na dłuższy czas 
    3. Zwrócenie w postaci listy interpretacje każdego zdjęcia. Strona zwracana może być xml. (interaktywny xml?)
    Strona musi mieć możliwość akceptacji interpretacji przez uzytkownika dla każdej sekcji. 
    Każda sekcja na stronie odpowiada jednemu zdjęciu. 
    Czy w ogóle mogę przesłać kilka plików po kilka Mb w jednym rzadaniu?
    */

});



module.exports = router;